/**
 * InspectSolutions – Apps Script web-app
 * Ontvangt projecten, punten en foto's van de PWA. Per project maakt het script zelf een Google Sheet en een
 * fotomap aan in Drive:
 *
 *   {hoofdmap}/{projectnummer}_{naam}_{jjjjmmdd}/
 *       {projectnummer}_{naam}_{jjjjmmdd}      (de Google Sheet van het project)
 *       Foto’s/{projectnummer}_{nr}_{jjjjmmdd-uummss}_{n}.jpg
 *
 * De Sheet waaraan dit script gebonden is (Extensies > Apps Script) is het overzicht: tabblad "Projecten"
 * met alle projecten en links, en tabblad "Codes" met de codelijst. Zie ../docs/01-installatie-apps-script.md.
 *
 * Script-eigenschappen (Projectinstellingen > Script-eigenschappen):
 *   SECRET_KEY    verplicht   de geheime sleutel die ook in de app wordt ingevoerd
 *   FOLDER_ID     optioneel   id van de Drive-hoofdmap voor alle projecten (anders wordt er een aangemaakt)
 *   OVERVIEW_ID   automatisch bij een los script (niet gebonden aan een Sheet): de zelf aangemaakte overzichts-Sheet
 */

var VERSION = '1.3.2';
// Versie van het protocol tussen de app en dit script. De app weigert te synchroniseren als dit getal lager is dan wat
// ze nodig heeft (REQUIRED_SCRIPT_API in public/app.js). Verhoog het hier én daar wanneer de app nieuwe acties of
// gegevens stuurt die een ouder script niet begrijpt.
var API = 1;
var TZ = 'Europe/Brussels';
var PUNTEN_SHEET = 'Punten';
var PROJECTEN_SHEET = 'Projecten';
var CODES_SHEET_NAME = 'Codes';
var ROOT_FOLDER_NAME = 'InspectSolutions';
var PHOTOS_FOLDER_NAME = 'Foto’s';
var HEADERS = ['Nr', 'Aangemaakt', 'Item 1', 'Item 2', 'Opmerking', 'Status', 'Prijs', 'Foto’s', 'ID'];
var PROJECT_HEADERS = ['Projectnummer', 'Naam', 'Aangemaakt', 'Google Sheet', 'Foto’s', 'ID'];
var COL_PHOTOS = 8;
var COL_ID = 9;
var PROJECT_COL_ID = 6;

/** Eénmalig uitvoeren om toestemmingen te geven en het overzicht en de hoofdmap klaar te zetten. */
function initialiseer() {
  overviewSs_().setSpreadsheetTimeZone(TZ);
  overview_();
  root_();
  if (!prop_('SECRET_KEY')) {
    throw new Error('Maak eerst de script-eigenschap SECRET_KEY aan (Projectinstellingen).');
  }
  Logger.log('Klaar. Hoofdmap: ' + root_().getUrl());
}

function doGet() {
  return json_({ ok: true, app: 'InspectSolutions', version: VERSION, api: API });
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
      case 'ping':    return json_({ ok: true, version: VERSION, api: API });
      case 'project': return json_(projectAction_(req.project));
      case 'upsert':  return json_(upsert_(req));
      case 'photo':   return json_(photo_(req));
      case 'delete':  return json_(delete_(req));
      case 'codes':   return json_(codes_(req.codes, req.version));
      default:        return json_({ ok: false, error: 'Onbekende actie: ' + req.action });
    }
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    if (locked) { try { lock.releaseLock(); } catch (x) {} }
  }
}

/* ---------- Projecten ---------- */

/** Maakt het project aan als het nog niet bestaat en past de naam aan als die in de app gewijzigd is. */
function projectAction_(p) {
  var ctx = project_(p, true);
  var name = projectName_(p);
  if (ctx.info.name !== name) {
    ctx.folder.setName(name);
    DriveApp.getFileById(ctx.info.ss).setName(name);
    ctx.info.name = name;
    saveInfo_(ctx.id, ctx.info);
    indexProject_(p, ctx.info);
  }
  return { ok: true, id: ctx.id, sheetUrl: ctx.info.sheetUrl, folderUrl: ctx.info.folderUrl, name: name };
}

/**
 * Zoekt de Sheet en de fotomap van een project. Bestaan ze niet en is create waar, dan worden ze aangemaakt.
 * p = { id, number, name, created } zoals de app het stuurt.
 */
function project_(p, create) {
  var id = cleanId_(p && p.id);
  var raw = prop_('PROJ_' + id);
  if (raw) {
    try {
      var info = JSON.parse(raw);
      var ss = SpreadsheetApp.openById(info.ss);
      return {
        id: id, info: info, ss: ss, sheet: punten_(ss),
        folder: DriveApp.getFolderById(info.folder), photos: DriveApp.getFolderById(info.photos)
      };
    } catch (e) { if (!create) return null; /* map of Sheet is verdwenen: maak opnieuw aan */ }
  }
  if (!create) return null;

  var name = projectName_(p);
  var folder = root_().createFolder(name);
  var spreadsheet = SpreadsheetApp.create(name);
  spreadsheet.setSpreadsheetTimeZone(TZ);
  DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
  var photos = folder.createFolder(PHOTOS_FOLDER_NAME);
  var newInfo = {
    ss: spreadsheet.getId(), folder: folder.getId(), photos: photos.getId(),
    sheetUrl: spreadsheet.getUrl(), folderUrl: folder.getUrl(), name: name
  };
  saveInfo_(id, newInfo);
  var sheet = punten_(spreadsheet);
  indexProject_(p, newInfo);
  return { id: id, info: newInfo, ss: spreadsheet, sheet: sheet, folder: folder, photos: photos };
}

