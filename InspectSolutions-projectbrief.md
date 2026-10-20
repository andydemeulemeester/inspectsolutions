# InspectSolutions – projectbrief

Offline-first webapp (PWA) voor een controlerondgang van ongeveer 500 items, gebruikt op één Samsung S21. Gegevens worden lokaal bewaard en gesynchroniseerd met een Google Sheet (tekst) en een Google Drive-map (foto’s) zodra er verbinding is.

Klant: Door Solutions / Gap Solutions (brandwerende doorvoeringen, deuren en wanden).
Hosting: `inspect.gapsolutions.be` (DNS staat al bij Cloudflare).

---

## 1. Doel en gebruiker

- **Eén gebruiker**, één toestel (Samsung S21, Chrome). **Geen login in de app.**
- Gebruik tijdens een rondgang, ook in kelders zonder wifi of mobiel bereik.
- Snel en met één hand bruikbaar: grote tikdoelen, weinig typwerk.
- Gratis oplossing met wat de klant al heeft (Google-account, Cloudflare).

## 2. Velden per punt

| Veld | Gedrag |
|---|---|
| **Nr** | Automatisch, opeenvolgend (+1). Lokale teller, loopt door over rondgangen heen, nummers worden niet hergebruikt na verwijderen. |
| **Item 1** | Keuze uit de codelijst (zoekbare lijst op code of tekst). **Standaard leeg.** Verplicht om op te slaan. |
| **Item 2** | Optioneel, zelfde codelijst. Verschijnt na “Tweede item toevoegen”. |
| **Foto’s** | Meerdere per punt, via camera of galerij. Verkleind tot max. 1600 px, JPEG kwaliteit ~0,72, vóór opslag en upload. |
| **Opmerking** | Vrije tekst. |
| **Status** | `OK` / `NIET OK`. **Standaard `NIET OK`.** |
| **Prijs** | Badges 100, 200, … 1000 (€) én een vrij bedragveld. Het veld spiegelt de badge. Opnieuw tikken op de geselecteerde badge deselecteert. |
| **Creatietijd** | Automatisch, op het moment dat een nieuw punt geopend wordt. |

Extra gedrag: punten kunnen achteraf bewerkt en verwijderd worden. Overzicht met filter op status (Alle / NIET OK / OK) en tellers.

## 3. Offline en synchronisatie

**Lokale opslag:** IndexedDB, met stores `records` (sleutel `id`) en `meta` (teller, codelijst). Foto’s worden als `Blob` in het record bewaard.

**Synchronisatie:**
- Elk punt heeft een **uniek ID** (`crypto.randomUUID()`), zodat opnieuw versturen nooit dubbels geeft. Het Apps Script doet een **upsert op ID**.
- Wachtrij: een punt is “Te versturen” tot de server bevestigd heeft. Pas **na bevestiging** wordt het als “Verstuurd” gemarkeerd.
- Foto’s worden **één voor één** verstuurd (één foto per request), zodat een zwakke verbinding de sync niet blokkeert. Eerst tekstgegevens, dan foto’s, of per foto een eigen call met het punt-ID.
- Herhaalpogingen met oplopende wachttijd bij fouten.
- Sync start automatisch als de app open is en er verbinding is (`online`-event en na elke opslag), plus een knop “Nu synchroniseren”.
- Bewerkte punten worden opnieuw gesynchroniseerd (rij in de Sheet wordt bijgewerkt).
- Achtergrondsync is op Android in een PWA beperkt: de app synchroniseert wanneer ze open staat. Dat is voor deze toepassing voldoende.

## 4. Architectuur

- **Frontend:** één PWA, bij voorkeur zonder zware framework. Vanilla JS of een lichte aanpak is prima. Geen externe CDN-afhankelijkheden zodat alles offline in de cache kan.
- **Service worker + manifest:** app-shell in de cache, offline opstarten, installeerbaar op het startscherm (`display: standalone`), iconen (192 en 512 px, ook maskable).
- **Updates:** nieuwe versies mogen een verlopen sessie of ontbrekende verbinding nooit breken. De oude versie blijft werken tot de nieuwe geladen is.
- **Backend:** Google Apps Script web-app gekoppeld aan een Google Sheet en een Drive-map.

## 5. Google-kant

### Google Sheet

Eén tabblad voor de punten, met deze kolommen in deze volgorde:

`Nr | Aangemaakt | Item 1 | Item 2 | Opmerking | Status | Prijs | Foto’s | ID`

