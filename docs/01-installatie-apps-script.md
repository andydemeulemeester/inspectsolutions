# Installatie van het Apps Script (projecten, Sheets en Drive)

Doe dit één keer, ingelogd met het Google-account dat de **eigenaar** van alle projecten, Sheets en foto’s wordt. De opslag (15 GB gratis) telt voor dit account. Gebruik daarom bij voorkeur een apart account voor InspectSolutions, en deel de resultaten met de mensen die ze nodig hebben (zie `SHARE_EMAILS`). Duur: ongeveer 10 minuten.

## Wat het script aanmaakt
Per project in de app maakt het script zelf dit aan, in een hoofdmap **InspectSolutions** in Drive:

```
InspectSolutions/
  26310_residentiezonneveld_20261021/            (projectmap)
      26310_residentiezonneveld_20261021         (de Google Sheet van het project)
      Foto’s/
          26310_5_20261021-143005_1.jpg          (foto: projectnummer_nr_datum-tijd_foto)
          26310_5_20261021-143005_1_orig.jpg     (origineel van een bewerkte foto)
```

- De naam van de Sheet en de projectmap is **projectnummer, projectnaam in kleine letters aaneen, aanmaakdatum (jjjjmmdd)**.
- In de Sheet staan de kolommen `Nr | Aangemaakt | Item 1 | Item 2 | Opmerking | Status | Prijs | Foto’s | ID`. De kolom Foto’s bevat de link naar de foto (de bewerkte versie als die er is).
- De bestandsnaam van een foto bevat het projectnummer, het volgnummer van het punt en het aanmaakmoment van het punt (jaar, maand, dag, uur, minuut, seconde), zodat hij altijd uniek is.

## DEV en productie
| | DEV (test) | Productie |
|---|---|---|
| Eigenaar van script, Sheets en foto’s | de ontwikkelaar | het Google-account van de klant |
| `SHARE_EMAILS` | niet nodig | optioneel: het Gmail-adres van de ontwikkelaar, zodat die elke nieuwe projectmap kan beheren |
| Toegang van de ontwikkelaar | is eigenaar | zie hieronder |

**Toegang van de ontwikkelaar in productie** (de eigenaar doet dit één keer):
1. Deel de **overzichts-Sheet** (waaraan het script gebonden is) met het Gmail-adres van de ontwikkelaar als **bewerker**. Daarmee kan die via **Extensies > Apps Script** het script openen en aanpassen en de script-eigenschappen wijzigen.
2. Deel de hoofdmap **InspectSolutions** in Drive met dat adres als **bewerker**. Nieuwe projectmappen erven die rechten. Controleer dat bij het eerste project, of zet het adres in `SHARE_EMAILS`.
3. **Implementeren doet bij voorkeur de eigenaar zelf**, ingelogd met zijn account. De web-app draait als “Ik”, het account dat de implementatie aanmaakt. Maakt de ontwikkelaar de implementatie, dan kan het script onder diens account gaan draaien en komen de foto’s in de verkeerde Drive terecht. Test dit bij de installatie.

## 1. Een overzichts-Sheet maken
1. Ga naar sheets.google.com en maak een lege spreadsheet. Noem ze bv. **InspectSolutions overzicht**.
2. Laat ze leeg. Het script maakt hierin het tabblad `Projecten` (alle projecten met links naar hun Sheet en fotomap) en het tabblad `Codes` (de codelijst, ingevuld door de app).

## 2. Het script plakken
1. In de Sheet: **Extensies > Apps Script**.
2. Wis de voorbeeldcode en plak de volledige inhoud van [../apps-script/Code.gs](../apps-script/Code.gs). Sla op (Ctrl+S).

## 3. Script-eigenschappen instellen
Links in Apps Script: **Projectinstellingen** (tandwiel) > **Script-eigenschappen** > **Script-eigenschap toevoegen**.

