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

## 3. Een project aanmaken
Elk project heeft een eigen nummering, een eigen Google Sheet en een eigen fotomap. Zonder project kun je geen punt invoeren.
1. Tik bovenaan op de **projectbalk** en daarna op **Nieuw project**.
2. Vul het **projectnummer** (bv. `26310`) en de **projectnaam** in (bv. `Residentie Zonneveld`).
3. De app toont de **naam van de Google Sheet**: projectnummer, projectnaam in kleine letters aaneen en de aanmaakdatum, bv. `26310_residentiezonneveld_20261021`.
4. Tik **Opslaan**. Het project is meteen actief. Bij de eerste synchronisatie maakt het script de Sheet en de fotomap aan.

**Wisselen van project:** tik op de projectbalk en kies een project. Je ziet alleen de punten van dat project, en de nummering begint per project bij 1.
**Bewerken:** tik bij het project op **Bewerken**. Je kunt de naam wijzigen (de Sheet en de map worden hernoemd). Het projectnummer ligt vast na de eerste synchronisatie.
**Archiveren:** een afgewerkt project kun je archiveren en later herstellen.

## 4. Een punt invoeren
1. Tik **Nieuw punt**. Het tijdstip is automatisch. Het **nummer** is het hoogste bestaande nummer + 1, maar je mag het zelf aanpassen (bv. van 6 naar 10). Het volgende punt krijgt dan 11. Een nummer moet een geheel getal van 1 of hoger zijn en mag nog niet in gebruik zijn. Anders wordt het veld rood en kun je niet opslaan. Onder het veld staat welk nummer daarna volgt.
2. Tik op **Item 1** en zoek op code of tekst. De lijst is gegroepeerd per type doorvoering: **B** (buis), **K** (kabel), **G** (kabelgoot), **L** (luchtkanaal) en **A** (andere: geen van deze, of een mengeling). Een tweede item kan via **Tweede item toevoegen**.
3. **Foto nemen** of **Uit galerij** (meerdere tegelijk kan). Tik op **×** om een foto te verwijderen.
   **Foto bewerken:** tik op een foto om erop te tekenen. Kies **Pen**, **Pijl**, **Ovaal** of **Tekst**, een kleur (rood, geel, wit, zwart) en een dikte (dun, middel, dik). Met **Ongedaan**, **Opnieuw** en **Alles wissen** kun je stappen terugdraaien. **Klaar** bewaart de tekening, **Annuleren** gooit ze weg. De originele foto blijft altijd bewaard en een bewerkte foto herken je aan het potloodicoon.
4. Typ een **opmerking** indien nodig.
5. **Status**: standaard NIET OK. Tik OK als het in orde is.
6. **Prijs**: standaard staat **€ 50** geselecteerd. Tik een ander bedrag (50, 100, 200 … 1000) of typ een eigen bedrag. Nogmaals tikken op het gekozen bedrag haalt de keuze weg.
7. Tik **Punt opslaan**.

Een punt aanpassen of verwijderen: tik het in de lijst. De terugknop van Android sluit het formulier of de kiezer.

## 5. Synchroniseren
- Gebeurt vanzelf zodra de app open is en er internet is.
- Een punt blijft **Te versturen** tot de Google Sheet het bevestigd heeft, daarna **Verstuurd**.
- Tik **Nu synchroniseren** om het meteen te forceren.
- **Laat de app open** tot er “Alles gesynchroniseerd” staat. Op Android synchroniseert een app niet op de achtergrond.

## 6. Wat we graag testen
Vink af wat je gedaan hebt en noteer wat niet werkte.

**Projecten**
- [ ] Een project aanmaken met projectnummer en naam. Klopt de getoonde naam van de Sheet met wat je verwacht (nummer, naam in kleine letters aaneen, datum)?
- [ ] Een tweede project aanmaken en wisselen: je ziet alleen de punten van het gekozen project en de nummering begint er opnieuw bij 1
- [ ] Na de synchronisatie: in Drive staat de map **InspectSolutions** met per project een map met dezelfde naam als de Sheet, de Sheet zelf en een submap **Foto’s**
- [ ] Het projectnummer, de projectnaam en de datum in de naam van de Sheet kloppen. Elk project heeft zijn eigen Sheet.
- [ ] De naam van een project wijzigen: de Sheet en de map krijgen de nieuwe naam
- [ ] Een project archiveren en weer herstellen
- [ ] Een foto in Drive heet `{projectnummer}_{nr}_{datum-tijd}_{n}.jpg`, bv. `26310_5_20261021-143005_1.jpg`

