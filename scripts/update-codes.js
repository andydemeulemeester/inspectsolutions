/* Zet de standaard codelijst in public/app.js gelijk met data/itemlijst.json.
   De app bevat de lijst bewust rechtstreeks in de code, zodat ze offline altijd beschikbaar is.
   Gebruik:  node scripts/update-codes.js   (of: npm run codes)
   Verander je de lijst: verhoog eerst "versie" in data/itemlijst.json, voer dit script uit en verhoog daarna
   VERSION in public/sw.js en public/app.js. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const json = JSON.parse(fs.readFileSync(path.join(root, 'data', 'itemlijst.json'), 'utf8'));
const appPath = path.join(root, 'public', 'app.js');
const lines = json.items.map(it => '  ' + JSON.stringify(it.code + ' | ' + it.label));
let src = fs.readFileSync(appPath, 'utf8');
const re = /(var DEFAULT_TEXT = \[\r?\n)[\s\S]*?(\r?\n\]\.join\("\\n"\);)/;
if (!re.test(src)) { console.error('DEFAULT_TEXT niet gevonden in public/app.js'); process.exit(1); }
src = src.replace(re, (m, a, b) => a + lines.join(',\n') + b);
/* het versienummer van de lijst (data/itemlijst.json, veld "versie") wordt CODES_VERSION in de app */
if (!Number.isInteger(json.versie) || json.versie < 1) { console.error('data/itemlijst.json: "versie" moet een geheel getal van 1 of hoger zijn'); process.exit(1); }
const vre = /var CODES_VERSION = \d+;/;
if (!vre.test(src)) { console.error('CODES_VERSION niet gevonden in public/app.js'); process.exit(1); }
src = src.replace(vre, 'var CODES_VERSION = ' + json.versie + ';');
fs.writeFileSync(appPath, src);
console.log('Codelijst versie ' + json.versie + ' bijgewerkt: ' + json.items.length + ' items in public/app.js');
