# Hosting: Cloudflare Worker op inspect.gapsolutions.be

De app draait als **één Cloudflare Worker `inspectsolutions` die enkel statische bestanden uitserveert** (static assets). De map [../public/](../public/) is de volledige site (geen build nodig). De Worker is via Workers Builds gekoppeld aan de GitHub-repo `andydemeulemeester/inspectsolutions`.

| Branch | Omgeving | Adres | Deploycommando |
|---|---|---|---|
| `prd` | Productie | `https://inspect.gapsolutions.be` | `npx wrangler deploy` |
| `dev` | Preview (test) | `https://dev.inspect.gapsolutions.be` | `npx wrangler preview` |

Werkwijze: ontwikkelen en testen op `dev`, daarna `dev` mergen naar `prd`.

## 1. Voorbereiding in de repo

1. Zorg dat de root van de repo een `wrangler.jsonc` bevat (op beide branches):

   ```jsonc
   {
     "name": "inspectsolutions",
     "compatibility_date": "2026-10-01",
     "assets": { "directory": "./public" },
     "previews": {}
   }
   ```

   Het lege `previews`-blok is verplicht voor `npx wrangler preview`; zonder faalt de build met “missing a `previews` block”.

2. Zet **geen `routes` of domeinen** in `wrangler.jsonc`. De domeinen worden in het Cloudflare-dashboard beheerd; previews moeten geconfigureerd worden in hetzelfde systeem als het custom domain.
3. Zet Wrangler **4.135.0 of nieuwer** als dev-dependency (`package.json`), want Worker Previews vereist die versie en projectcommando’s gebruiken geen nieuwere globale installatie.
4. Zorg dat beide branches (`dev` en `prd`) al een `wrangler.jsonc` en een `public/index.html` bevatten vóór je de Worker koppelt, anders mislukt de eerste build.

## 2. Worker aanmaken en koppelen aan GitHub

1. Zet de repository op GitHub (privé mag): `andydemeulemeester/inspectsolutions`, met de branches `dev` en `prd`.
2. Cloudflare dashboard > **Workers & Pages > Create** en importeer de repository (Git-integratie, **Workers**, niet Pages).
3. Instellingen (Worker > **Settings > Build**):
   - **Worker-naam:** `inspectsolutions` (moet overeenkomen met `name` in `wrangler.jsonc`)
   - **Git branch (productie):** `prd`
   - **Build command:** `npm run build` (schrijft de geheime sleutel uit het build-secret in `public/config.js`, zie punt 2b)
   - **Deploy command:** `npx wrangler deploy`
   - **Branch control:** *Builds for non-production branches* **aan**
   - **Non-production branch deploy command:** `npx wrangler preview`
4. **Save and Deploy**. Elke push naar `prd` publiceert automatisch naar productie, elke push naar `dev` werkt de preview bij.

> **Te controleren bij de eerste build:** of Workers Builds `npx wrangler preview` als deploycommando voor niet-productiebranches aanvaardt, en of de previewnaam de branchnaam `dev` wordt (zodat het adres `dev.inspect.gapsolutions.be` klopt). Lukt dat niet, gebruik dan de terugval in punt 7.

## 2b. Sleutel van het Apps Script meegeven tijdens de build
Het webadres van het Apps Script staat per omgeving in [../public/env.js](../public/env.js). De geheime sleutel komt uit een **build-secret** met de naam `GOOGLE_APPS_SCRIPT_SECRET_KEY` (Settings > Build > Variables and secrets, apart voor de dev- en de prd-omgeving). `npm run build` zet ze in `public/config.js`, waarna de app de verbinding zelf instelt en niets meer hoeft in te typen.

