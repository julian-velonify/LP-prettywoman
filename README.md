# Landingpage Brautkleid-Beratung · Pretty Woman Wedding Styles

Entwurf einer conversion-optimierten Termin-Landingpage für Neukundinnen aus Meta Ads (Ziel-URL-Vorschlag: `/brautkleid-beratung/`).

- Eine Datei: `index.html` (HTML, CSS, JS inline; Schriften Bodoni Moda + Jost über Google Fonts)
- Bilder werden direkt von prettywoman-brautmoden.de geladen
- Kalender: BridalLive-Scheduler als iframe, mit Fallback-Link
- CTAs tragen `data-cta` (hero, reviews, curvy, close, dock, fallback) für GTM-Klick-Trigger

## Aufbau

1. Hero mit 4,9 ★ / 265 Google-Bewertungen und CTA zum Kalender
2. Ablauf des Termins in 5 Schritten bis zur Glocke
3. Kalender + „Wann heiratest du?“-Zeitstrahl (Lieferzeit 6–9 Monate)
4. Echte Google-Rezensionen
5. Preisrahmen (Outlet 500–1.500 €, Kollektion ab 1.300 €)
6. Curvy-Block Gr. 30–66
7. FAQ
8. Mobil: fester „Termin wählen“-Button

Seite steht auf `noindex`.

## Tracking

- GTM-Container `GTM-PLBF7LSN` (derselbe wie prettywoman-brautmoden.de), lädt erst nach Klick auf „Alle akzeptieren“
- Google Consent Mode v2: Standard `denied`, Update auf `granted` bei Zustimmung; Auswahl in `localStorage` (`pw_consent`), änderbar über „Cookie-Einstellungen“ im Footer
- dataLayer-Events: `consent_choice` (consent), `lp_cta_click` (cta), `lp_calendar_view`, `lp_wedding_month` (wedding_month)
