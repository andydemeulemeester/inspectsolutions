# InspectSolutions – testomgeving (DEV)

Deze handleiding is voor het **testen** van de app vóór ze in gebruik genomen wordt. De testomgeving (**DEV**) is volledig gescheiden van de echte app: ze heeft een eigen Google Sheet en een eigen fotomap. **Gebruik hier geen echte gegevens.**

De testversie herken je aan het **rode icoon met “DEV”** en het rode “DEV”-label naast de titel. De echte app (PRD) is **limoengroen**.

De verbindingsgegevens (webadres en geheime sleutel) krijg je apart. Ze staan niet in deze handleiding.

## 1. Installeren op de gsm
1. Open **https://dev.inspect.gapsolutions.be** in **Chrome** op de gsm, **met internet aan**.
2. Vul je e-mailadres in en daarna de **code die je per e-mail krijgt**. Dit is nodig om de testomgeving te openen.
3. Tik op het menu (⋮) > **App installeren** of **Toevoegen aan startscherm**.
4. Open de app via het rode icoon “Inspect DEV” op het startscherm.

## 2. Verbinding invoeren (eerste start)
Bij de eerste start opent het scherm **Beheer** vanzelf.
1. Vul bij **Webadres** het webadres uit je bericht in (het eindigt op `/exec`).
2. Vul bij **Geheime sleutel** de sleutel uit je bericht in.
3. Tik **Verbinding testen**. Er moet **“Verbinding werkt.”** verschijnen.
4. Tik **Verbinding opslaan** en daarna **Terug**.

Tip: kopieer het webadres en de sleutel uit je bericht en plak ze in de velden. Zo vermijd je typfouten.

## 3. Een punt invoeren
1. Tik **Nieuw punt**. Het tijdstip is automatisch. Het **nummer** is het hoogste bestaande nummer + 1, maar je mag het zelf aanpassen (bv. van 6 naar 10). Het volgende punt krijgt dan 11. Een nummer moet een geheel getal van 1 of hoger zijn en mag nog niet in gebruik zijn. Anders wordt het veld rood en kun je niet opslaan. Onder het veld staat welk nummer daarna volgt.
2. Tik op **Item 1** en zoek op code of tekst. Een tweede item kan via **Tweede item toevoegen**.
3. **Foto nemen** of **Uit galerij** (meerdere tegelijk kan). Tik op een foto om ze groot te zien, op **×** om ze te verwijderen.
4. Typ een **opmerking** indien nodig.
5. **Status**: standaard NIET OK. Tik OK als het in orde is.
6. **Prijs**: standaard staat **€ 50** geselecteerd. Tik een ander bedrag (50, 100, 200 … 1000) of typ een eigen bedrag. Nogmaals tikken op het gekozen bedrag haalt de keuze weg.
7. Tik **Punt opslaan**.

Een punt aanpassen of verwijderen: tik het in de lijst. De terugknop van Android sluit het formulier of de kiezer.

## 4. Synchroniseren
- Gebeurt vanzelf zodra de app open is en er internet is.
- Een punt blijft **Te versturen** tot de Google Sheet het bevestigd heeft, daarna **Verstuurd**.
- Tik **Nu synchroniseren** om het meteen te forceren.
- **Laat de app open** tot er “Alles gesynchroniseerd” staat. Op Android synchroniseert een app niet op de achtergrond.

## 5. Wat we graag testen
Vink af wat je gedaan hebt en noteer wat niet werkte.

**Basis**
- [ ] App installeren en openen via het rode icoon
- [ ] Verbinding invoeren en testen
- [ ] Punt aanmaken met 1 item en 2 foto’s
- [ ] Punt aanmaken met 2 items, opmerking, status OK en een prijs
- [ ] Punt aanpassen en een foto verwijderen
- [ ] Punt verwijderen
- [ ] Het nummer van een nieuw punt aanpassen (bv. naar 10) en controleren dat het volgende punt 11 krijgt
- [ ] Een nummer proberen dat al bestaat: het veld wordt rood en opslaan lukt niet
- [ ] Het nummer van een bestaand punt wijzigen: in de Sheet verandert die rij, er komt geen extra rij bij
- [ ] Zoeken in de itemlijst op code en op tekst
- [ ] Filter Alle / NIET OK / OK in de lijst

**Zonder internet** (de belangrijkste test)
- [ ] Open de app **eerst één keer met internet**
- [ ] Zet vliegtuigmodus aan, sluit de app volledig en open ze opnieuw. Ze moet gewoon starten.
- [ ] Maak enkele punten met foto’s. Ze staan op **Te versturen**.
- [ ] Zet internet weer aan. De punten worden verstuurd en staan op **Verstuurd**.
- [ ] Zet de vliegtuigmodus aan en uit **tijdens** het synchroniseren. Er mogen geen dubbele of verloren punten zijn.

**Controle in de Google Sheet**
- [ ] Elk punt staat één keer in de Sheet, met het juiste nummer, item, opmerking, status en prijs
- [ ] De foto’s staan in de map in Google Drive en de links in de Sheet openen de foto’s
- [ ] Een aangepast punt is **bijgewerkt** in de Sheet (geen extra rij)
- [ ] Een verwijderd punt is uit de Sheet verdwenen

**Gebruiksgemak**
- [ ] Alles is met één hand goed bereikbaar en de knoppen zijn groot genoeg
- [ ] De tekst is overal duidelijk en leesbaar, ook in de zon
- [ ] Het uploaden van veel foto’s (bv. 20) lukt zonder dat de gsm traag wordt

## 6. Problemen
| Probleem | Oplossing |
|---|---|
| “Sleutel geweigerd” | Voer de sleutel in Beheer opnieuw in (kopiëren en plakken). |
| “Onverwacht antwoord” | Controleer het webadres: het moet eindigen op `/exec`. |
| Punten blijven “Te versturen” | Controleer internet, tik **Nu synchroniseren** en lees de “Laatste fout” in de synchronisatiebalk. |
| De app vraagt een e-mailcode zonder internet | Open de app voortaan eerst met internet (zie hierboven, “Zonder internet”). |
| Er verschijnt “Nieuwe versie beschikbaar” | Tik **Nu bijwerken**. Je punten blijven bewaard. |

## 7. Feedback doorgeven
Noteer bij een probleem:
- wat je deed (stap voor stap),
- wat je verwachtte en wat er gebeurde,
- een schermafbeelding indien mogelijk,
- het tijdstip en het **versienummer** (Beheer > onderaan bij “Over”).

Stuur dit naar je contactpersoon bij Door Solutions / Gap Solutions.

**Let op:** de gegevens in de testomgeving mogen op elk moment gewist worden. Gebruik **Beheer > Alle punten wissen** om na een test schoon te beginnen. Dat wist enkel de punten op de gsm, niet in de Google Sheet. Wil je de Sheet ook leegmaken, verwijder dan de rijen daar handmatig.
