# Hosting: Cloudflare Pages op inspect.gapsolutions.be

De map [../public/](../public/) is de volledige site (geen build nodig).

## 1. Project aanmaken
**Optie A – GitHub (aanbevolen):**
1. Zet deze repository op GitHub (privé mag).
2. Cloudflare dashboard > **Workers & Pages > Create > Pages > Connect to Git** en kies de repository.
3. Framework preset: **None**. Build command: leeg. **Build output directory: `public`**.
4. **Save and Deploy**. Elke push naar `main` publiceert automatisch.

**Optie B – rechtstreeks uploaden:** *Create > Pages > Upload assets* en sleep de inhoud van `public/` erin (of `npx wrangler pages deploy public`).

## 2. Eigen domein
1. In het Pages-project: **Custom domains > Set up a domain** > `inspect.gapsolutions.be`.
2. De DNS staat al bij Cloudflare: bevestig het voorgestelde CNAME-record (naar `<project>.pages.dev`). HTTPS is automatisch.

Het bestand `public/_headers` stelt beveiligingsheaders en een strikte Content-Security-Policy in (enkel eigen bestanden en verbindingen naar `script.google.com`) en zorgt dat `sw.js` en de app-bestanden niet hardnekkig gecachet worden.

## 3. Nieuwe versie uitrollen
1. Pas bestanden aan in `public/`.
2. **Verhoog `VERSION` in `public/sw.js` én in `public/app.js`** (bv. `1.0.1`). Zonder nieuwe versie haalt de service worker niets nieuws binnen.
3. Push/upload. De gsm haalt de nieuwe versie op de achtergrond op en toont “Nieuwe versie beschikbaar”. De oude versie blijft werken tot de gebruiker bijwerkt. Lokale data (IndexedDB) blijft ongemoeid.

## 4. Optioneel: Cloudflare Access (afschermen met e-mailcode)
1. Cloudflare dashboard > **Zero Trust** > (gratis plan, tot 50 gebruikers).
2. **Access > Applications > Add an application > Self-hosted**.
   - Domein: `inspect.gapsolutions.be`.
   - **Session duration: 1 maand** (of langer). Een verlopen sessie vraagt een e-mailcode en dat kan niet offline.
3. Policy: **Allow**, *Emails* = het e-mailadres van de gebruiker; login-methode **One-time PIN**.
4. Let op:
   - Access beschermt enkel het laden van de app, **niet** de Apps Script-URL. Die is beschermd door de geheime sleutel.
   - De gebruiker opent de app **met internet vóór de rondgang** (dan wordt de sessie ook vernieuwd).
   - De app is hierop voorbereid: de manifest-link gebruikt `crossorigin="use-credentials"` en de service worker bewaart nooit een omleiding naar de aanmeldpagina in de cache.
   - Is Access actief en verloopt de sessie, dan blijft de reeds geïnstalleerde versie offline gewoon werken; enkel een update ophalen vraagt dan opnieuw aanmelden.

## 5. Controle na het uitrollen
- `https://inspect.gapsolutions.be/` laadt; DevTools > Application toont de service worker en het manifest.
- Zoek in de gedeployde bestanden naar de sleutel en de Apps Script-URL: ze mogen er **niet** in staan (ze worden enkel op het toestel ingevoerd).
