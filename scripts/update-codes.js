/* Zet de standaard codelijst en de groepen in public/app.js gelijk met data/itemlijst.json.
   De app bevat de lijst bewust rechtstreeks in de code, zodat ze offline altijd beschikbaar is.
   Gebruik:  node scripts/update-codes.js   (of: npm run codes)
   Verander je de lijst: verhoog eerst "versie" in data/itemlijst.json, voer dit script uit en verhoog daarna
   VERSION in public/sw.js en public/app.js.
   Het script bewaart ook een hash van de vorige standaardlijst (KNOWN_DEFAULT_HASHES). Zo herkent de app een
   toestel dat nog de ongewijzigde oude lijst heeft en vervangt ze door de nieuwe, terwijl een zelf aangepaste lijst blijft staan. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const json = JSON.parse(fs.readFileSync(path.join(root, 'data', 'itemlijst.json'), 'utf8'));
const appPath = path.join(root, 'public', 'app.js');
let src = fs.readFileSync(appPath, 'utf8');
const fail = m => { console.error(m); process.exit(1); };

if (!Number.isInteger(json.versie) || json.versie < 1) fail('data/itemlijst.json: "versie" moet een geheel getal van 1 of hoger zijn');
if (!Array.isArray(json.groepen) || !json.groepen.length) fail('data/itemlijst.json: "groepen" ontbreekt');

/* zelfde hash als hashText() in de app (djb2 over de tekst "CODE | omschrijving" per regel) */
const hash = lines => { const t = lines.join('\n'); let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return h >>> 0; };

const newLines = json.items.map(it => it.code + ' | ' + it.label);

/* 1. hash van de huidige (straks oude) standaardlijst bewaren als ze verschilt */
const defRe = /(var DEFAULT_TEXT = \[\r?\n)([\s\S]*?)(\r?\n\]\.join\("\\n"\);)/;
const dm = src.match(defRe);
if (!dm) fail('DEFAULT_TEXT niet gevonden in public/app.js');
const oldLines = eval('[' + dm[2] + ']');
const hre = /^var KNOWN_DEFAULT_HASHES = \[(.*)\];/m;
const hm = src.match(hre);
if (!hm) fail('KNOWN_DEFAULT_HASHES niet gevonden in public/app.js');
const hashes = hm[1].split(',').map(s => s.trim()).filter(Boolean).map(Number);
if (JSON.stringify(oldLines) !== JSON.stringify(newLines) && !hashes.includes(hash(oldLines))) hashes.push(hash(oldLines));
const nh = hash(newLines);
const kept = hashes.filter(h => h !== nh);              /* de nieuwe lijst zelf hoort er niet in */
src = src.replace(hre, () => 'var KNOWN_DEFAULT_HASHES = [' + kept.join(', ') + '];');

/* 2. de lijst, de groepen en het versienummer */
src = src.replace(defRe, (m, a, body, b) => a + newLines.map(l => '  ' + JSON.stringify(l)).join(',\n') + b);
const gre = /^var GROUPS = .*;/m;
if (!gre.test(src)) fail('GROUPS niet gevonden in public/app.js');
src = src.replace(gre, () => 'var GROUPS = ' + JSON.stringify(json.groepen.map(g => ({ letter: g.letter, name: g.naam }))) + ';');
const vre = /var CODES_VERSION = \d+;/;
if (!vre.test(src)) fail('CODES_VERSION niet gevonden in public/app.js');
src = src.replace(vre, 'var CODES_VERSION = ' + json.versie + ';');

fs.writeFileSync(appPath, src);
console.log('Codelijst versie ' + json.versie + ': ' + json.items.length + ' items, ' + json.groepen.length + ' groepen, ' + kept.length + ' eerdere lijst(en) herkend.');
