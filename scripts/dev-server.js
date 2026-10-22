/* Lokale server voor public/ (npm run dev, http://localhost:8080).
   Net als de Cloudflare-build levert ze /config.js met de geheime sleutel, maar dan uit het bestand .env.local
   (staat in .gitignore) of uit de omgevingsvariabele. Er wordt niets in de repo aangepast.
   .env.local:  GOOGLE_APPS_SCRIPT_SECRET_KEY=jouw-sleutel */
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
const port = Number(process.env.PORT || 8080);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

function readKey() {
  if (process.env.GOOGLE_APPS_SCRIPT_SECRET_KEY) return process.env.GOOGLE_APPS_SCRIPT_SECRET_KEY.trim();
  try {
    const m = fs.readFileSync(path.join(root, '.env.local'), 'utf8').match(/^\s*GOOGLE_APPS_SCRIPT_SECRET_KEY\s*=\s*(.+?)\s*$/m);
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch (e) { return ''; }
}

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  res.setHeader('Cache-Control', 'no-cache');
  if (p === '/config.js') {
    res.setHeader('Content-Type', mime['.js']);
    res.end('window.INSPECT_SCRIPT_KEY = ' + JSON.stringify(readKey()) + ';\n');
    return;
  }
  const f = path.join(pub, p);
  if (!f.startsWith(pub) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; res.end('niet gevonden'); return; }
  res.setHeader('Content-Type', mime[path.extname(f)] || 'application/octet-stream');
  res.end(fs.readFileSync(f));
}).listen(port, '127.0.0.1', () => {
  console.log('Server op http://localhost:' + port + (readKey() ? ' (sleutel uit .env.local)' : ' (geen sleutel: maak .env.local aan)'));
});
