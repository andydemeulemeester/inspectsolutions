/**
 * InspectSolutions – Apps Script web-app
 * Ontvangt punten en foto's van de PWA en schrijft ze naar een Google Sheet en een Drive-map.
 *
 * Gebonden aan de Sheet (Extensies > Apps Script). Zie ../docs/01-installatie-apps-script.md.
 *
 * Script-eigenschappen (Projectinstellingen > Script-eigenschappen):
 *   SECRET_KEY  verplicht   de geheime sleutel die ook in de app wordt ingevoerd
 *   FOLDER_ID   optioneel   id van de Drive-map voor de foto's (anders wordt een map aangemaakt)
 */

var VERSION = '1.0.0';
var TZ = 'Europe/Brussels';
var SHEET_NAME = 'Punten';
var CODES_SHEET_NAME = 'Codes';
var FOLDER_NAME = 'InspectSolutions foto’s';
var HEADERS = ['Nr', 'Aangemaakt', 'Item 1', 'Item 2', 'Opmerking', 'Status', 'Prijs', 'Foto’s', 'ID'];
var COL_PHOTOS = 8;
var COL_ID = 9;

/** Eénmalig uitvoeren om toestemmingen te geven en de Sheet en map klaar te zetten. */
function initialiseer() {
  SpreadsheetApp.getActive().setSpreadsheetTimeZone(TZ);
  sheet_();
  folder_();
  if (!prop_('SECRET_KEY')) {
    throw new Error('Maak eerst de script-eigenschap SECRET_KEY aan (Projectinstellingen).');
  }
  Logger.log('Klaar. Map: ' + folder_().getUrl());
}

function doGet() {
  return json_({ ok: true, app: 'InspectSolutions', version: VERSION });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    var req = JSON.parse(e.postData.contents);
    if (!keyOk_(req.key)) {
      return json_({ ok: false, code: 'auth', error: 'Ongeldige sleutel.' });
    }
    lock.waitLock(30000);
    locked = true;
    switch (req.action) {
      case 'ping':   return json_({ ok: true, version: VERSION });
      case 'upsert': return json_(upsert_(req.record));
      case 'photo':  return json_(photo_(req));
      case 'delete': return json_(delete_(req.id));
      case 'codes':  return json_(codes_(req.codes));
      default:       return json_({ ok: false, error: 'Onbekende actie: ' + req.action });
    }
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    if (locked) { try { lock.releaseLock(); } catch (x) {} }
  }
}

/* ---------- Acties ---------- */

function upsert_(rec) {
  var id = cleanId_(rec && rec.id);
  var nr = Number(rec.nr);
  var sh = sheet_();
  var keep = {}, edited = {}, maxN = Number(rec.seq) || 0;
  (rec.photos || []).forEach(function (n) { n = Number(n); keep[n] = true; if (n > maxN) maxN = n; });
  (rec.edited || []).forEach(function (n) { edited[Number(n)] = true; });

  // Is het nummer van het punt gewijzigd, hernoem dan de bestaande foto's (ook de originelen) naar het nieuwe nummer.
  var prevNr = Number(rec.prevNr);
  if (prevNr > 0 && prevNr !== nr) {
    for (var k = 1; k <= maxN; k++) {
      [false, true].forEach(function (isOrig) {
        var old = photoFile_(prevNr, id, k, isOrig);
        if (old && !photoFile_(nr, id, k, isOrig)) old.setName(photoName_(nr, id, k, isOrig));
      });
    }
  }

  // Bestandsnamen zijn exact bekend ({nr}_{id}_{n}.jpg en {nr}_{id}_{n}_orig.jpg), dus we zoeken op exacte naam.
  // - Foto's die op het toestel verwijderd zijn, gaan met hun origineel naar de prullenmand van Drive.
  // - Een foto die niet (meer) bewerkt is, heeft geen origineel-bestand meer nodig.
  // - De Sheet krijgt enkel de link naar de bewerkte (of enige) versie.
  var links = [];
  for (var n = 1; n <= maxN; n++) {
    if (!keep[n]) { trashPhoto_(nr, id, n, false); trashPhoto_(nr, id, n, true); continue; }
    var f = photoFile_(nr, id, n, false);
    if (f) links.push(f.getUrl());
    if (!edited[n]) trashPhoto_(nr, id, n, true);
  }

  var price = (rec.price === '' || rec.price === null || rec.price === undefined) ? '' : Number(rec.price);
  var row = findRow_(sh, id);
  if (!row) row = Math.max(sh.getLastRow(), 1) + 1;

  // Tekstkolommen als platte tekst, zodat "=…" in een opmerking nooit als formule wordt gelezen.
  sh.getRange(row, 3, 1, 4).setNumberFormat('@');
  sh.getRange(row, COL_PHOTOS, 1, 2).setNumberFormat('@');
  sh.getRange(row, 2).setNumberFormat('dd/MM/yyyy HH:mm');
  sh.getRange(row, 1, 1, HEADERS.length).setValues([[
    nr,
    rec.created ? new Date(rec.created) : new Date(),
    String(rec.item1 || ''),
    String(rec.item2 || ''),
    String(rec.note || ''),
    String(rec.status || ''),
    price,
    links.join('\n'),
    id
  ]]);
  return { ok: true, id: id };
}

