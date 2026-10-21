# InspectSolutions

Offline-first PWA voor een controlerondgang (±500 punten) op één Samsung S21. Lokale opslag in IndexedDB, synchronisatie met een Google Sheet (tekst) en Google Drive (foto’s) via een Apps Script web-app. Zie [InspectSolutions-projectbrief.md](InspectSolutions-projectbrief.md).

| Map | Inhoud |
|---|---|
| [public/](public/) | De PWA (HTML, CSS, JS, service worker, manifest, iconen) – dit is de map voor Cloudflare Pages |
| [apps-script/Code.gs](apps-script/Code.gs) | Backend: per project een Sheet en fotomap in Drive |
| [docs/](docs/) | Installatie Apps Script, handleiding klant, hosting en Cloudflare Access |
| inspectsolutions-prototype.html | Goedgekeurd prototype (referentie) |

## Lokaal draaien
Serveer `public/` via een lokale webserver (service worker en IndexedDB vragen `localhost` of https), bv. `npx serve public`.

## Technische keuzes
- Vanilla JS, geen externe afhankelijkheden. Alles staat in de service-worker-cache.
- Wachtrij: een punt is “Verstuurd” pas als de server de tekst én alle foto’s bevestigd heeft (`syncedRev === rev` en elke foto `up`). Tekst eerst (upsert op `id`), dan één foto per request; herhaling met oplopende wachttijd (5 s tot 5 min). Meerdere tabbladen: één sync tegelijk (Web Locks), het volgnummer wordt afgeleid uit de bestaande punten (hoogste + 1), is aanpasbaar en wordt bij het opslaan in één IndexedDB-transactie op uniekheid gecontroleerd. Een gewijzigd nummer werkt de bestaande rij bij (upsert op `id`) en hernoemt de foto’s in Drive (`prevNr`).
- Verwijderen gebruikt een “grafsteen” zodat de rij ook uit de Sheet verdwijnt.
- Updates: nieuwe service worker wacht tot de gebruiker bijwerkt; oude versie blijft werken. **Verhoog `VERSION` in `sw.js` én `app.js` bij elke release.**
- URL en sleutel staan nergens in de code; ze worden in Beheer ingevoerd en lokaal bewaard.
