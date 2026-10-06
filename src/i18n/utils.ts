import { defaultLocale, enabledLocales, type Locale } from '../config/site';

/** Ein zweisprachiges Feld aus den YAML-Dateien: { de: "...", en: "..." } */
export type LocalizedString = Partial<Record<Locale, string>>;

/**
 * Wert eines zweisprachigen Feldes holen.
 * Ist die Uebersetzung leer, wird die Standardsprache genommen - so bleibt die
 * Seite auch dann vollstaendig, wenn eine Uebersetzung noch fehlt.
 */
export function pick(field: LocalizedString | string | undefined, locale: Locale): string {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  const value = field[locale];
  if (value != null && value.trim() !== '') return value;
  return field[defaultLocale] ?? '';
}

/**
 * Pfad fuer eine Sprache bauen.
 * Standardsprache liegt an der Wurzel: /repertoire/
 * Andere Sprachen unter ihrem Kuerzel:  /en/repertoire/
 */
export function localePath(path: string, locale: Locale): string {
  const clean = '/' + path.replace(/^\/+|\/+$/g, '');
  const withSlash = clean === '/' ? '/' : clean + '/';
  if (locale === defaultLocale) return withSlash;
  return withSlash === '/' ? `/${locale}/` : `/${locale}${withSlash}`;
}

/** Sprache aus einem URL-Pfad lesen (fuer den Sprachumschalter). */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return enabledLocales.includes(segment as Locale) ? (segment as Locale) : defaultLocale;
}

/** Pfad ohne Sprachpraefix - Basis fuer die hreflang-Alternativen. */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && enabledLocales.includes(parts[0] as Locale)) parts.shift();
  return '/' + parts.join('/');
}
