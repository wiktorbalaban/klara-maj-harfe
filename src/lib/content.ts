import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import type { LocalizedString } from '../i18n/utils';

/**
 * Inhalte werden zur Buildzeit aus src/content/*.yml gelesen.
 * Das CMS schreibt genau in diese Dateien; ein Commit loest einen neuen Build aus.
 */

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

function readYaml<T>(file: string): T {
  const full = path.join(CONTENT_DIR, file);
  try {
    return load(fs.readFileSync(full, 'utf8')) as T;
  } catch (error) {
    throw new Error(`Inhaltsdatei ${file} konnte nicht gelesen werden: ${(error as Error).message}`);
  }
}

export interface Settings {
  name: string;
  instrument: string;
  email: string;
  phone?: string;
  region: LocalizedString;
  social: { instagram?: string; youtube?: string; facebook?: string };
  seo: { description: LocalizedString; image: string };
}

export interface HomeContent {
  hero: {
    headline: LocalizedString;
    intro: LocalizedString;
    photo: string;
    photoAlt: LocalizedString;
    photoCredit?: string;
  };
  about: {
    title: LocalizedString;
    text: LocalizedString;
    photo: string;
    photoAlt: LocalizedString;
    photoCredit?: string;
  };
  repertoire: {
    title: LocalizedString;
    text: LocalizedString;
    highlights: { source: string; work: string }[];
    linkLabel: LocalizedString;
  };
  contact: {
    title: LocalizedString;
    text: LocalizedString;
    note?: LocalizedString;
  };
}

export interface RepertoirePiece {
  source: string;
  works: string[];
}

export interface RepertoireGroup {
  id: string;
  title: LocalizedString;
  pieces: RepertoirePiece[];
}

export interface RepertoireContent {
  intro: LocalizedString;
  groups: RepertoireGroup[];
}

export const settings = readYaml<Settings>('settings.yml');
export const home = readYaml<HomeContent>('home.yml');
export const repertoire = readYaml<RepertoireContent>('repertoire.yml');

/** Rechtstexte liegen als Markdown vor, je eine Datei pro Sprache. */
const legalModules = import.meta.glob<{
  frontmatter: { title: string; updated?: string };
  Content: any;
}>('../content/legal/*.md', { eager: true });

export function legalDoc(slug: 'impressum' | 'datenschutz', locale: string) {
  const wanted = `${slug}.${locale}.md`;
  const key =
    Object.keys(legalModules).find((k) => k.endsWith(wanted)) ??
    Object.keys(legalModules).find((k) => k.endsWith(`${slug}.de.md`));
  if (!key) throw new Error(`Rechtstext ${wanted} fehlt in src/content/legal/`);
  return legalModules[key];
}