| Naam | Verplicht | Waarde |
|---|---|---|
| `SECRET_KEY` | ja | een lange willekeurige tekst (minstens 24 tekens). Noteer ze: ze wordt in de app ingevoerd. |
| `SHARE_EMAILS` | nee | e-mailadressen gescheiden door komma’s. Zij krijgen automatisch **bewerkrechten** op elke nieuwe projectmap, dus op de Sheet en de foto’s. Niet nodig in DEV (daar werkt enkel de ontwikkelaar). Zie “DEV en productie” hieronder. |
| `FOLDER_ID` | nee | id van een bestaande Drive-map als hoofdmap. Zonder deze eigenschap maakt het script zelf de map **InspectSolutions** aan. |

## 4. Toestemmingen geven
1. Kies bovenaan de functie **initialiseer** en klik **Uitvoeren**.
2. Google vraagt toestemming (Sheets en Drive). Kies het account, **Geavanceerd** > **Ga naar … (onveilig)** > **Toestaan**. Dit is normaal voor eigen scripts.
3. Klaar als het uitvoeringslogboek “Klaar. Hoofdmap: …” toont.

## 5. Implementeren als web-app
1. **Implementeren > Nieuwe implementatie** > tandwiel > **Web-app**.
2. Uitvoeren als: **Ik**. Toegang: **Iedereen**.
3. **Implementeren** en kopieer de **Web-app-URL** (eindigt op `/exec`).
4. Noteer: **URL** en **sleutel**. Meer heeft de app niet nodig.

## 6. Testen
Open de URL in een browser: er moet `{"ok":true,"app":"InspectSolutions",…}` verschijnen.
In de app: **Beheer > Verbinding**, vul URL en sleutel in, tik **Verbinding testen**. Maak daarna een project aan en een punt: na de synchronisatie staat de projectmap in Drive.

## Het script later aanpassen
Na elke codewijziging: **Implementeren > Implementaties beheren > potlood > Versie: Nieuwe versie > Implementeren**. De URL blijft hetzelfde. **Dit is verplicht na elke update van `Code.gs`**: de app stuurt dan nieuwe gegevens (projecten) die een oude versie niet begrijpt.

## Goed om te weten
- Een punt wordt op `ID` bijgewerkt (geen dubbele rijen bij opnieuw versturen). Het nummer van een punt mag in de app gewijzigd worden: de rij wordt bijgewerkt en de foto’s worden hernoemd.
- Een project in de app krijgt pas een Sheet en fotomap bij de eerste synchronisatie. Wordt de **naam** van een project in de app gewijzigd, dan worden de Sheet en de projectmap hernoemd. Het **projectnummer** kan na de eerste synchronisatie niet meer gewijzigd worden (het zit in alle bestandsnamen). De aanmaakdatum in de naam blijft.
- Een foto is in de app bewerkt (getekend)? Dan staat de bewerkte versie als `…_{n}.jpg` in Drive en in de Sheet, en het origineel als `…_{n}_orig.jpg`. Wordt de foto later opnieuw bewerkt, dan vervangt de nieuwe versie de oude onder dezelfde naam (de oude gaat naar de prullenmand, er komen geen dubbelen). Wordt alles weer gewist, dan verdwijnt het `_orig`-bestand.
- Een punt dat in de app verwijderd wordt, verdwijnt bij de volgende synchronisatie uit de Sheet. De foto’s blijven in Drive staan. Een foto die in de app van een punt wordt verwijderd, gaat naar de prullenmand van Drive.
- Archiveren van een project in de app verandert niets in Drive.
- Wordt de sleutel gewijzigd: pas `SECRET_KEY` aan en voer de nieuwe sleutel in de app in.
- Wordt een projectmap of Sheet handmatig uit Drive verwijderd, dan maakt het script bij de volgende synchronisatie opnieuw een lege aan. De oude punten staan daar dan niet meer in, tenzij ze opnieuw verstuurd worden.
- Apps Script heeft dagelijkse quota’s (o.a. voor aanroepen en Drive-bestanden). Voor één gebruiker met enkele honderden punten en foto’s per project is dat ruim voldoende. Controleer de actuele limieten in de Google-documentatie.