function saveInfo_(id, info) {
  PropertiesService.getScriptProperties().setProperty('PROJ_' + id, JSON.stringify(info));
}

/** Naam van de Sheet en de projectmap: {projectnummer}_{naam in kleine letters aaneen}_{jjjjmmdd}. */
function projectName_(p) {
  return cleanNumber_(p.number) + '_' + (slug_(p.name) || 'project') + '_' + stamp_(p.created, 'yyyyMMdd');
}

function slug_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}

function stamp_(iso, format) {
  return Utilities.formatDate(iso ? new Date(iso) : new Date(), TZ, format);
}

function cleanNumber_(n) {
  n = String(n === undefined || n === null ? '' : n).trim();
  if (!/^[A-Za-z0-9-]{1,12}$/.test(n)) throw new Error('Ongeldig projectnummer.');
  return n;
}

/** Overzicht van alle projecten in de Sheet waaraan het script gebonden is. */
function indexProject_(p, info) {
  var sh = overview_();
  var last = sh.getLastRow();
  var row = 0;
  if (last >= 2) {
    var hit = sh.getRange(2, PROJECT_COL_ID, last - 1, 1).createTextFinder(String(p.id)).matchEntireCell(true).findNext();
    row = hit ? hit.getRow() : 0;
  }
  if (!row) row = Math.max(last, 1) + 1;
  sh.getRange(row, 1, 1, PROJECT_HEADERS.length).setNumberFormat('@');
  sh.getRange(row, 1, 1, PROJECT_HEADERS.length).setValues([[
    String(p.number), String(p.name), stamp_(p.created, 'yyyy-MM-dd'), info.sheetUrl, info.folderUrl, String(p.id)
  ]]);
}

/**
 * De overzichts-Sheet: de Sheet waaraan het script gebonden is. Is het script los gemaakt (script.google.com),
 * dan maakt het zelf een Sheet "InspectSolutions overzicht" in de hoofdmap en onthoudt die in OVERVIEW_ID.
 */
function overviewSs_() {
  var bound = SpreadsheetApp.getActive();
  if (bound) return bound;
  var id = prop_('OVERVIEW_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* Sheet bestaat niet meer: maak een nieuwe */ }
  }
  var ss = SpreadsheetApp.create('InspectSolutions overzicht');
  DriveApp.getFileById(ss.getId()).moveTo(root_());
  PropertiesService.getScriptProperties().setProperty('OVERVIEW_ID', ss.getId());
  return ss;
}

