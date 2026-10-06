/**
 * Feste Oberflaechentexte (Navigation, Formular, Fussbereich).
 *
 * Inhaltstexte stehen NICHT hier, sondern in src/content/*.yml - die pflegt
 * Klara im CMS. Hier stehen nur Woerter, die zum Geruest der Seite gehoeren.
 */
import type { Locale } from '../config/site';

export const ui = {
  de: {
    'nav.about': 'Über mich',
    'nav.repertoire': 'Repertoire',
    'nav.contact': 'Kontakt',
    'nav.skip': 'Zum Inhalt springen',
    'nav.menu': 'Menü',

    'repertoire.back': 'Zurück zur Startseite',
    'repertoire.request': 'Wunschstück nicht dabei? Schreibt es in die Anfrage.',
    'repertoire.contact': 'Zur Anfrage',

    'form.name': 'Name',
    'form.email': 'E-Mail',
    'form.date': 'Datum der Feier',
    'form.place': 'Ort',
    'form.kind': 'Art der Feier',
    'form.kind.church': 'Kirchliche Trauung',
    'form.kind.civil': 'Standesamt',
    'form.kind.reception': 'Empfang oder Agape',
    'form.kind.other': 'Etwas anderes',
    'form.message': 'Nachricht',
    'form.messagePlaceholder': 'Was habt ihr vor? Gibt es ein Stück, das auf jeden Fall dabei sein soll?',
    'form.consent': 'Ich bin einverstanden, dass meine Angaben zur Beantwortung der Anfrage verarbeitet werden.',
    'form.consentLink': 'Datenschutzerklärung',
    'form.submit': 'Anfrage senden',
    'form.sending': 'Wird gesendet …',
    'form.success': 'Danke, die Anfrage ist angekommen. Ihr hört innerhalb von zwei Tagen von mir.',
    'form.error': 'Das Senden hat nicht geklappt. Schreibt mir bitte direkt an',
    'form.required': 'Pflichtfeld',
    'form.optional': 'optional',

    'footer.imprint': 'Impressum',
    'footer.privacy': 'Datenschutz',
    'footer.photo': 'Fotos',

    'error.title': 'Diese Seite gibt es nicht',
    'error.text': 'Vielleicht hat sich die Adresse geändert.',
    'error.home': 'Zur Startseite',
  },
  en: {
    'nav.about': 'About me',
    'nav.repertoire': 'Repertoire',
    'nav.contact': 'Contact',
    'nav.skip': 'Skip to content',
    'nav.menu': 'Menu',

    'repertoire.back': 'Back to the start page',
    'repertoire.request': 'Piece not on the list? Mention it in your enquiry.',
    'repertoire.contact': 'Send an enquiry',

    'form.name': 'Name',
    'form.email': 'Email',
    'form.date': 'Date of the celebration',
    'form.place': 'Place',
    'form.kind': 'Kind of celebration',
    'form.kind.church': 'Church ceremony',
    'form.kind.civil': 'Registry office',
    'form.kind.reception': 'Reception or drinks',
    'form.kind.other': 'Something else',
    'form.message': 'Message',
    'form.messagePlaceholder': 'What do you have in mind? Is there a piece that has to be part of it?',
    'form.consent': 'I agree that my details may be processed in order to answer this enquiry.',
    'form.consentLink': 'privacy policy',
    'form.submit': 'Send enquiry',
    'form.sending': 'Sending …',
    'form.success': 'Thank you, your enquiry arrived. You will hear from me within two days.',
    'form.error': 'Sending failed. Please write to me directly at',
    'form.required': 'required',
    'form.optional': 'optional',

    'footer.imprint': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.photo': 'Photos',

    'error.title': 'This page does not exist',
    'error.text': 'The address may have changed.',
    'error.home': 'To the start page',
  },
} as const;

export type UiKey = keyof (typeof ui)['de'];

/** Oberflaechentext holen. Fehlt die Uebersetzung, kommt die deutsche Fassung. */
export function t(locale: Locale, key: UiKey): string {
  const dict = ui[locale] as Record<string, string> | undefined;
  return dict?.[key] ?? ui.de[key];
}
