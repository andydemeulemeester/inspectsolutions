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
  var keep = {}, maxN = Number(rec.seq) || 0;
  (rec.photos || []).forEach(function (n) { n = Number(n); keep[n] = true; if (n > maxN) maxN = n; });

  // Foto's die op het toestel verwijderd zijn, gaan naar de prullenmand van Drive.
  // Bestandsnamen zijn exact bekend ({nr}_{id}_{n}.jpg), dus we zoeken op exacte naam.
  var links = [];
  for (var n = 1; n <= maxN; n++) {
    var f = photoFile_(nr, id, n);
    if (!f) continue;
    if (keep[n]) links.push(f.getUrl()); else f.setTrashed(true);
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
  var file = photoFile_(nr, id, n);
  if (!file) {
    var blob = Utilities.newBlob(Utilities.base64Decode(req.data), 'image/jpeg', photoName_(nr, id, n));
    file = folder_().createFile(blob);
  }
  addPhotoLink_(id, file.getUrl());
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

/** Voegt een foto-link toe aan de cel van het punt (als die er nog niet in staat). */
function addPhotoLink_(id, url) {
  var sh = sheet_();
  var row = findRow_(sh, id);
  if (!row) return;
  var cell = sh.getRange(row, COL_PHOTOS);
  var cur = String(cell.getValue() || '');
  if (cur.split('\n').indexOf(url) !== -1) return;
  cell.setNumberFormat('@');
  cell.setValue(cur ? cur + '\n' + url : url);
}

function photoName_(nr, id, n) {
  return nr + '_' + id + '_' + n + '.jpg';
}

/** Zoekt een foto op exacte bestandsnaam (zonder die in de prullenmand). */
function photoFile_(nr, id, n) {
  var it = folder_().getFilesByName(photoName_(nr, id, n));
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) return f;
  }
  return null;
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