function photo_(req) {
  var id = cleanId_(req.id);
  var nr = Number(req.nr);
  var n = Number(req.n);
  if (!(n > 0)) throw new Error('Ongeldig fotonummer.');
  var isOrig = req.orig === true;
  // Bestaat het bestand al (bv. de foto is na synchronisatie bewerkt of een verzoek is herhaald), dan gaat de oude
  // naar de prullenmand en komt de nieuwe onder dezelfde naam. Zo blijft er altijd precies één bestand per naam.
  trashPhoto_(nr, id, n, isOrig);
  var blob = Utilities.newBlob(Utilities.base64Decode(req.data), 'image/jpeg', photoName_(nr, id, n, isOrig));
  folder_().createFile(blob);
  if (!isOrig) refreshPhotoCell_(id, nr, Math.max(Number(req.seq) || 0, n));
  return { ok: true, id: id, n: n };
}

function delete_(rawId) {
  var id = cleanId_(rawId);
  var sh = sheet_();
  var row = findRow_(sh, id);
  if (row) sh.deleteRow(row);
  // De foto's blijven bewust in Drive staan.
  return { ok: true, id: id };
}

function codes_(list) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CODES_SHEET_NAME) || ss.insertSheet(CODES_SHEET_NAME);
  sh.clear();
  sh.getRange(1, 1, 1, 2).setValues([['Code', 'Omschrijving']]).setFontWeight('bold');
  sh.setFrozenRows(1);
  if (list && list.length) {
    var vals = list.map(function (c) { return [String(c.code), String(c.label)]; });
    sh.getRange(2, 1, vals.length, 2).setNumberFormat('@').setValues(vals);
  }
  return { ok: true, count: (list || []).length };
}

/* ---------- Hulpfuncties ---------- */

/** Zet de links van de foto's (bewerkte of enige versie) opnieuw in de cel van het punt. */
function refreshPhotoCell_(id, nr, maxN) {
  var sh = sheet_();
  var row = findRow_(sh, id);
  if (!row) return;
  var links = [];
  for (var n = 1; n <= maxN; n++) {
    var f = photoFile_(nr, id, n, false);
    if (f) links.push(f.getUrl());
  }
  var cell = sh.getRange(row, COL_PHOTOS);
  cell.setNumberFormat('@');
  cell.setValue(links.join('\n'));
}

/** {nr}_{id}_{n}.jpg voor de bewerkte (of enige) versie, {nr}_{id}_{n}_orig.jpg voor het origineel. */
function photoName_(nr, id, n, isOrig) {
  return nr + '_' + id + '_' + n + (isOrig ? '_orig' : '') + '.jpg';
}

/** Zoekt een foto op exacte bestandsnaam (zonder die in de prullenmand). */
function photoFile_(nr, id, n, isOrig) {
  var it = folder_().getFilesByName(photoName_(nr, id, n, isOrig));
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) return f;
  }
  return null;
}

/** Gooit alle bestanden met deze naam in de prullenmand. */
function trashPhoto_(nr, id, n, isOrig) {
  var it = folder_().getFilesByName(photoName_(nr, id, n, isOrig));
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) f.setTrashed(true);
  }
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var hit = sh.getRange(2, COL_ID, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function sheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    var first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0 && ss.getSheets().length === 1) {
      sh = first.setName(SHEET_NAME);
    } else {
      sh = ss.insertSheet(SHEET_NAME, 0);
    }
  }
  if (sh.getRange(1, 1).getValue() !== HEADERS[0]) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(3, 260); sh.setColumnWidth(4, 260); sh.setColumnWidth(5, 260);
    sh.setColumnWidth(COL_PHOTOS, 300);
  }
  return sh;
}

function folder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* map bestaat niet meer: maak een nieuwe */ }
  }
  var f = DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('FOLDER_ID', f.getId());
  return f;
}

function cleanId_(id) {
  id = String(id || '');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) throw new Error('Ongeldig punt-id.');
  return id;
}

function prop_(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function keyOk_(key) {
  var secret = prop_('SECRET_KEY');
  if (!secret) throw new Error('SECRET_KEY is niet ingesteld in het script.');
  key = String(key || '');
  if (key.length !== secret.length) return false;
  var diff = 0;
  for (var i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
