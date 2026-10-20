/* Service worker: app-shell offline.
   De nieuwe versie wordt op de achtergrond binnengehaald en pas actief als de gebruiker
   op "Nu bijwerken" tikt of de app volledig sluit. Tot dan blijft de oude versie werken.
   Verhoog VERSION bij elke wijziging aan de bestanden (en in app.js). */
var VERSION = "1.0.0";
var CACHE = "inspect-shell-" + VERSION;
var SHELL = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon.svg"
];

self.addEventListener("install", function(event){
  event.waitUntil(caches.open(CACHE).then(async function(cache){
    for(var i = 0; i < SHELL.length; i++){
      var res = await fetch(new Request(SHELL[i], {cache: "reload", credentials: "same-origin"}));
      /* een omleiding (bv. de aanmeldpagina van Cloudflare Access) mag nooit in de cache belanden */
      if(!res.ok || res.redirected) throw new Error("Kan " + SHELL[i] + " niet laden");
      await cache.put(SHELL[i], res);
    }
  }));
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k.indexOf("inspect-shell-") === 0 && k !== CACHE; })
        .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("message", function(event){
  if(event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function(event){
  var req = event.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return; /* Google-verkeer gaat rechtstreeks naar het netwerk */
  event.respondWith(caches.open(CACHE).then(async function(cache){
    var hit = await cache.match(req, {ignoreSearch: true});
    if(hit) return hit;
    if(req.mode === "navigate"){
      var shell = await cache.match("index.html");
      if(shell) return shell;
    }
    return fetch(req);
  }));
});
