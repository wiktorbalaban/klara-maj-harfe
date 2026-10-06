// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { enabledLocales, defaultLocale } from './src/config/site.js';

// Die Produktions-URL. Wird fuer Sitemap und Canonical-Tags gebraucht.
const SITE = 'https://klara-maj-harfe.at';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Deaktivierte Sprachen tauchen nicht im Build auf und damit auch nicht in der Sitemap.
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(enabledLocales.map((l) => [l, l === 'de' ? 'de-AT' : l])),
      },
    }),
  ],
  vite: {
    server: {
      // YAML-Inhalte werden zur Buildzeit mit fs gelesen; damit der Dev-Server
      // Aenderungen trotzdem bemerkt, wird der Content-Ordner beobachtet.
      watch: { ignored: ['!**/src/content/**'] },
    },
  },
});
