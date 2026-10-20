# Installatie van het Apps Script (Sheet en Drive)

Doe dit één keer, ingelogd met het Google-account van de klant. Duur: ongeveer 10 minuten.

## 1. De Google Sheet maken
1. Ga naar sheets.google.com en maak een lege spreadsheet. Noem ze bv. **InspectSolutions**.
2. Laat ze leeg. Het script maakt het tabblad `Punten` met de kolommen
   `Nr | Aangemaakt | Item 1 | Item 2 | Opmerking | Status | Prijs | Foto’s | ID` zelf aan.
   Het tabblad `Codes` met de codelijst wordt automatisch ingevuld zodra de app verbinding heeft.

## 2. Het script plakken
1. In de Sheet: **Extensies > Apps Script**.
2. Wis de voorbeeldcode en plak de volledige inhoud van [../apps-script/Code.gs](../apps-script/Code.gs). Sla op (Ctrl+S).

## 3. De geheime sleutel instellen
1. Links in Apps Script: **Projectinstellingen** (tandwiel) > **Script-eigenschappen** > **Script-eigenschap toevoegen**.
2. Naam `SECRET_KEY`, waarde: een lange willekeurige tekst (minstens 24 tekens, bv. uit een wachtwoordbeheerder).
3. Noteer de sleutel. Hij staat nergens anders en wordt later in de app ingevoerd.
4. Optioneel: `FOLDER_ID` met het id van een bestaande Drive-map voor de foto’s. Zonder deze eigenschap maakt het script zelf de map **InspectSolutions foto’s** aan.

## 4. Toestemmingen geven
1. Kies bovenaan de functie **initialiseer** en klik **Uitvoeren**.
2. Google vraagt toestemming (Sheets en Drive). Kies het account, **Geavanceerd** > **Ga naar … (onveilig)** > **Toestaan**. Dit is normaal voor eigen scripts.
3. Klaar als het uitvoeringslogboek “Klaar. Map: …” toont.

## 5. Implementeren als web-app
1. **Implementeren > Nieuwe implementatie** > tandwiel > **Web-app**.
2. Uitvoeren als: **Ik**. Toegang: **Iedereen**.
3. **Implementeren** en kopieer de **Web-app-URL** (eindigt op `/exec`).
4. Noteer: **URL** en **sleutel**. Meer heeft de app niet nodig.

## 6. Testen
Open de URL in een browser: er moet `{"ok":true,"app":"InspectSolutions",…}` verschijnen.
In de app: **Beheer > Verbinding**, vul URL en sleutel in, tik **Verbinding testen**.

## Het script later aanpassen
Na elke codewijziging: **Implementeren > Implementaties beheren > potlood > Versie: Nieuwe versie > Implementeren**. De URL blijft hetzelfde.

## Goed om te weten
- Een punt wordt op `ID` bijgewerkt (geen dubbele rijen bij opnieuw versturen).
- Foto’s staan in Drive als `{nr}_{id}_{n}.jpg` en blijven privé; de links in de Sheet werken voor de eigenaar van het account.
- Een punt dat in de app verwijderd wordt, verdwijnt bij de volgende synchronisatie ook uit de Sheet. De foto’s blijven in Drive staan. Een foto die in de app van een punt wordt verwijderd, gaat naar de prullenmand van Drive.
- Wordt de sleutel gewijzigd: pas `SECRET_KEY` aan en voer de nieuwe sleutel in de app in.
- Apps Script heeft dagelijkse quota’s (o.a. voor aanroepen en Drive-bestanden). Voor één gebruiker met enkele honderden punten en foto’s is dat ruim voldoende. Controleer de actuele limieten in de Google-documentatie.