- `ID` is technisch (laatste kolom) en dient voor de upsert.
- `Foto’s` bevat per punt de links naar de foto’s in Drive (één per regel).
- Optioneel een tweede tabblad `Codes` met de codelijst.

### Drive

- Eén map voor de foto’s. Bestandsnaam: `{nr}_{id}_{n}.jpg`.
- Foto’s blijven privé. De links in de Sheet werken voor de eigenaar van het account.

### Apps Script web-app

- Deploy als web-app: uitvoeren als de eigenaar, toegang voor iedereen met de link.
- **Geheime sleutel** wordt als parameter meegestuurd en door het script gecontroleerd.
- Apps Script verwerkt geen CORS-preflight (`OPTIONS`): stuur `POST` met `Content-Type: text/plain` en JSON in de body, en volg de redirect.
- Antwoord altijd JSON met `ok`, het ID en eventuele foutmelding.
- Houd rekening met dagelijkse quota’s van Apps Script. Voor één gebruiker en enkele honderden punten met foto’s is dat ruim voldoende. Controleer de actuele limieten in de Google-documentatie.
- Lever een korte installatiehandleiding mee: Sheet maken, script plakken, deployen, URL en sleutel noteren.

## 6. Hosting en beveiliging

- **Cloudflare Pages** op `inspect.gapsolutions.be` (custom domain, DNS staat al bij Cloudflare, HTTPS automatisch).
- **Cloudflare Access** (Zero Trust, gratis voor kleine groepen) is een optie om de app af te schermen met een eenmalige e-mailcode. Aandachtspunten:
  - Zet de sessieduur lang (bv. een maand). Een verlopen sessie vraagt een e-mailcode en dat kan niet offline.
  - Access beschermt enkel het laden van de app, niet de Apps Script-URL bij Google.
  - Laat de gebruiker de app openen mét internet vóór de rondgang.
- GitHub Pages is **niet** gekozen: privé-sites zijn daar niet mogelijk zonder Enterprise Cloud.
- **De geheime sleutel en de Apps Script-URL staan nooit in de code.** Ze worden bij de eerste start ingevoerd in een instellingenscherm en lokaal op het toestel bewaard.

## 7. Bestaand prototype (startpunt voor de schermen)

Het prototype (`inspectsolutions-prototype.html`) toont de gewenste schermen en is door de klant goedgekeurd. **Behoud de schermen, de teksten en het kleurenpalet.** Het prototype bevat:

- Overzichtsscherm met tellers, synchronisatiebalk, statusfilter en lijst
- Formulier met alle velden hierboven, zoekbare itemkiezer, fotominiaturen met verwijderknop en fotoweergave op volledig scherm
- Beheerscherm met bewerkbare codelijst en een knop om alles te wissen (tweetraps-bevestiging)
- Offline-indicator in de kop en een testschakelaar “Offline simuleren”
- Nagebootste synchronisatie, die vervangen moet worden door de echte

### Kleurenpalet

| Token | Licht | Donker |
|---|---|---|
| `--bg` | `#edf1f4` | `#0b1620` |
| `--surface` | `#ffffff` | `#12212e` |
| `--surface2` | `#e1e8ed` | `#1c2f3f` |
| `--text` | `#0f2233` | `#e8f0f6` |
| `--muted` | `#5a6b7a` | `#8ea3b4` |
| `--line` | `#cdd7df` | `#26394a` |
| `--accent` (signaalgeel) | `#f5a300` | `#ffb81f` |
| `--accent-ink` | `#1a1200` | `#1a1200` |
| `--sel` (geselecteerde badge) | `#12324a` | `#2b6a9e` |
| `--link` | `#0b5cad` | `#7db7f0` |
| `--ok` / `--ok-bg` | `#17703a` / `#d9f1e1` | `#6fd69a` / `#123222` |
| `--bad` / `--bad-bg` | `#c0301f` / `#fde3de` | `#ff9d8f` / `#3c1b17` |
| `--head-bg` | `#0f2a3f` | `#07101a` |

Donkere modus volgt `prefers-color-scheme`. Typografie: systeemlettertype, codes in monospace.

## 8. Aandachtspunten voor de bouw en test

