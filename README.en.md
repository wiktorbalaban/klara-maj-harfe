# klara-maj-harfe

Static website for a harpist. Astro, no server, no CMS backend.
Content lives as YAML and Markdown in the repo and is edited via Pages CMS.

## Quick start

```bash
nvm use            # Node 22
npm install
cp .env.example .env
npm run dev        # http://localhost:4321
npm run build      # output to dist/
npm run check      # types and CMS configuration
```

`npm run check:cms` compares `.pages.yml` with the content files: every
key in `src/content/` must have a form field in the CMS, otherwise Klara
cannot edit it. The check also runs in the GitHub Action.

## Structure

| Path | Content |
| --- | --- |
| `src/config/site.ts` | Language switch. **This is where English is turned on and off.** |
| `src/content/*.yml` | All texts and image references. The CMS writes exactly here. |
| `src/content/legal/*.md` | Imprint and privacy policy, one file per language. |
| `src/i18n/ui.ts` | Fixed interface texts (navigation, form). Not in the CMS. |
| `src/views/` | Page scaffolds used for both languages. |
| `src/pages/` | German routes. `src/pages/[lang]/` generates the translated routes. |
| `.pages.yml` | The forms Klara sees in the CMS. Checked against the Pages CMS 2.x docs. |
| `scripts/check-cms-config.mjs` | Checks that `.pages.yml` and `src/content/` match. |
| `public/media/` | Images. Currently placeholders. |

## Bilingual setup

German lives at the root (`/repertoire/`), every additional language under its
code (`/en/repertoire/`).

English is currently **off**: in `src/config/site.ts`, `en` has
`enabled: false`. As a result, `getStaticPaths` in `src/pages/[lang]/` returns an
empty list, no English HTML is generated, the language switcher does not appear,
and no hreflang tags are set. The English texts can nevertheless already be
maintained.

To turn it on, set `enabled: true` and commit. If you want it proofread first:
turn it on in a branch — Cloudflare builds a separate preview URL for it.

If an English translation is missing, the page shows the German version
(`pick()` in `src/i18n/utils.ts`). An empty spot never occurs.

## Contact form

Sending goes through [Web3Forms](https://web3forms.com): the form sends the
fields via `fetch` to their API, from where an email goes to the stored
address. No backend required.

```
PUBLIC_WEB3FORMS_KEY=...        # required, otherwise the form shows the email address
PUBLIC_TURNSTILE_SITE_KEY=...   # optional, spam protection; empty = off
```

Both values end up in the HTML and are therefore public. That is how Web3Forms
is intended to work. In Cloudflare they belong under Environment Variables so
that the build knows them.

Additionally, the form has a honeypot (`botcheck`) that only bots fill in.

## Deployment

Cloudflare Workers with static assets:

1. Connect the repo in Cloudflare (Workers → Git)
2. Build command `npm run build`, output directory `dist`
3. Set environment variables (see above)
4. `main` is production, other branches get preview URLs

Every commit — including one from the CMS — triggers a build.

## Domain

`.at` has no residency restriction, but the contract runs directly between the
owner and nic.at. For that reason, **register the domain in Klara's name**, not
the developer's. Registrar is free to choose; point the nameservers to
Cloudflare.

After purchase, change `SITE` in `astro.config.mjs` and the sitemap line in
`public/robots.txt` to the real domain.

## Legal

`src/content/legal/` contains placeholders per § 5 ECG and § 25 Mediengesetz
(small website). Have Klara fill them in and get them reviewed before going
live — which details are required depends on her legal form.

Fonts are self-hosted (`@fontsource-variable`); there is no connection to Google
Fonts. Without cookies and without trackers, the site needs no cookie banner. If
statistics are desired: Cloudflare Web Analytics, which works without cookies.
