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

## Tijdens de rondgang
1. **Nieuw punt**. Het tijdstip is automatisch. Het **nummer** is het hoogste bestaande nummer + 1, maar je mag het aanpassen (bv. van 6 naar 10; het volgende punt krijgt dan 11). Het moet een geheel getal van 1 of hoger zijn dat nog niet gebruikt is, anders wordt het veld rood en kun je niet opslaan.
2. Tik op **Item 1** en zoek op code of tekst. Een tweede item kan via **Tweede item toevoegen**.
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
- Na synchronisatie staat in de Sheet de link naar de **bewerkte** foto. In Drive staat de bewerkte foto als `{nr}_{id}_{n}.jpg` en het origineel als `{nr}_{id}_{n}_orig.jpg`.

## Synchroniseren
- Gebeurt vanzelf zodra de app open is en er verbinding is. Bij een fout probeert de app het later opnieuw.
- Knop **Nu synchroniseren** forceert het. Foto’s worden één voor één verstuurd; op mobiel kan dat even duren.
- **Laat de app open staan** tot er “Alles gesynchroniseerd” staat. Op Android synchroniseert een app niet op de achtergrond.

## Beheer
- **Codelijst**: één item per regel als `CODE | omschrijving`. Bestaande punten behouden hun oorspronkelijke code en tekst.
- **Alle punten wissen**: enkel gebruiken als alles verstuurd is. Vraagt twee keer bevestiging.
- **Nummering**: het volgende nummer is altijd het hoogste bestaande nummer + 1. Na “Alle punten wissen” begint de nummering dus weer bij 1.

## Problemen
| Probleem | Oplossing |
|---|---|
| “Sleutel geweigerd” | Sleutel in Beheer opnieuw invoeren. |
| “Onverwacht antwoord” | Controleer het webadres (eindigt op `/exec`) en of de toegang van de web-app op *Iedereen* staat. |
| Punten blijven “Te versturen” | Controleer internet, tik **Nu synchroniseren**, lees de “Laatste fout”. |
| App vraagt e-mailcode zonder internet | Open de app voortaan vóór de rondgang met internet. |
