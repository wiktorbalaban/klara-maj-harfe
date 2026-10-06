#!/usr/bin/env node
/**
 * Prueft, ob .pages.yml und die Inhaltsdateien zusammenpassen.
 *
 * Der Sinn: Jedes Feld, das in src/content/ steht, muss im CMS als Formularfeld
 * auftauchen. Sonst kann Klara es nicht aendern und merkt es nicht einmal.
 *
 *   FEHLER  - ein Schluessel steht in der Inhaltsdatei, aber nicht in .pages.yml
 *             (fuer Klara unsichtbar)
 *   HINWEIS - ein Feld steht in .pages.yml, aber (noch) nicht in der Inhaltsdatei
 *             (harmlos: das CMS legt den Schluessel beim Speichern an)
 *
 * Aufruf: npm run check:cms
 */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const root = process.cwd();
const configPath = path.join(root, '.pages.yml');

const errors = [];
const notes = [];

function readYaml(file) {
  return load(fs.readFileSync(file, 'utf8'));
}

/** Frontmatter aus einer Markdown-Datei ziehen. */
function readFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, hasBody: raw.trim() !== '' };
  return { data: load(match[1]) ?? {}, hasBody: match[2].trim() !== '' };
}

/** component: durch die Definition aus components: ersetzen. */
function resolveField(field, components) {
  if (!field.component) return field;
  const base = components?.[field.component];
  if (!base) {
    errors.push(`Feld "${field.name}" verweist auf die unbekannte Komponente "${field.component}".`);
    return field;
  }
  return { ...base, ...field, component: undefined };
}

/** Deklarierte Felder gegen die tatsaechlichen Daten vergleichen. */
function compare(fields, data, components, trail) {
  if (data === null || data === undefined) return;

  const resolved = (fields ?? []).map((field) => resolveField(field, components));
  const declared = new Map(resolved.map((field) => [field.name, field]));

  if (!Array.isArray(data) && typeof data === 'object') {
    for (const key of Object.keys(data)) {
      if (!declared.has(key)) {
        errors.push(`${trail}.${key} steht in der Inhaltsdatei, fehlt aber in .pages.yml.`);
      }
    }
  }

  for (const field of resolved) {
    const value = Array.isArray(data) ? undefined : data?.[field.name];

    if (value === undefined) {
      notes.push(`${trail}.${field.name} ist in .pages.yml deklariert, steht aber nicht in der Inhaltsdatei.`);
      continue;
    }

    const isList = field.list === true || (typeof field.list === 'object' && field.list !== null);

    if (isList) {
      if (!Array.isArray(value)) {
        errors.push(`${trail}.${field.name} ist als Liste deklariert, die Inhaltsdatei hat aber keine Liste.`);
        continue;
      }
      if (field.type === 'object') {
        value.forEach((item, index) => {
          compare(field.fields, item, components, `${trail}.${field.name}[${index}]`);
        });
      }
      continue;
    }

    if (field.type === 'object') {
      compare(field.fields, value, components, `${trail}.${field.name}`);
    }
  }
}

/** Alle Dateieintraege einsammeln, auch die in Gruppen. */
function collectFiles(entries, found = []) {
  for (const entry of entries ?? []) {
    if (entry.type === 'group') collectFiles(entry.items, found);
    else if (entry.type === 'file') found.push(entry);
  }
  return found;
}

if (!fs.existsSync(configPath)) {
  console.error('.pages.yml nicht gefunden.');
  process.exit(1);
}

const config = readYaml(configPath);
const components = config.components ?? {};
const files = collectFiles(config.content);

if (files.length === 0) errors.push('.pages.yml enthaelt keine Dateieintraege.');

for (const entry of files) {
  const target = path.join(root, entry.path);

  if (!fs.existsSync(target)) {
    errors.push(`${entry.name}: Datei ${entry.path} fehlt.`);
    continue;
  }

  if (entry.format === 'yaml-frontmatter') {
    const { data, hasBody } = readFrontmatter(target);
    const declaresBody = (entry.fields ?? []).some((field) => field.name === 'body');
    if (hasBody && !declaresBody) {
      errors.push(`${entry.name}: Die Datei hat Text unter dem Frontmatter, aber kein Feld "body".`);
    }
    compare(
      (entry.fields ?? []).filter((field) => field.name !== 'body'),
      data,
      components,
      entry.name
    );
  } else {
    compare(entry.fields, readYaml(target), components, entry.name);
  }
}

// Medienpfade in den Inhalten muessen unter dem konfigurierten output liegen.
const mediaOutput = typeof config.media === 'string' ? `/${config.media}` : config.media?.output;
if (mediaOutput) {
  for (const entry of files.filter((file) => file.format === 'yaml')) {
    const raw = fs.readFileSync(path.join(root, entry.path), 'utf8');
    for (const match of raw.matchAll(/^\s*(photo|image):\s*(\S+)\s*$/gm)) {
      const value = match[2].replace(/^["']|["']$/g, '');
      if (value && !value.startsWith(mediaOutput)) {
        errors.push(`${entry.name}: Bildpfad ${value} liegt nicht unter ${mediaOutput}.`);
      }
    }
  }
}

for (const note of notes) console.log(`HINWEIS  ${note}`);
for (const error of errors) console.error(`FEHLER   ${error}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} Problem(e) gefunden.`);
  process.exit(1);
}

console.log(`\n.pages.yml passt zu den Inhaltsdateien (${files.length} Dateien geprüft).`);