function overview_() {
  var ss = overviewSs_();
  var sh = ss.getSheetByName(PROJECTEN_SHEET);
  if (!sh) {
    sh = ss.insertSheet(PROJECTEN_SHEET, 0);
    sh.getRange(1, 1, 1, PROJECT_HEADERS.length).setValues([PROJECT_HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(2, 220); sh.setColumnWidth(4, 320); sh.setColumnWidth(5, 320);
  }
  return sh;
}

/* ---------- Punten en foto's ---------- */

function upsert_(req) {
  var rec = req.record;
  var ctx = project_(req.project, true);
  var id = cleanId_(rec && rec.id);
  var nr = Number(rec.nr);
  var sh = ctx.sheet;
  var key = key_(req.project, rec.nr, rec.created);
  var keep = {}, edited = {}, maxN = Number(rec.seq) || 0;
  (rec.photos || []).forEach(function (n) { n = Number(n); keep[n] = true; if (n > maxN) maxN = n; });
  (rec.edited || []).forEach(function (n) { edited[Number(n)] = true; });

  // Is het nummer van het punt gewijzigd, hernoem dan de bestaande foto's (ook de originelen) naar het nieuwe nummer.
  var prevNr = Number(rec.prevNr);
  if (prevNr > 0 && prevNr !== nr) {
    var prevKey = key_(req.project, prevNr, rec.created);
    for (var k = 1; k <= maxN; k++) {
      [false, true].forEach(function (isOrig) {
        var old = photoFile_(ctx.photos, prevKey, k, isOrig);
        if (old && !photoFile_(ctx.photos, key, k, isOrig)) old.setName(photoName_(key, k, isOrig));
      });
    }
  }

  // Bestandsnamen zijn exact bekend, dus we zoeken op exacte naam.
  // - Foto's die op het toestel verwijderd zijn, gaan met hun origineel naar de prullenmand van Drive.
  // - Een foto die niet (meer) bewerkt is, heeft geen origineel-bestand meer nodig.
  // - De Sheet krijgt enkel de link naar de bewerkte (of enige) versie.
  var links = [];
  for (var n = 1; n <= maxN; n++) {
    if (!keep[n]) { trashPhoto_(ctx.photos, key, n, false); trashPhoto_(ctx.photos, key, n, true); continue; }
    var f = photoFile_(ctx.photos, key, n, false);
    if (f) links.push(f.getUrl());
    if (!edited[n]) trashPhoto_(ctx.photos, key, n, true);
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
  var ctx = project_(req.project, true);
  var id = cleanId_(req.id);
  var n = Number(req.n);
  if (!(n > 0)) throw new Error('Ongeldig fotonummer.');
  var key = key_(req.project, req.nr, req.created);
  var isOrig = req.orig === true;
  // Bestaat het bestand al (bv. de foto is na synchronisatie bewerkt of een verzoek is herhaald), dan gaat de oude
  // naar de prullenmand en komt de nieuwe onder dezelfde naam. Zo blijft er altijd precies één bestand per naam.
  trashPhoto_(ctx.photos, key, n, isOrig);
  var blob = Utilities.newBlob(Utilities.base64Decode(req.data), 'image/jpeg', photoName_(key, n, isOrig));
  ctx.photos.createFile(blob);
  if (!isOrig) refreshPhotoCell_(ctx, id, key, Math.max(Number(req.seq) || 0, n));
  return { ok: true, id: id, n: n };
}

function delete_(req) {
  var id = cleanId_(req.id);
  var ctx = project_(req.project, false);
  if (ctx) {
    var row = findRow_(ctx.sheet, id);
    if (row) ctx.sheet.deleteRow(row);
  }
  // De foto's blijven bewust in Drive staan.
  return { ok: true, id: id };
}

function codes_(list, version) {
  var ss = overviewSs_();
  var sh = ss.getSheetByName(CODES_SHEET_NAME) || ss.insertSheet(CODES_SHEET_NAME);
  sh.clear();
  sh.getRange(1, 1, 1, 2).setValues([['Code', 'Omschrijving']]).setFontWeight('bold');
  // Versienummer van de lijst (bv. "2", of "2 (aangepast)" als ze in de app gewijzigd is)
  sh.getRange(1, 4, 1, 2).setNumberFormat('@').setValues([['Versie', String(version || '')]]);
  sh.getRange(1, 4).setFontWeight('bold');
  sh.setFrozenRows(1);
  if (list && list.length) {
    var vals = list.map(function (c) { return [String(c.code), String(c.label)]; });
    sh.getRange(2, 1, vals.length, 2).setNumberFormat('@').setValues(vals);
  }
  return { ok: true, count: (list || []).length };
}

/* ---------- Hulpfuncties ---------- */

/** Zet de links van de foto's (bewerkte of enige versie) opnieuw in de cel van het punt. */
function refreshPhotoCell_(ctx, id, key, maxN) {
  var row = findRow_(ctx.sheet, id);
  if (!row) return;
  var links = [];
  for (var n = 1; n <= maxN; n++) {
    var f = photoFile_(ctx.photos, key, n, false);
    if (f) links.push(f.getUrl());
  }
  var cell = ctx.sheet.getRange(row, COL_PHOTOS);
  cell.setNumberFormat('@');
  cell.setValue(links.join('\n'));
}

/** Onderdelen van de bestandsnaam: projectnummer, volgnummer en aanmaaktijd van het punt (stabiel en uniek). */
function key_(project, nr, created) {
  return { num: cleanNumber_(project && project.number), nr: Number(nr), stamp: stamp_(created, 'yyyyMMdd-HHmmss') };
}

/** {projectnummer}_{nr}_{jjjjmmdd-uummss}_{n}.jpg voor de bewerkte (of enige) versie, met _orig voor het origineel. */
function photoName_(key, n, isOrig) {
  return key.num + '_' + key.nr + '_' + key.stamp + '_' + n + (isOrig ? '_orig' : '') + '.jpg';
}

/** Zoekt een foto op exacte bestandsnaam (zonder die in de prullenmand). */
function photoFile_(folder, key, n, isOrig) {
  var it = folder.getFilesByName(photoName_(key, n, isOrig));
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) return f;
  }
  return null;
}

/** Gooit alle bestanden met deze naam in de prullenmand. */
function trashPhoto_(folder, key, n, isOrig) {
  var it = folder.getFilesByName(photoName_(key, n, isOrig));
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

/** Het tabblad "Punten" van een projectsheet, met kopregel. */
function punten_(ss) {
  var sh = ss.getSheetByName(PUNTEN_SHEET);
  if (!sh) {
    var first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0 && ss.getSheets().length === 1) {
      sh = first.setName(PUNTEN_SHEET);
    } else {
      sh = ss.insertSheet(PUNTEN_SHEET, 0);
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

/** De hoofdmap in Drive waarin alle projectmappen komen. */
function root_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* map bestaat niet meer: maak een nieuwe */ }
  }
  var f = DriveApp.createFolder(ROOT_FOLDER_NAME);
  props.setProperty('FOLDER_ID', f.getId());
  return f;
}

function cleanId_(id) {
  id = String(id || '');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) throw new Error('Ongeldig id.');
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