1. **Offline opstarten** testen op een echte S21: app installeren, internet uit, app starten, punt invoeren met foto’s.
2. **Sync onderbreken** halverwege (vliegtuigmodus aan/uit): geen dubbele rijen, geen verloren punten.
3. **Veel foto’s**: controleer geheugen- en opslaggebruik en de uploadtijd op mobiel.
4. **Terugknop van Android**: sluit nu het formulier of de kiezer in plaats van de app (History API gebruiken).
5. **Updates**: een nieuwe versie mag lopende, nog niet gesynchroniseerde data nooit wissen.
6. **Meerdere tabbladen/vensters**: één teller, geen dubbele nummers.
7. **Opslagpersistentie**: vraag `navigator.storage.persist()` aan zodat de browser de data niet opruimt.
8. Controleer dat de sleutel nergens in de gedeployde bestanden staat.

## 9. Op te leveren

- Projectmap met de PWA (app, service worker, manifest, iconen), klaar voor Cloudflare Pages
- Apps Script voor Sheet en Drive, met installatiehandleiding
- Korte handleiding voor de klant: installeren op het startscherm, eerste start (URL en sleutel invoeren), werkwijze voor de rondgang
- Stappenplan voor `inspect.gapsolutions.be` en de optionele Cloudflare Access

## 10. Itemlijst van de klant (80 items, ongewijzigd)

**De tekst van de items moet exact blijven zoals de klant ze aanleverde.** Niet samenvoegen, niet ontdubbelen, geen spelfouten of dubbele spaties corrigeren, volgorde behouden. Enkel de **code** is toegevoegd (groepsletters + volgnummer), zodat de klant sneller kan zoeken. Elke regel uit de lijst van de klant is één item met een eigen code, ook als de tekst bijna of volledig gelijk is aan een andere regel.

De lijst staat in de volgorde van de klant. De codes gebruiken een prefix per soort werk: `OP` = typeoplossing tv254/293, `PR` = productoplossing, `LV` = lineaire voeg, `PL` = plafond, `PA` = panelen en luiken, `DE` = deuren, ramen en roosters, `WA` = wanden, `DI` = diversen. De lijst is bewerkbaar in het beheerscherm. Formaat in de app: `CODE | omschrijving`.

