/* Schrijft de geheime sleutel van het Apps Script (build-secret GOOGLE_APPS_SCRIPT_SECRET_KEY in Cloudflare)
   in public/config.js, zodat de app de verbinding zelf instelt. Draai dit enkel als build-command op Cloudflare:
   het resultaat mag nooit in git terechtkomen. Zonder variabele blijft de sleutel leeg en werkt de app zoals voorheen.
   Het script zet ook een korte hash van de sleutel in public/sw.js, zodat de cache vernieuwd wordt als de sleutel wijzigt. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const pub = path.join(__dirname, '..', 'public');
const key = (process.env.GOOGLE_APPS_SCRIPT_SECRET_KEY || '').trim();

fs.writeFileSync(path.join(pub, 'config.js'),
  '/* gegenereerd tijdens de build */\nwindow.INSPECT_SCRIPT_KEY = ' + JSON.stringify(key) + ';\n');

const stamp = key ? crypto.createHash('sha256').update(key).digest('hex').slice(0, 8) : '';
const swPath = path.join(pub, 'sw.js');
const sw = fs.readFileSync(swPath, 'utf8');
const re = /var CONFIG_STAMP = "[0-9a-f]*";/;
if (!re.test(sw)) { console.error('CONFIG_STAMP niet gevonden in public/sw.js'); process.exit(1); }
fs.writeFileSync(swPath, sw.replace(re, 'var CONFIG_STAMP = "' + stamp + '";'));
console.log(key ? 'config.js geschreven met sleutel (' + key.length + ' tekens)' : 'GOOGLE_APPS_SCRIPT_SECRET_KEY ontbreekt: config.js blijft leeg');
