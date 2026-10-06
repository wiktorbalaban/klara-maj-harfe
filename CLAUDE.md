# Arbeitsanweisungen für Claude Code

Statische Website für eine Harfenistin, die Hochzeiten begleitet. Astro 7,
kein Framework-Anteil, kein Server. Inhalte liegen im Repo und werden von einer
nicht-technischen Person über Pages CMS bearbeitet.

## Der wichtigste Grundsatz

Klara bearbeitet **Felder**, kein Layout. Jede neue Funktion muss so gebaut
sein, dass sie im CMS als ausfüllbares Feld erscheint und dass ein leeres Feld
die Seite nicht kaputt macht. Freie Seitenbaukästen, Rich-Text für
Layout-Zwecke oder HTML in Inhaltsfeldern sind hier falsch.

Wer ein Inhaltsfeld hinzufügt, muss drei Stellen anfassen:

1. `src/content/*.yml` — das Feld mit Beispielwert
2. `src/lib/content.ts` — den Typ
3. `.pages.yml` — die Bearbeitungsmaske

Fehlt Schritt 3, existiert das Feld für Klara nicht. `npm run check:cms`
prüft genau das und schlägt fehl, wenn ein Schlüssel aus `src/content/`
in `.pages.yml` fehlt. Der Check läuft auch in der CI.

Zweisprachige Felder im CMS nicht ausschreiben, sondern die Komponenten
`zweisprachigKurz` und `zweisprachigLang` aus `.pages.yml` verwenden.

## Zweisprachigkeit

- Zweisprachige Felder sind Objekte: `{ de: "...", en: "..." }`
- Immer über `pick(feld, locale)` aus `src/i18n/utils.ts` auslesen, nie direkt.
  `pick` fällt auf Deutsch zurück, wenn die Übersetzung leer ist.
- Feste Oberflächentexte gehören in `src/i18n/ui.ts`, nicht ins CMS.
- Namen von Komponisten, Filmen und Stücken werden **nicht** übersetzt.
- Neue Seite anlegen heißt: eine View in `src/views/`, eine Route in
  `src/pages/` und dieselbe Route in `src/pages/[lang]/` mit
  `getStaticPaths` über `secondaryLocales`.
- Englisch ist über `src/config/site.ts` abgeschaltet. Diesen Schalter nicht
  umgehen und nicht ohne Auftrag umlegen.

## Gestaltung

Die Farbwahl hat einen Grund: An der Harfe sind die C-Saiten rot, damit sich die
Spielerin orientieren kann. Das Granatrot `--string` ist deshalb kein Schmuck,
sondern Orientierung — Name im Kopf, kurze Marke am Abschnittsanfang, eine
einzelne Saite im Kopfbereich. Sparsam bleiben. Kein zusätzliches Rot für
Hintergründe, Rahmen oder Hover-Flächen.

- Farben und Stufen stehen als Custom Properties in `src/styles/global.css`.
  Keine festen Hex-Werte in Komponenten.
- Schriften: Newsreader für Gelesenes, Karla für Bedienelemente. Keine dritte
  Schrift.
- Bewegung: genau eine, das Saitenmotiv beim Laden. Keine Effekte beim Scrollen,
  keine Hover-Animationen auf Flächen. `prefers-reduced-motion` respektieren.
- Komponenten-CSS bleibt in der jeweiligen `.astro`-Datei.

## Technische Randbedingungen

- Inhalte werden zur Buildzeit mit `fs` gelesen (`src/lib/content.ts`). Nach
  Änderungen an YAML-Dateien den Dev-Server neu starten, falls er sie nicht
  bemerkt.
- Bilder liegen in `public/media/`, weil das CMS dorthin hochlädt. Deshalb
  laufen sie **nicht** durch `astro:assets`. `<img>` immer mit `width`,
  `height` und `loading="lazy"` (außer dem Titelbild).
- Keine Client-Frameworks hinzufügen. Der einzige JavaScript-Anteil ist das
  Kontaktformular.
- Keine Schriften oder Skripte von fremden Servern nachladen (DSGVO). Alles wird
  selbst ausgeliefert. Einzige Ausnahme: Cloudflare Turnstile, das steht so in
  der Datenschutzerklärung.

## Prüfen

```bash
npm run build      # muss ohne Fehler durchlaufen
npm run check      # Typen und CMS-Konfiguration
npm run check:cms  # nur: passt .pages.yml zu src/content/?
```

Nach Layout-Änderungen mindestens bei 375 px, 768 px und 1280 px Breite
ansehen sowie mit der Tastatur durch das Formular gehen.

## Offene Punkte

**Vor dem Livegang — Inhalte (Klara liefert):**

- [ ] `PLATZHALTER`-Stellen in `src/content/home.yml` ersetzen (Text über sie)
- [ ] `PLATZHALTER` in `src/content/settings.yml`: E-Mail, Telefon, Region
- [ ] Impressum und Datenschutz in `src/content/legal/` ausfüllen und
      rechtlich prüfen lassen (Rechtsform entscheidet über die Pflichtangaben)
- [ ] Echte Fotos statt der Platzhalter in `public/media/`
- [ ] Fotonachweise eintragen, falls die Bilder von Dritten stammen
- [ ] Repertoire gegenlesen. Beim Umsetzen korrigiert wurden:
      Clair de Lune (nicht Claire), Lakmé, Cavalleria rusticana, Aladdin,
      Gymnopédie Nr. 1 (Einzahl), Fauré, Rêverie, Joe Hisaishi (nicht
      J. Hisashi). Offen: „Just the Two of Us" ist im Original von Grover
      Washington Jr. mit Bill Withers — im Repertoire steht jetzt beides,
      bitte bestätigen lassen.

**Vor dem Livegang — Technik:**

- [ ] Domain registrieren, `SITE` in `astro.config.mjs` und die Sitemap-Zeile in
      `public/robots.txt` anpassen
- [ ] Web3Forms-Key anlegen, als Environment Variable in Cloudflare eintragen
- [ ] Turnstile einrichten (optional, aber empfohlen)
- [ ] Formular einmal echt abschicken und prüfen, ob die Mail ankommt
- [ ] Pages CMS mit dem Repo verbinden und Klara per E-Mail einladen.
      `.pages.yml` ist gegen die Pages-CMS-2.x-Dokumentation geprüft
      (Feldtypen, `components`, `list`/`collapsible`, `group`, `media`);
      im echten CMS trotzdem einmal jede Maske öffnen und speichern.
- [ ] Cloudflare Web Analytics aktivieren, falls Statistik gewünscht ist

**Später möglich:**

- [ ] Englisch freischalten (`src/config/site.ts`), vorher Übersetzungen
      gegenlesen lassen
- [ ] Hörbeispiele: Die Vorlage feinstimmig.at hat welche, die Skizze nicht.
      Wenn gewünscht, als eigener Abschnitt mit Audiodateien aus `public/media/`
      oder eingebetteten Links — Einbettung von fremden Anbietern nur mit
      Ergänzung in der Datenschutzerklärung.
- [ ] Stimmen von Brautpaaren, falls Klara welche sammelt
- [ ] Bilder beim Build verkleinern, falls die Uploads zu groß werden