| Nr | Code | Omschrijving (ongewijzigd) |
|---|---|---|
| 1 | OP01 | opening vergroten en typeoplossing TV254/293  uitvoeren |
| 2 | DI01 | Nazicht gesteldheid muur - lijkt ok te zijn |
| 3 | PR01 | Opening vergroten rond goot en productoplossing uitvoeren |
| 4 | LV01 | Lineaire voeg uit te voeren |
| 5 | OP02 | opening vergroten  kabels/ buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren |
| 6 | DE01 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet |
| 7 | DE02 | brandwerend glas ok |
| 8 | DI02 | algemeen zicht |
| 9 | OP03 | typeoplossing TV254/293 uitvoeren |
| 10 | DE03 | Herstellen vasthoudmagneet |
| 11 | PR02 | Schuim verwijderen , opening vergroten rond item  en productoplossing uitvoeren |
| 12 | OP04 | typeoplossing TV254/293 uitvoeren en nadien mantelbuis opstoppen met rotswol |
| 13 | OP05 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 uitvoeren |
| 14 | PR03 | mortel verwijderen , opening vergroten rond kabelbundel en productoplossing uitvoeren |
| 15 | LV02 | Lineaire voeg uit te voeren-oude weg productoplossing |
| 16 | OP06 | 1 buis opening vergroten en typeoplossing TV254/293  uitvoeren |
| 17 | PR04 | Schuim verwijderen , opening vergroten rond buis en productoplossing uitvoeren |
| 18 | PL01 | plafond herstellen |
| 19 | OP07 | opening vergroten en uitvoeren met typeoplossing TV 254/293 en rond de buis omkasting maken met flexibele productoplossing |
| 20 | OP08 | typeoplossing TV254/293 uitvoeren gat te dichten |
| 21 | PL02 | plafond herstellen + kabels TV + buizen productoplossing |
| 22 | OP09 | isolatie openknippen en achterliggend op de muur typeoplossing uitvoeren TV254/293 |
| 23 | OP10 | opening vergroten  kabels/buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren |
| 24 | OP11 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 type C uitvoeren |
| 25 | PR05 | mortel verwijderen , opening vergroten rond kabelbundel /buis en productoplossing uitvoeren |
| 26 | OP12 | typeoplossing TV254/293 uitvoeren en ook mantelbuis opstoppen met rotswol |
| 27 | OP13 | opening vergroten en typeoplossing TV254/293 uitvoeren |
| 28 | OP14 | typeoplossing TV254/293 uitvoeren blind gat te dichten |
| 29 | DE04 | nieuwe zwaai deur te plaatsen - EI30 schilderafwerking + magneet |
| 30 | PR06 | buizen en kabels doorheen nieuw bovenpaneel productoplossing |
| 31 | OP15 | Schuim verwijderen , kabels uit elkaar en uitvoeren typeoplossing TV254/293 |
| 32 | LV03 | diversen kabels buizen lin voeg - productopl |
| 33 | LV04 | opmetsen wand +afdichten vlgs TV + lin voeg |
| 34 | DE05 | nieuwe  deur te plaatsen - EI30 schilderafwerking |
| 35 | PR07 | Schuim wegnemen opstop volgens productoplossing  uitlijning is Niet ok+nieuwe klep |
| 36 | PA01 | afdichting via panelen te maken productopl |
| 37 | OP16 | kabels uit elkaar en uitvoeren typeoplossing TV254/293 |
| 38 | OP17 | Opening vergroten en typeoplossing TV254/293 uitvoeren |
| 39 | PA02 | dichten opening met panelen |
| 40 | OP18 | buizen en kabels vlgs TV254/293 |
| 41 | PA03 | luik openen en afdichten productopl panelen |
| 42 | WA01 | Nieuwe afscherming E60 rolluik/gordijn douches en inkom |
| 43 | WA02 | Achterliggende wand EI30 te plaatsen |
| 44 | WA03 | Wand EI30 te plaatsen |
| 45 | OP19 | bovenconstructie typeopl TV 254/293 + nieuw plafond |
| 46 | DE06 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet + doorvoeren bovenpaneel |
| 47 | OP20 | kabels uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren |
| 48 | DE07 | nieuwe deur te plaatsen - EI30 schilderafwerking |
| 49 | PR08 | Evt Schuim wegnemen + opstop volgens productoplossing |
| 50 | OP21 | kabels uit elkaar en uitvoeren typeoplossing TV254/293+ productoplossingen |
| 51 | LV05 | lin voeg en paneel |
| 52 | DE08 | nieuwe deur te plaatsen - EI30 schilderafwerking + tussendeurdorpel |
| 53 | OP22 | typeoplossing TV254/293 uitvoeren |
| 54 | PR09 | productoplossing voor kabels en buis |
| 55 | PR10 | Schuim verwijderen, opening vergroten enproductoplossing |
| 56 | PA04 | Nieuw brandwerend luik |
| 57 | PA05 | productoplossing panelen |
| 58 | DE09 | Brandwerende schuifdeur E30-schilderafwerking |
| 59 | WA04 | nieuwe wand EI30 achter bestaand raam |
| 60 | PR11 | opening vergroten rond kabelbundel en productoplossing uitvoeren |
| 61 | WA05 | nieuwe wand EI30 achter bestaand raam - 3 stuks |
| 62 | WA06 | nieuwe wand EI30 achter bestaand raam - achter bekleding |
| 63 | PL03 | plafond  - 2 lagen gips erop |
| 64 | LV06 | productoplossing lin voeg |
| 65 | PR12 | productoplossing voor kabels en buis - kabelgoot |
| 66 | PA06 | herstel achter wand via luik |
| 67 | DI03 | meting |
| 68 | PR13 | Evt Schuim wegnemen + opstop volgens productoplossing   + uitlijning controleren |
| 69 | OP23 | Opening vergroten en typeoplossing TV254/293 |
| 70 | DE10 | nieuwe zwaaideur te plaatsen - EI30 schilderafwerking |
| 71 | PA07 | nieuwe doorgeefluik te plaatsen - EI30 schilderafwerking  + brandwerende onderbouw |
| 72 | WA07 | nieuwe wand EI 30 |
| 73 | PR14 | opstop volgens productoplossing |
| 74 | LV07 | lin voeg |
| 75 | PA08 | paneel bovenaan brandwerend maken |
| 76 | DI04 | detail |
| 77 | DE11 | Deur comform = ok |
| 78 | DE12 | nieuw brandwerend raam |
| 79 | DE13 | rooster te plaatsen |
| 80 | DE14 | brandwerend rooster |

---

## 11. Open punten

- De klant sprak over ongeveer 100 codes, de aangeleverde lijst telt 80 regels. Is die lijst volledig? Zo niet, vul ze aan in het beheerscherm of in de standaardlijst.
- Moet het volgnummer bij elke rondgang opnieuw bij 1 beginnen, of doorlopen? (Nu: doorlopend, met een knop in het beheerscherm om te herstarten.)
- Cloudflare Access wel of niet activeren (zie punt 6).
- Eventuele huiskleuren of logo van Door Solutions / Gap Solutions voor een aangepast palet.
