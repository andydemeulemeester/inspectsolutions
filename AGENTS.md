# AGENTS.md

Instructies voor AI-agents en ontwikkelaars die aan InspectSolutions werken. Projectcontext: zie [README.md](README.md) en [InspectSolutions-projectbrief.md](InspectSolutions-projectbrief.md).

## Branches en omgevingen
- Ontwikkel en test **altijd op `dev`**. Push niet rechtstreeks naar `prd`.
- `prd` = productie (`https://inspect.gapsolutions.be`), `dev` = preview (`https://dev.inspect.gapsolutions.be`). Hosting: zie [docs/03-hosting-cloudflare.md](docs/03-hosting-cloudflare.md).

## Nieuwe versie uitrollen
1. Pas bestanden aan in `public/` **op de branch `dev`**.
2. **Verhoog `VERSION` in `public/sw.js` én in `public/app.js`** (bv. `1.0.1`), naar dezelfde waarde. Zonder nieuwe versie haalt de service worker niets nieuws binnen.
3. Push naar `dev`. Test op `https://dev.inspect.gapsolutions.be` (zie [docs/03-hosting-cloudflare.md](docs/03-hosting-cloudflare.md), punt 6).
4. Merge `dev` naar `prd`. Productie wordt automatisch bijgewerkt.
5. De gsm haalt de nieuwe versie op de achtergrond op en toont “Nieuwe versie beschikbaar”. De oude versie blijft werken tot de gebruiker bijwerkt. Lokale data (IndexedDB) blijft ongemoeid.

## DEV en PRD herkennen
Dezelfde code draait op beide omgevingen. `public/env.js` kiest op basis van het adres: enkel `inspect.gapsolutions.be` is PRD, elk ander adres is DEV (andere naam “InspectSolutions DEV”, roze-rood icoon met DEV-balk via `manifest-dev.webmanifest`, DEV-label in de kop). Nieuwe bestanden voor het manifest of de iconen moeten ook in `SHELL` in `public/sw.js` staan.

## Regels
- Gebruik voor `dev` een aparte test-Sheet, Drive-map en Apps Script-deployment. Zet geen echte gegevens op `dev`.
- Zet de Apps Script-URL en de geheime sleutel **nooit** in de code of de repo. Ze worden op het toestel ingevoerd in Beheer.
- Wijzig het IndexedDB-schema alleen additief (nieuwe stores of velden). Een update mag nog niet-gesynchroniseerde data nooit wissen.
- Houd de tekst van de 80 items uit de klantlijst ongewijzigd (zie het projectbrief, punt 10).
- Geen externe CDN-afhankelijkheden: alles moet offline in de cache kunnen. De CSP in `public/_headers` staat enkel eigen bestanden en `script.google.com` toe.
- Zet geen `routes` of domeinen in `wrangler.jsonc`; die worden in het Cloudflare-dashboard beheerd.
- Na een wijziging aan `apps-script/Code.gs`: opnieuw implementeren (nieuwe versie) in Apps Script. De URL blijft gelijk.
