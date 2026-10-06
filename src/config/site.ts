/**
 * Zentrale Sprach-Konfiguration.
 *
 * -> Englisch einschalten: bei "en" enabled auf true setzen, committen, fertig.
 *    Dann werden /en/... Seiten gebaut, der Sprachumschalter erscheint und
 *    hreflang-Tags werden gesetzt. Sonst aendert sich nichts.
 *
 * -> Solange enabled: false gilt, entsteht KEIN englisches HTML. Die englischen
 *    Texte koennen trotzdem im CMS gepflegt werden.
 */

export type Locale = 'de' | 'en';

export interface LocaleConfig {
  /** Beschriftung im Sprachumschalter */
  label: string;
  /** Wert fuer <html lang="..."> */
  htmlLang: string;
  /** Wert fuer hreflang */
  hreflang: string;
  /** false = Sprache wird nicht gebaut */
  enabled: boolean;
}

export const defaultLocale: Locale = 'de';

export const locales: Record<Locale, LocaleConfig> = {
  de: { label: 'Deutsch', htmlLang: 'de-AT', hreflang: 'de-AT', enabled: true },
  en: { label: 'English', htmlLang: 'en', hreflang: 'en', enabled: false },
};

/** Alle aktiven Sprachen, Standardsprache zuerst. */
export const enabledLocales: Locale[] = (Object.keys(locales) as Locale[])
  .filter((locale) => locales[locale].enabled)
  .sort((a, b) => (a === defaultLocale ? -1 : b === defaultLocale ? 1 : 0));

/** Aktive Sprachen ohne die Standardsprache - daraus entstehen die /[lang]/ Routen. */
export const secondaryLocales: Locale[] = enabledLocales.filter((locale) => locale !== defaultLocale);

/** Sprachumschalter nur zeigen, wenn es wirklich etwas zu wechseln gibt. */
export const showLangSwitcher: boolean = enabledLocales.length > 1;
