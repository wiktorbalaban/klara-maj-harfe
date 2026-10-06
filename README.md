# klara-maj-harfe

Statische Website für eine Harfenistin. Astro, kein Server, kein CMS-Backend.
Inhalte liegen als YAML und Markdown im Repo und werden über Pages CMS bearbeitet.

## Schnellstart

```bash
nvm use            # Node 22
npm install
cp .env.example .env
npm run dev        # http://localhost:4321
npm run build      # Ausgabe nach dist/
npm run check      # Typen und CMS-Konfiguration
```

`npm run check:cms` vergleicht `.pages.yml` mit den Inhaltsdateien: Jeder
Schlüssel aus `src/content/` muss im CMS ein Formularfeld haben, sonst kann
Klara ihn nicht bearbeiten. Der Check läuft auch in der GitHub-Action.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/config/site.ts` | Sprachschalter. **Hier wird Englisch ein- und ausgeschaltet.** |
| `src/content/*.yml` | Alle Texte und Bildverweise. Das CMS schreibt genau hierhin. |
| `src/content/legal/*.md` | Impressum und Datenschutz, je Sprache eine Datei. |
| `src/i18n/ui.ts` | Feste Oberflächentexte (Navigation, Formular). Nicht im CMS. |
| `src/views/` | Seitengerüste, die für beide Sprachen benutzt werden. |
| `src/pages/` | Deutsche Routen. `src/pages/[lang]/` erzeugt die übersetzten Routen. |
| `.pages.yml` | Die Formulare, die Klara im CMS sieht. Geprüft gegen die Pages-CMS-2.x-Doku. |
| `scripts/check-cms-config.mjs` | Prüft, ob `.pages.yml` und `src/content/` zusammenpassen. |
| `public/media/` | Bilder. Aktuell Platzhalter. |

## Zweisprachigkeit

Deutsch liegt an der Wurzel (`/repertoire/`), jede weitere Sprache unter ihrem
Kürzel (`/en/repertoire/`).

Englisch ist zurzeit **aus**: In `src/config/site.ts` steht bei `en`
`enabled: false`. Dadurch gibt `getStaticPaths` in `src/pages/[lang]/` eine leere
Liste zurück, es entsteht kein englisches HTML, der Sprachumschalter erscheint
nicht und es werden keine hreflang-Tags gesetzt. Die englischen Texte können
trotzdem schon gepflegt werden.

Zum Einschalten `enabled: true` setzen und committen. Wer vorher gegenlesen
lassen will: auf einem Branch einschalten, Cloudflare baut dafür eine eigene
Vorschau-URL.

Fehlt eine englische Übersetzung, zeigt die Seite die deutsche Fassung
(`pick()` in `src/i18n/utils.ts`). Eine leere Stelle entsteht nie.

## Kontaktformular

Der Versand läuft über [Web3Forms](https://web3forms.com): Das Formular schickt
die Felder per `fetch` an deren API, von dort geht eine E-Mail an die hinterlegte
Adresse. Kein Backend nötig.

```
PUBLIC_WEB3FORMS_KEY=...        # Pflicht, sonst zeigt das Formular die E-Mail-Adresse an
PUBLIC_TURNSTILE_SITE_KEY=...   # optional, Spamschutz; leer = aus
```

Beide Werte landen im HTML und sind damit öffentlich. Das ist bei Web3Forms so
vorgesehen. In Cloudflare gehören sie unter Environment Variables, damit der
Build sie kennt.

Zusätzlich hat das Formular einen Honigtopf (`botcheck`), den nur Bots ausfüllen.

## Deployment

Cloudflare Workers mit statischen Assets:

1. Repo in Cloudflare verbinden (Workers → Git)
2. Build-Befehl `npm run build`, Ausgabeverzeichnis `dist`
3. Environment Variables setzen (siehe oben)
4. `main` ist Produktion, andere Branches bekommen Vorschau-URLs

Jeder Commit — auch einer aus dem CMS — löst einen Build aus.

## Domain

`.at` hat keine Wohnsitzbeschränkung, der Vertrag läuft aber direkt zwischen
Inhaberin und nic.at. Die Domain deshalb **auf Klara registrieren**, nicht auf
den Entwickler. Registrar frei wählbar, Nameserver auf Cloudflare zeigen lassen.

Nach dem Kauf `SITE` in `astro.config.mjs` und die Sitemap-Zeile in
`public/robots.txt` auf die echte Domain ändern.

## Rechtliches

`src/content/legal/` enthält Platzhalter nach § 5 ECG und § 25 Mediengesetz
(kleine Website). Vor dem Livegang von Klara ausfüllen und prüfen lassen —
welche Angaben nötig sind, hängt von ihrer Rechtsform ab.

Schriften werden selbst ausgeliefert (`@fontsource-variable`), es besteht keine
Verbindung zu Google Fonts. Ohne Cookies und ohne Tracker braucht die Seite kein
Cookie-Banner. Wenn Statistik gewünscht ist: Cloudflare Web Analytics, das
arbeitet ohne Cookies.