- `config.js` in de repo blijft leeg. Commit nooit een ingevulde sleutel.
- **Lokaal** (`npm run dev`, daarna http://localhost:8080): maak een bestand `.env.local` met de regel `GOOGLE_APPS_SCRIPT_SECRET_KEY=jouw-sleutel`. Het staat in `.gitignore` en de lokale server levert de sleutel zoals de build dat op Cloudflare doet.
- De sleutel staat dan in een bestand dat de browser downloadt. Houd daarom **Cloudflare Access** aan voor dev én prd.
- Wijzig je de sleutel (ook in de script-eigenschap `SECRET_KEY`), bouw dan opnieuw. Toestellen nemen de nieuwe sleutel over bij de volgende start.

## 3. Eigen domein

1. In de Worker: **Domains > Custom Domains and Routes > + Add Domain** > `inspect.gapsolutions.be`.
2. Kies bij **Enable for**: **Production and Preview**.
3. De DNS staat al bij Cloudflare: Cloudflare maakt het DNS-record zelf aan (geen handmatige CNAME). Voor previews maakt Cloudflare ook een wildcard-record en certificaat aan (`*.inspect.gapsolutions.be`). **Het certificaat kan na de eerste preview even op zich laten wachten**, dus het dev-adres werkt mogelijk niet meteen.
4. Zet het **`workers.dev`-adres en de `workers.dev`-preview-URL’s uit** (Worker > Domains > Worker URL, zet ook **Preview** uit). Zo zijn enkel de custom domains bereikbaar en kan Access niet omzeild worden.

Het bestand `public/_headers` stelt beveiligingsheaders en een strikte Content-Security-Policy in (enkel eigen bestanden en verbindingen naar `script.google.com`) en zorgt dat `sw.js` en de app-bestanden niet hardnekkig gecachet worden. Een `_headers`-bestand wordt ook door Workers met static assets ondersteund. Preview-adressen op een custom domain krijgen niet automatisch een `X-Robots-Tag: noindex`; voeg die zo nodig toe in `_headers`, of beveilig ze met Access (punt 5).

## 4. Nieuwe versie uitrollen

1. Pas bestanden aan in `public/` **op de branch `dev`**.
2. **Verhoog `VERSION` in `public/sw.js` én in `public/app.js`** (bv. `1.0.1`). Zonder nieuwe versie haalt de service worker niets nieuws binnen.
3. Push naar `dev`. Test op `https://dev.inspect.gapsolutions.be` (zie punt 6).
4. Merge `dev` naar `prd`. Productie wordt automatisch bijgewerkt.
5. De gsm haalt de nieuwe versie op de achtergrond op en toont “Nieuwe versie beschikbaar”. De oude versie blijft werken tot de gebruiker bijwerkt. Lokale data (IndexedDB) blijft ongemoeid.

## 5. Optioneel: Cloudflare Access (afschermen met e-mailcode)

Previews zijn standaard **publiek bereikbaar**. Bescherm daarom beide hostnamen:

1. Cloudflare dashboard > **Zero Trust** (gratis plan, tot 50 gebruikers; Cloudflare kan bij het aanmaken om een betaalmethode vragen, controleer dat).
2. **Access > Applications > Add an application > Self-hosted**. Maak **twee toepassingen**:
   - **Productie:** domein `inspect.gapsolutions.be`
   - **Preview:** domein `*.inspect.gapsolutions.be` (de wildcard dekt het hoofdadres zelf niet, daarom twee toepassingen)
   - **Session duration: 1 maand** (of langer). Een verlopen sessie vraagt een e-mailcode en dat kan niet offline.
3. Policy: **Allow**, *Emails* = het e-mailadres van de gebruiker; login-methode **One-time PIN**.
4. Let op:
   - Access beschermt enkel het laden van de app, **niet** de Apps Script-URL. Die is beschermd door de geheime sleutel.
   - De gebruiker opent de app **met internet vóór de rondgang** (dan wordt de sessie ook vernieuwd).
   - De app is hierop voorbereid: de manifest-link gebruikt `crossorigin="use-credentials"` en de service worker bewaart nooit een omleiding naar de aanmeldpagina in de cache.
   - Is Access actief en verloopt de sessie, dan blijft de reeds geïnstalleerde versie offline gewoon werken; enkel een update ophalen vraagt dan opnieuw aanmelden.

## 6. Gescheiden testomgeving

`dev` (`dev.inspect.gapsolutions.be`) en `prd` (`inspect.gapsolutions.be`) zijn **aparte adressen**, dus de gsm bewaart voor elk **aparte opslag** (IndexedDB, cache en service worker).

- Gebruik voor `dev` een **aparte test-Sheet, Drive-map en Apps Script-deployment**, zodat testdata nooit in de echte Sheet terechtkomt.
- De Apps Script-URL en de geheime sleutel worden **per omgeving** in de app ingevoerd.
- Zet geen echte gegevens op `dev`.
- Previews erven geen productie-instellingen. Heb je ooit variabelen of bindings nodig, zet ze dan in een `previews`-blok in `wrangler.jsonc`. Voor deze statische app is dat nu niet nodig.

## 7. Terugval: twee Workers

Werkt `npx wrangler preview` niet binnen Workers Builds, of wil je een vast adres zonder Previews, maak dan **twee Workers uit dezelfde repo**:

| Worker | Branch | Domein | Deploycommando |
|---|---|---|---|
| `inspectsolutions` | `prd` | `inspect.gapsolutions.be` | `npx wrangler deploy` |
| `inspectsolutions-dev` | `dev` | `inspect-dev.gapsolutions.be` | `npx wrangler deploy --name inspectsolutions-dev` |

Zet bij beide *Builds for non-production branches* **uit**, zodat elke Worker enkel naar zijn eigen branch luistert. Test bij de eerste build van de dev-Worker of Workers Builds de naamoverschrijving met `--name` aanvaardt; zo niet, gebruik een aparte omgeving (`env`) in `wrangler.jsonc`. Het adres wordt dan `inspect-dev.gapsolutions.be` in plaats van `dev.inspect.gapsolutions.be`, en de Access-toepassing voor previews wordt een tweede toepassing voor dat adres.

## 8. Controle na het uitrollen

- `https://inspect.gapsolutions.be/` en `https://dev.inspect.gapsolutions.be/` laden; DevTools > Application toont de service worker en het manifest.
- Het `workers.dev`-adres en de `workers.dev`-preview-URL’s geven geen app meer.
- Met Access actief: een privévenster vraagt eerst een e-mailcode, op beide adressen.
- Zoek in de gedeployde bestanden naar de sleutel en de Apps Script-URL: ze mogen er **niet** in staan (ze worden enkel op het toestel ingevoerd).
- Op `dev`: een testpunt komt in de **test-Sheet** terecht en niet in de echte.