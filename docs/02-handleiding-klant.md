# Handleiding InspectSolutions

## Eenmalig: installeren op de gsm
1. Open **https://inspect.gapsolutions.be** in **Chrome** op de gsm, **met internet aan**.
2. Eventueel: log in met de e-mailcode (enkel indien Cloudflare Access actief is).
3. Tik op het menu (⋮) > **App installeren** of **Toevoegen aan startscherm**.
4. Open de app via het icoon op het startscherm.

## Eerste start: verbinding invoeren
Bij de eerste start opent het scherm **Beheer** vanzelf.
1. Vul het **webadres** (eindigt op `/exec`) en de **geheime sleutel** in. Ze worden enkel op deze gsm bewaard.
2. Tik **Verbinding testen**. Er moet “Verbinding werkt.” verschijnen.
3. Tik **Verbinding opslaan** en daarna **Terug**.

## Vóór de rondgang
- Open de app **één keer met internet**, zodat de laatste versie geladen is.
- Staat er “Nieuwe versie beschikbaar”? Tik **Nu bijwerken**. Uw punten blijven bewaard.

## Projecten
Bovenaan het beginscherm staat het **project** waaraan je werkt (projectnummer en naam). Elk project heeft een eigen nummering, een eigen Google Sheet en een eigen fotomap.
- **Nieuw project:** tik op de projectbalk > **Nieuw project**. Vul het **projectnummer** (bv. 26310) en de **projectnaam** in. De app toont de naam van de Sheet die het wordt: projectnummer, naam in kleine letters aaneen en de aanmaakdatum (bv. `26310_residentiezonneveld_20261021`). Bij de eerste synchronisatie maakt het script de Sheet en de fotomap aan en deelt ze met de ingestelde e-mailadressen.
- **Wisselen:** tik op de projectbalk en daarna op het project. Je ziet dan alleen de punten van dat project.
- **Bewerken:** tik bij het project op **Bewerken** om de naam te wijzigen (de Sheet en de map worden hernoemd). Het projectnummer kan na de eerste synchronisatie niet meer gewijzigd worden.
- **Archiveren:** een afgewerkt project kun je archiveren. Het verdwijnt uit de lijst (vink **Toon gearchiveerde projecten** aan om het terug te zien) en kan hersteld worden. De Sheet en de foto’s blijven in Drive.

## Tijdens de rondgang
1. **Nieuw punt**. Het tijdstip is automatisch. Het **nummer** is het hoogste bestaande nummer + 1, maar je mag het aanpassen (bv. van 6 naar 10; het volgende punt krijgt dan 11). Het moet een geheel getal van 1 of hoger zijn dat nog niet gebruikt is, anders wordt het veld rood en kun je niet opslaan.
2. Tik op **Item 1** en zoek op code of tekst. De lijst is gegroepeerd per type doorvoering: **B** (buis), **K** (kabel), **G** (kabelgoot), **L** (luchtkanaal) en **A** (andere: geen van deze, of een mengeling). Een tweede item kan via **Tweede item toevoegen**.
3. **Foto nemen** of **Uit galerij** (meerdere tegelijk mogelijk). Tik op een foto om ze groot te zien, op **×** om ze te verwijderen.
   **Foto bewerken:** tik op een foto om erop te tekenen (zie “Op een foto tekenen” hieronder). Een foto met tekening heeft een klein potloodicoon.
4. Typ een **opmerking** indien nodig.
5. **Status**: standaard NIET OK. Tik OK als het in orde is.
6. **Prijs**: standaard staat € 50 geselecteerd. Tik een ander bedrag (50, 100 … 1000) of typ een eigen bedrag. Nogmaals tikken op het gekozen bedrag haalt de keuze weg.
7. **Punt opslaan**.

Werkt zonder verbinding: alles wordt eerst op de gsm bewaard. Een punt blijft **Te versturen** tot de Sheet het bevestigd heeft, daarna **Verstuurd**.

Een punt aanpassen of verwijderen: tik het in de lijst. De terugknop van Android sluit het formulier of de kiezer (en vraagt bevestiging als er niet-opgeslagen wijzigingen zijn).

## Op een foto tekenen
Tik in het formulier op een foto. Het scherm **Foto bewerken** opent. De foto opent niet vanzelf in de editor.
- **Pen**: vrij tekenen. **Pijl** en **Ovaal**: sleep van begin- naar eindpunt. **Tekst**: tik op de foto, typ een korte tekst en tik **Toevoegen**.
- **Kleur**: rood (standaard), geel, wit of zwart. **Dikte**: dun, middel of dik.
- **Ongedaan**, **Opnieuw** en **Alles wissen** werken stap voor stap.
- **Klaar** bewaart de tekening, **Annuleren** gooit ze weg (met een vraag als er wijzigingen zijn). De terugknop van Android doet hetzelfde als Annuleren.
- De oorspronkelijke foto blijft altijd bewaard. Een bewerkte foto kun je later opnieuw openen en aanpassen of weer wissen.
- Na synchronisatie staat in de Sheet de link naar de **bewerkte** foto. In de map **Foto’s** van het project staat de bewerkte foto als `{projectnummer}_{nr}_{datum-tijd}_{n}.jpg` en het origineel als `…_{n}_orig.jpg`.

## Synchroniseren
- Gebeurt vanzelf zodra de app open is en er verbinding is. Bij een fout probeert de app het later opnieuw.
- Knop **Nu synchroniseren** forceert het. Foto’s worden één voor één verstuurd; op mobiel kan dat even duren.
- **Laat de app open staan** tot er “Alles gesynchroniseerd” staat. Op Android synchroniseert een app niet op de achtergrond.

## Beheer
- **Codelijst**: één item per regel als `CODE | omschrijving`. Bestaande punten behouden hun oorspronkelijke code en tekst.
- **Alle punten wissen**: wist de punten van **alle** projecten op dit toestel. Enkel gebruiken als alles verstuurd is. Vraagt twee keer bevestiging. De projecten blijven bestaan.
- **Nummering**: het volgende nummer is altijd het hoogste bestaande nummer + 1. Na “Alle punten wissen” begint de nummering dus weer bij 1.

## Problemen
| Probleem | Oplossing |
|---|---|
| “Sleutel geweigerd” | Sleutel in Beheer opnieuw invoeren. |
| “Apps Script is verouderd” | De app stuurt dan niets, alles blijft veilig op de gsm. Laat de beheerder de nieuwste `Code.gs` in Apps Script plakken en een nieuwe versie implementeren (zie de installatiehandleiding). Tik daarna **Nu synchroniseren**. |
| “Onverwacht antwoord” | Controleer het webadres (eindigt op `/exec`) en of de toegang van de web-app op *Iedereen* staat. |
| Punten blijven “Te versturen” | Controleer internet, tik **Nu synchroniseren**, lees de “Laatste fout”. |
| App vraagt e-mailcode zonder internet | Open de app voortaan vóór de rondgang met internet. |