**Basis**
- [ ] App installeren en openen via het rode icoon
- [ ] Verbinding invoeren en testen
- [ ] Punt aanmaken met 1 item en 2 foto’s
- [ ] Punt aanmaken met 2 items, opmerking, status OK en een prijs
- [ ] Op een foto tekenen met pen, pijl, ovaal en tekst; ongedaan maken, opnieuw uitvoeren en alles wissen
- [ ] Annuleren met niet-bewaarde tekening: de app vraagt of je de wijzigingen wilt weggooien (ook met de terugknop van de gsm)
- [ ] Een bewerkte foto opnieuw openen en de tekening aanpassen of wissen
- [ ] Een foto bewerken, het punt versturen en daarna de foto nog eens aanpassen: in Drive staat nog één bewerkte foto (geen dubbele) naast het origineel
- [ ] Punt aanpassen en een foto verwijderen
- [ ] Punt verwijderen
- [ ] Het nummer van een nieuw punt aanpassen (bv. naar 10) en controleren dat het volgende punt 11 krijgt
- [ ] Een nummer proberen dat al bestaat: het veld wordt rood en opslaan lukt niet
- [ ] Het nummer van een bestaand punt wijzigen: in de Sheet verandert die rij, er komt geen extra rij bij
- [ ] Zoeken in de itemlijst op code en op tekst, en controleren dat de items onder de juiste groep staan (B, K, G, A) en dat de codes kloppen met jouw lijst
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
- [ ] Bij een bewerkte foto: de link in de Sheet opent de **bewerkte** versie, en in Drive staat ook het origineel (`…_orig.jpg`)
- [ ] Een aangepast punt is **bijgewerkt** in de Sheet (geen extra rij)
- [ ] Een verwijderd punt is uit de Sheet verdwenen

**Gebruiksgemak**
- [ ] Alles is met één hand goed bereikbaar en de knoppen zijn groot genoeg
- [ ] De tekst is overal duidelijk en leesbaar, ook in de zon
- [ ] Het uploaden van veel foto’s (bv. 20) lukt zonder dat de gsm traag wordt

## 7. Problemen
| Probleem | Oplossing |
|---|---|
| “Sleutel geweigerd” | Voer de sleutel in Beheer opnieuw in (kopiëren en plakken). |
| “Apps Script is verouderd” | De app stuurt dan niets, alles blijft veilig op de gsm. Meld dit aan de ontwikkelaar: het script moet bijgewerkt worden. Tik daarna **Nu synchroniseren**. |
| “Onverwacht antwoord” | Controleer het webadres: het moet eindigen op `/exec`. |
| Punten blijven “Te versturen” | Controleer internet, tik **Nu synchroniseren** en lees de “Laatste fout” in de synchronisatiebalk. |
| De app vraagt een e-mailcode zonder internet | Open de app voortaan eerst met internet (zie hierboven, “Zonder internet”). |
| Er verschijnt “Nieuwe versie beschikbaar” | Tik **Nu bijwerken**. Je punten blijven bewaard. |

## 8. Feedback doorgeven
Noteer bij een probleem:
- wat je deed (stap voor stap),
- wat je verwachtte en wat er gebeurde,
- een schermafbeelding indien mogelijk,
- het tijdstip en het **versienummer** (Beheer > onderaan bij “Over”).

Stuur dit naar je contactpersoon bij Door Solutions / Gap Solutions.

**Let op:** de gegevens in de testomgeving mogen op elk moment gewist worden. Gebruik **Beheer > Alle punten wissen** om na een test schoon te beginnen. Dat wist enkel de punten op de gsm, niet in de Google Sheet. Wil je de Sheet ook leegmaken, verwijder dan de rijen daar handmatig.
