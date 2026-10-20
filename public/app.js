(function(){
"use strict";

var VERSION = "1.0.6"; /* houd gelijk met VERSION in sw.js */

var $ = function(s){ return document.querySelector(s); };
var esc = function(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };

/* ---------- Standaard codelijst (80 items van de klant, ongewijzigd) ---------- */
var DEFAULT_TEXT = [
  "OP01 | opening vergroten en typeoplossing TV254/293  uitvoeren",
  "DI01 | Nazicht gesteldheid muur - lijkt ok te zijn",
  "PR01 | Opening vergroten rond goot en productoplossing uitvoeren",
  "LV01 | Lineaire voeg uit te voeren",
  "OP02 | opening vergroten  kabels/ buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "DE01 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet",
  "DE02 | brandwerend glas ok",
  "DI02 | algemeen zicht",
  "OP03 | typeoplossing TV254/293 uitvoeren",
  "DE03 | Herstellen vasthoudmagneet",
  "PR02 | Schuim verwijderen , opening vergroten rond item  en productoplossing uitvoeren",
  "OP04 | typeoplossing TV254/293 uitvoeren en nadien mantelbuis opstoppen met rotswol",
  "OP05 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 uitvoeren",
  "PR03 | mortel verwijderen , opening vergroten rond kabelbundel en productoplossing uitvoeren",
  "LV02 | Lineaire voeg uit te voeren-oude weg productoplossing",
  "OP06 | 1 buis opening vergroten en typeoplossing TV254/293  uitvoeren",
  "PR04 | Schuim verwijderen , opening vergroten rond buis en productoplossing uitvoeren",
  "PL01 | plafond herstellen",
  "OP07 | opening vergroten en uitvoeren met typeoplossing TV 254/293 en rond de buis omkasting maken met flexibele productoplossing",
  "OP08 | typeoplossing TV254/293 uitvoeren gat te dichten",
  "PL02 | plafond herstellen + kabels TV + buizen productoplossing",
  "OP09 | isolatie openknippen en achterliggend op de muur typeoplossing uitvoeren TV254/293",
  "OP10 | opening vergroten  kabels/buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "OP11 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 type C uitvoeren",
  "PR05 | mortel verwijderen , opening vergroten rond kabelbundel /buis en productoplossing uitvoeren",
  "OP12 | typeoplossing TV254/293 uitvoeren en ook mantelbuis opstoppen met rotswol",
  "OP13 | opening vergroten en typeoplossing TV254/293 uitvoeren",
  "OP14 | typeoplossing TV254/293 uitvoeren blind gat te dichten",
  "DE04 | nieuwe zwaai deur te plaatsen - EI30 schilderafwerking + magneet",
  "PR06 | buizen en kabels doorheen nieuw bovenpaneel productoplossing",
  "OP15 | Schuim verwijderen , kabels uit elkaar en uitvoeren typeoplossing TV254/293",
  "LV03 | diversen kabels buizen lin voeg - productopl",
  "LV04 | opmetsen wand +afdichten vlgs TV + lin voeg",
  "DE05 | nieuwe  deur te plaatsen - EI30 schilderafwerking",
  "PR07 | Schuim wegnemen opstop volgens productoplossing  uitlijning is Niet ok+nieuwe klep",
  "PA01 | afdichting via panelen te maken productopl",
  "OP16 | kabels uit elkaar en uitvoeren typeoplossing TV254/293",
  "OP17 | Opening vergroten en typeoplossing TV254/293 uitvoeren",
  "PA02 | dichten opening met panelen",
  "OP18 | buizen en kabels vlgs TV254/293",
  "PA03 | luik openen en afdichten productopl panelen",
  "WA01 | Nieuwe afscherming E60 rolluik/gordijn douches en inkom",
  "WA02 | Achterliggende wand EI30 te plaatsen",
  "WA03 | Wand EI30 te plaatsen",
  "OP19 | bovenconstructie typeopl TV 254/293 + nieuw plafond",
  "DE06 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet + doorvoeren bovenpaneel",
  "OP20 | kabels uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "DE07 | nieuwe deur te plaatsen - EI30 schilderafwerking",
  "PR08 | Evt Schuim wegnemen + opstop volgens productoplossing",
  "OP21 | kabels uit elkaar en uitvoeren typeoplossing TV254/293+ productoplossingen",
  "LV05 | lin voeg en paneel",
  "DE08 | nieuwe deur te plaatsen - EI30 schilderafwerking + tussendeurdorpel",
  "OP22 | typeoplossing TV254/293 uitvoeren",
  "PR09 | productoplossing voor kabels en buis",
  "PR10 | Schuim verwijderen, opening vergroten enproductoplossing",
  "PA04 | Nieuw brandwerend luik",
  "PA05 | productoplossing panelen",
  "DE09 | Brandwerende schuifdeur E30-schilderafwerking",
  "WA04 | nieuwe wand EI30 achter bestaand raam",
  "PR11 | opening vergroten rond kabelbundel en productoplossing uitvoeren",
  "WA05 | nieuwe wand EI30 achter bestaand raam - 3 stuks",
  "WA06 | nieuwe wand EI30 achter bestaand raam - achter bekleding",
  "PL03 | plafond  - 2 lagen gips erop",
  "LV06 | productoplossing lin voeg",
  "PR12 | productoplossing voor kabels en buis - kabelgoot",
  "PA06 | herstel achter wand via luik",
  "DI03 | meting",
  "PR13 | Evt Schuim wegnemen + opstop volgens productoplossing   + uitlijning controleren",
  "OP23 | Opening vergroten en typeoplossing TV254/293",
  "DE10 | nieuwe zwaaideur te plaatsen - EI30 schilderafwerking",
  "PA07 | nieuwe doorgeefluik te plaatsen - EI30 schilderafwerking  + brandwerende onderbouw",
  "WA07 | nieuwe wand EI 30",
  "PR14 | opstop volgens productoplossing",
  "LV07 | lin voeg",
  "PA08 | paneel bovenaan brandwerend maken",
  "DI04 | detail",
  "DE11 | Deur comform = ok",
  "DE12 | nieuw brandwerend raam",
  "DE13 | rooster te plaatsen",
  "DE14 | brandwerend rooster"
].join("\n");

function parseCodes(text){
  var out = [], used = {}, auto = 1;
  String(text).split(/\r?\n/).forEach(function(line){
    line = line.trim();
    if(!line) return;
    var code = "", label = line, i = line.indexOf("|");
    if(i > 0){ code = line.slice(0, i).trim().toUpperCase().slice(0, 8); label = line.slice(i + 1).trim(); }
    if(!label) return;
    if(!code || used[code]){
      do { code = "C" + String(auto++).padStart(3, "0"); } while(used[code]);
    }
    used[code] = true;
    out.push({code: code, label: label});
  });
  return out;
}
function codesToText(list){
  return list.map(function(c){ return c.code + " | " + c.label; }).join("\n");
}

/* ---------- Opslag: IndexedDB, met geheugen als noodoplossing ---------- */
var Store = (function(){
  var db = null, useMem = false;
  var mem = {records: {}, meta: {}};

  function open(){
    var attempt = new Promise(function(resolve){
      try{
        var req = indexedDB.open("inspectsolutions", 1);
        req.onupgradeneeded = function(){
          var d = req.result;
          if(!d.objectStoreNames.contains("records")) d.createObjectStore("records", {keyPath: "id"});
          if(!d.objectStoreNames.contains("meta")) d.createObjectStore("meta", {keyPath: "key"});
        };
        req.onsuccess = function(){
          db = req.result;
          db.onversionchange = function(){ db.close(); };
          resolve(true);
        };
        req.onerror = function(){ resolve(false); };
        req.onblocked = function(){ resolve(false); };
      }catch(e){ resolve(false); }
    });
    var timeout = new Promise(function(resolve){ setTimeout(function(){ resolve(false); }, 3000); });
    return Promise.race([attempt, timeout]).then(function(ok){ if(!ok) useMem = true; return ok; });
  }

  /* voert fn uit in één transactie; fn krijgt de stores en geeft een functie terug die het resultaat levert */
  function tx(names, mode, fn){
    return new Promise(function(resolve, reject){
      var t = db.transaction(names, mode), getResult;
      try{ getResult = fn(t); }catch(e){ try{ t.abort(); }catch(x){} reject(e); return; }
      t.oncomplete = function(){ resolve(getResult ? getResult() : undefined); };
      t.onerror = function(){ reject(t.error); };
      t.onabort = function(){ reject(t.error || t.myError); };
    });
  }

  return {
    open: open,
    all: function(){
      if(useMem) return Promise.resolve(Object.keys(mem.records).map(function(k){ return mem.records[k]; }));
      return tx("records", "readonly", function(t){ var r = t.objectStore("records").getAll(); return function(){ return r.result; }; });
    },
    get: function(id){
      if(useMem) return Promise.resolve(mem.records[id]);
      return tx("records", "readonly", function(t){ var r = t.objectStore("records").get(id); return function(){ return r.result; }; });
    },
    put: function(rec){
      if(useMem){ mem.records[rec.id] = rec; return Promise.resolve(); }
      return tx("records", "readwrite", function(t){ t.objectStore("records").put(rec); });
    },
    del: function(id){
      if(useMem){ delete mem.records[id]; return Promise.resolve(); }
      return tx("records", "readwrite", function(t){ t.objectStore("records").delete(id); });
    },
    clear: function(){
      if(useMem){ mem.records = {}; return Promise.resolve(); }
      return tx("records", "readwrite", function(t){ t.objectStore("records").clear(); });
    },
    /* lezen-wijzigen-schrijven in één transactie, zodat gelijktijdige wijzigingen elkaar niet overschrijven */
    update: function(id, fn){
      if(useMem){
        var m = mem.records[id];
        if(!m) return Promise.resolve(undefined);
        mem.records[id] = fn(m) || m;
        return Promise.resolve(mem.records[id]);
      }
      return tx("records", "readwrite", function(t){
        var s = t.objectStore("records"), out;
        s.get(id).onsuccess = function(e){
          var rec = e.target.result;
          if(!rec || rec.tomb) return;
          out = fn(rec) || rec;
          s.put(out);
        };
        return function(){ return out; };
      });
    },
    getMeta: function(key){
      if(useMem) return Promise.resolve(mem.meta[key]);
      return tx("meta", "readonly", function(t){ var r = t.objectStore("meta").get(key); return function(){ return r.result ? r.result.value : undefined; }; });
    },
    setMeta: function(key, value){
      if(useMem){ mem.meta[key] = value; return Promise.resolve(); }
      return tx("meta", "readwrite", function(t){ t.objectStore("meta").put({key: key, value: value}); });
    },
    /* Punt opslaan met controle op een uniek nummer, alles in één transactie (dus ook veilig met meerdere tabbladen).
       build(bestaand) geeft het nieuwe record terug (of niets als het punt niet meer bestaat).
       Is het nummer al in gebruik: fout met .dup = nummer, of (autoNr) automatisch het hoogste nummer + 1. */
    commit: function(id, build, autoNr){
      function run(all){
        var existing = all.filter(function(r){ return r.id === id && !r.tomb; })[0];
        var rec = build(existing);
        if(!rec) return null;
        var others = all.filter(function(r){ return !r.tomb && r.id !== rec.id; });
        if(others.some(function(r){ return r.nr === rec.nr; })){
          if(!autoNr){ var err = new Error("nummer in gebruik"); err.dup = rec.nr; throw err; }
          rec.nr = others.reduce(function(m, r){ return Math.max(m, r.nr); }, 0) + 1;
        }
        return rec;
      }
      if(useMem){
        try{
          var m = run(Object.keys(mem.records).map(function(k){ return mem.records[k]; }));
          if(m) mem.records[m.id] = m;
          return Promise.resolve(m);
        }catch(e){ return Promise.reject(e); }
      }
      return tx("records", "readwrite", function(t){
        var s = t.objectStore("records"), out = null;
        s.getAll().onsuccess = function(e){
          try{ out = run(e.target.result); if(out) s.put(out); }
          catch(err){ t.myError = err; t.abort(); }
        };
        return function(){ return out; };
      });
    }
  };
})();

/* ---------- Toestand ---------- */
var codes = [], records = [], tombCount = 0, codesDirty = false, cfg = null;
var filter = "all";
var draft = null, showItem2 = false, pickSlot = 0, saving = false;
var forceOff = false, syncing = false, syncErr = "";
var stack = [], view = "List", listScroll = 0, discardOk = false, draftSnap = "";
var PRICES = [50,100,200,300,400,500,600,700,800,900,1000];
var DEFAULT_PRICE = 50;
var channel = null;

function isOnline(){ return navigator.onLine !== false && !forceOff; }
function uid(){
  try{ if(window.crypto && crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
  return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
function fmt(iso){
  var d = new Date(iso);
  return d.toLocaleDateString("nl-BE", {day:"2-digit", month:"2-digit"}) + " " + d.toLocaleTimeString("nl-BE", {hour:"2-digit", minute:"2-digit"});
}
function fmtFull(iso){
  return new Date(iso).toLocaleString("nl-BE", {dateStyle:"medium", timeStyle:"short"});
}
function euro(n){ return "€ " + Number(n).toLocaleString("nl-BE"); }
function isSynced(r){
  return (r.syncedRev || 0) === r.rev && (r.photos || []).every(function(p){ return p.up; });
}
function pendingRecords(){ return records.filter(function(r){ return !isSynced(r); }).length; }
function pendingAll(){ return pendingRecords() + tombCount + (codesDirty ? 1 : 0); }
function notifyOthers(){ try{ if(channel) channel.postMessage("changed"); }catch(e){} }

var toastTimer = null;
function toast(msg){
  var t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.hidden = true; }, 2600);
}

async function load(){
  var raw = await Store.all();
  records = raw.filter(function(r){ return !r.tomb; });
  tombCount = raw.length - records.length;
  codesDirty = !!(await Store.getMeta("codesDirty"));
}

/* ---------- Weergave: lijst ---------- */
function renderNet(){
  var on = isOnline();
  $("#net").className = "net" + (on ? "" : " off");
  $("#netTxt").textContent = on ? "Online" : "Offline";
}
function renderStats(){
  var ok = records.filter(function(r){ return r.status === "OK"; }).length;
  $("#stTotal").textContent = records.length;
  $("#stOk").textContent = ok;
  $("#stNok").textContent = records.length - ok;
}
function renderSync(progress, total){
  var pending = pendingRecords();
  var box = $("#syncBox"), title = $("#syncTitle"), sub = $("#syncSub"), btn = $("#btnSync");
  box.className = "sync" + (pending ? " pending" : "");
  btn.textContent = cfg ? "Nu synchroniseren" : "Instellen";
  btn.disabled = syncing || (!!cfg && pendingAll() === 0);
  if(syncing){
    title.textContent = total ? "Synchroniseren " + progress + " van " + total : "Synchroniseren…";
    sub.textContent = "";
  }else if(!cfg){
    title.textContent = "Verbinding niet ingesteld";
    sub.textContent = "Stel de verbinding in via Beheer om te synchroniseren.";
  }else if(pending === 0){
    title.textContent = records.length ? "Alles gesynchroniseerd" : "Nog geen punten";
    sub.textContent = syncErr ? "Laatste fout: " + syncErr : "";
  }else{
    title.textContent = pending + (pending === 1 ? " punt wacht" : " punten wachten") + " op synchronisatie";
    sub.textContent = syncErr ? "Laatste fout: " + syncErr
      : (isOnline() ? "Ze worden zo verstuurd." : "Ze blijven veilig op deze gsm tot er verbinding is.");
  }
}
function renderList(){
  var rows = records.filter(function(r){
    if(filter === "ok") return r.status === "OK";
    if(filter === "nok") return r.status !== "OK";
    return true;
  }).sort(function(a, b){ return b.nr - a.nr; });

  if(!rows.length){
    $("#list").innerHTML = '<div class="empty">' + (records.length
      ? "Geen punten met deze status."
      : "Nog geen punten. Tik op ‘Nieuw punt’ om de rondgang te starten.") + "</div>";
    return;
  }
  $("#list").innerHTML = rows.map(function(r){
    var items = (r.items || []).map(function(it){
      return '<span class="items"><span class="code">' + esc(it.code) + '</span><span class="lbl">' + esc(it.label) + "</span></span>";
    }).join("");
    var meta = "<span>" + esc(fmt(r.created)) + "</span>";
    if(r.photos && r.photos.length) meta += "<span>" + r.photos.length + (r.photos.length === 1 ? " foto" : " foto’s") + "</span>";
    if(r.price != null) meta += "<span>" + esc(euro(r.price)) + "</span>";
    if(r.note) meta += "<span>Opmerking</span>";
    var done = isSynced(r);
    return '<button type="button" class="card" data-id="' + esc(r.id) + '">' +
      '<span class="nr">' + r.nr + "</span>" +
      '<span class="body">' + items + '<span class="meta">' + meta + "</span></span>" +
      '<span class="side"><span class="pill ' + (r.status === "OK" ? "ok" : "nok") + '">' + esc(r.status) + "</span>" +
      '<span class="state ' + (done ? "" : "todo") + '">' + (done ? "Verstuurd" : "Te versturen") + "</span></span>" +
      "</button>";
  }).join("");
}
function renderAll(){ renderNet(); renderStats(); renderSync(); renderList(); }

/* ---------- Schermen en terugknop (History API) ---------- */
function show(v){
  if(view === "List") listScroll = window.scrollY;
  view = v;
  ["List","Form","Codes"].forEach(function(n){
    $("#view" + n).hidden = (n !== v);
    $("#dock" + n).hidden = (n !== v);
  });
  window.scrollTo(0, v === "List" ? listScroll : 0);
}
function applyLayers(){
  var base = stack.indexOf("codes") >= 0 ? "Codes" : (stack.indexOf("form") >= 0 ? "Form" : "List");
  if(base !== view) show(base);
  $("#picker").hidden = stack.indexOf("picker") < 0;
  $("#lightbox").hidden = stack.indexOf("lightbox") < 0;
}
function pushLayer(name){
  stack.push(name);
  history.pushState({d: stack.length}, "");
  applyLayers();
}
function back(){ history.back(); }

function formDirty(){
  return !!draft && draftSnapshot() !== draftSnap;
}
function draftSnapshot(){
  return JSON.stringify([
    draft.items.map(function(i){ return i ? i.code : null; }),
    $("#note").value.trim(), draft.status, draft.price, draft.photos.length, $("#fNr").value.trim()
  ]);
}
function layerClosed(name){
  if(name === "form"){
    if(draft) draft.photos.forEach(function(p){ try{ URL.revokeObjectURL(p.url); }catch(e){} });
    draft = null; discardOk = false;
  }
}
window.addEventListener("popstate", function(e){
  var d = (e.state && e.state.d) || 0;
  while(stack.length > d){
    var top = stack[stack.length - 1];
    if(top === "form" && formDirty() && !discardOk){
      if(!window.confirm("Wijzigingen aan dit punt weggooien?")){
        history.pushState({d: stack.length}, "");
        return;
      }
    }
    stack.pop();
    layerClosed(top);
  }
  applyLayers();
});

/* ---------- Formulier ---------- */
function blankDraft(){
  return {
    id: uid(), isNew: true, nr: null, nrTouched: false, created: new Date().toISOString(),
    items: [null, null], photos: [], photoSeq: 0, note: "", status: "NIET OK", price: DEFAULT_PRICE
  };
}

/* ---------- Volgnummer ---------- */
/* het volgende nummer is altijd het hoogste bestaande nummer + 1 (zonder het punt dat je zelf bewerkt) */
function highestNr(excludeId){
  return records.reduce(function(m, r){ return r.id === excludeId ? m : Math.max(m, r.nr); }, 0);
}
function readNr(){
  var v = $("#fNr").value.trim();
  if(!/^\d+$/.test(v) || Number(v) < 1) return {ok: false, msg: "Vul een geheel nummer in (1 of hoger)."};
  var n = Number(v);
  if(records.some(function(r){ return r.nr === n && r.id !== draft.id; })) return {ok: false, msg: "Nummer " + n + " is al in gebruik."};
  return {ok: true, nr: n};
}
function renderNr(){
  var res = readNr(), inp = $("#fNr"), hint = $("#nrHint");
  inp.classList.toggle("invalid", !res.ok);
  inp.setAttribute("aria-invalid", res.ok ? "false" : "true");
  hint.classList.toggle("bad", !res.ok);
  if(res.ok){
    draft.nr = res.nr;
    hint.textContent = "Het volgende punt krijgt nummer " + (Math.max(highestNr(draft.id), res.nr) + 1) + ".";
  }else{
    hint.textContent = res.msg;
  }
  return res;
}
async function openForm(rec){
  if(stack.indexOf("form") >= 0) return;
  if(rec){
    draft = {
      id: rec.id, isNew: false, nr: rec.nr, created: rec.created,
      items: [rec.items[0] || null, rec.items[1] || null],
      photos: (rec.photos || []).map(function(p){ return {pid: p.pid, up: !!p.up, blob: p.blob, url: URL.createObjectURL(p.blob)}; }),
      photoSeq: rec.photoSeq || 0,
      note: rec.note || "", status: rec.status, price: rec.price
    };
  }else{
    draft = blankDraft();
    draft.nr = highestNr() + 1;
  }
  showItem2 = !!draft.items[1];
  $("#fNr").value = draft.nr;
  renderNr();
  $("#fTime").textContent = "Aangemaakt " + fmtFull(draft.created);
  $("#note").value = draft.note;
  $("#price").value = draft.price == null ? "" : draft.price;
  $("#btnDelete").hidden = draft.isNew;
  $("#btnDelete").textContent = "Punt verwijderen";
  renderItems(); renderThumbs(); renderStatus(); renderChips();
  draftSnap = draftSnapshot();
  pushLayer("form");
}
function leaveForm(){ discardOk = true; back(); }
function pickHtml(it){
  return it ? '<span class="code">' + esc(it.code) + "</span>" + esc(it.label) : '<span class="ph">Kies een item…</span>';
}
function renderItems(){
  $("#pick0").innerHTML = pickHtml(draft.items[0]);
  $("#pick1").innerHTML = pickHtml(draft.items[1]);
  $("#item2wrap").hidden = !showItem2;
  $("#addItem2").hidden = showItem2;
}
function renderThumbs(){
  $("#phCount").textContent = draft.photos.length ? "(" + draft.photos.length + ")" : "";
  $("#thumbs").innerHTML = draft.photos.map(function(p, i){
    return '<div class="th"><img src="' + p.url + '" alt="Foto ' + (i + 1) + '" data-i="' + i + '">' +
      '<button type="button" class="x" data-rm="' + i + '" aria-label="Foto ' + (i + 1) + ' verwijderen">×</button></div>';
  }).join("");
}
function renderStatus(){
  Array.prototype.forEach.call(document.querySelectorAll("#statusSeg button"), function(b){
    b.classList.toggle("on", b.getAttribute("data-s") === draft.status);
  });
}
function renderChips(){
  $("#chips").innerHTML = PRICES.map(function(v){
    return '<button type="button" class="chip' + (draft.price === v ? " on" : "") + '" data-v="' + v + '">€ ' + v + "</button>";
  }).join("");
}

/* foto's verkleinen: max. 1600 px, JPEG kwaliteit 0,72 */
async function shrink(file){
  var MAX = 1600, Q = 0.72, src, w, h, objUrl = null;
  try{
    src = await createImageBitmap(file, {imageOrientation: "from-image"});
    w = src.width; h = src.height;
  }catch(e){
    objUrl = URL.createObjectURL(file);
    var img = new Image();
    await new Promise(function(res, rej){ img.onload = res; img.onerror = rej; img.src = objUrl; });
    src = img; w = img.naturalWidth; h = img.naturalHeight;
  }
  var s = Math.min(1, MAX / Math.max(w, h));
  var c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
  c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
  if(objUrl) URL.revokeObjectURL(objUrl);
  if(src.close) src.close();
  var blob = await new Promise(function(res){ c.toBlob(function(b){ res(b); }, "image/jpeg", Q); });
  c.width = c.height = 0;
  if(!blob) throw new Error("Foto kon niet verkleind worden");
  return blob;
}
async function addFiles(fileList){
  var files = Array.prototype.slice.call(fileList || []);
  if(!files.length || !draft) return;
  toast("Foto’s verwerken…");
  for(var i = 0; i < files.length; i++){
    try{
      var blob = await shrink(files[i]);
      if(!draft) return;
      draft.photos.push({pid: ++draft.photoSeq, up: false, blob: blob, url: URL.createObjectURL(blob)});
    }catch(e){
      toast("Een foto kon niet verwerkt worden.");
    }
  }
  if(draft) renderThumbs();
}

/* item kiezen */
function openPicker(slot){
  pickSlot = slot;
  $("#pickQ").value = "";
  renderPick("");
  pushLayer("picker");
  setTimeout(function(){ $("#pickQ").focus(); }, 50);
}
function renderPick(q){
  q = q.trim().toLowerCase();
  var cur = draft && draft.items[pickSlot] ? draft.items[pickSlot].code : null;
  var rows = codes.filter(function(c){ return !q || (c.code + " " + c.label).toLowerCase().indexOf(q) !== -1; });
  $("#pickList").innerHTML = rows.length ? rows.map(function(c){
    return '<button type="button" class="opt' + (c.code === cur ? " on" : "") + '" data-code="' + esc(c.code) + '"><span class="code">' + esc(c.code) + "</span><span>" + esc(c.label) + "</span></button>";
  }).join("") : '<div class="empty tight">Geen item gevonden.</div>';
}

/* opslaan */
async function saveDraft(){
  if(!draft || saving) return;
  var nrRes = renderNr();
  if(!nrRes.ok){ toast(nrRes.msg); $("#fNr").focus(); return; }
  if(!draft.items[0]){ toast("Kies eerst een item."); return; }
  saving = true;
  try{
    draft.note = $("#note").value.trim();
    var now = new Date().toISOString();
    var d = draft;
    var photos = d.photos.map(function(p){ return {pid: p.pid, blob: p.blob, up: !!p.up}; });
    var items = d.items.filter(Boolean);
    var wasNew = d.isNew;
    var saved = await Store.commit(d.id, function(x){
      if(wasNew){
        return {
          id: d.id, nr: nrRes.nr, created: d.created, items: items, photos: photos, photoSeq: d.photoSeq,
          note: d.note, status: d.status, price: d.price, rev: 1, syncedRev: 0, updated: now
        };
      }
      if(!x) return null;
      var upMap = {};
      (x.photos || []).forEach(function(p){ if(p.up) upMap[p.pid] = true; });
      x.nr = nrRes.nr;
      x.items = items;
      x.photos = photos.map(function(p){ return {pid: p.pid, blob: p.blob, up: !!(p.up || upMap[p.pid])}; });
      x.photoSeq = Math.max(x.photoSeq || 0, d.photoSeq);
      x.note = d.note; x.status = d.status; x.price = d.price;
      x.rev = (x.rev || 0) + 1;
      x.updated = now;
      return x;
    }, wasNew && !d.nrTouched);
    if(!saved){ toast("Dit punt bestaat niet meer."); saving = false; return; }
    var nr = saved.nr;
    await load();
    leaveForm();
    renderAll();
    notifyOthers();
    toast(wasNew ? "Punt " + nr + " opgeslagen op deze gsm." : "Punt " + nr + " bijgewerkt.");
    requestPersist();
    trySync(false);
  }catch(e){
    if(e && e.dup){
      /* een ander venster nam dit nummer net in gebruik */
      await load();
      renderNr();
      toast("Nummer " + e.dup + " is al in gebruik.");
    }else{
      toast("Opslaan mislukt. Probeer opnieuw.");
    }
  }
  saving = false;
}

/* ---------- Synchronisatie met Google Apps Script ---------- */
function SyncError(kind, message){
  this.kind = kind; /* net | auth | server */
  this.message = message;
}
SyncError.prototype = Object.create(Error.prototype);

var DELAYS = [5, 15, 45, 120, 300];
var attempts = 0, retryTimer = null;
function resetRetry(){ attempts = 0; clearTimeout(retryTimer); retryTimer = null; }
function scheduleRetry(){
  clearTimeout(retryTimer);
  var d = DELAYS[Math.min(attempts, DELAYS.length - 1)] * 1000;
  attempts++;
  retryTimer = setTimeout(function(){ trySync(false); }, d);
}

async function post(payload, override){
  var c = override || cfg;
  var ctl = new AbortController();
  var timer = setTimeout(function(){ ctl.abort(); }, 90000);
  var res;
  try{
    res = await fetch(c.url, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(Object.assign({key: c.key}, payload)),
      redirect: "follow", credentials: "omit", cache: "no-store", signal: ctl.signal
    });
  }catch(e){
    throw new SyncError("net", "Geen verbinding met de server.");
  }finally{
    clearTimeout(timer);
  }
  var data;
  try{ data = await res.json(); }
  catch(e){ throw new SyncError("server", "Onverwacht antwoord. Controleer het webadres en of de toegang op ‘iedereen’ staat."); }
  if(!data || !data.ok){
    throw new SyncError(data && data.code === "auth" ? "auth" : "server", (data && data.error) || "Onbekende fout van de server.");
  }
  return data;
}
function blobToBase64(blob){
  return new Promise(function(resolve, reject){
    var fr = new FileReader();
    fr.onload = function(){ resolve(String(fr.result).split(",")[1] || ""); };
    fr.onerror = function(){ reject(new SyncError("server", "Foto kon niet gelezen worden.")); };
    fr.readAsDataURL(blob);
  });
}
function itemText(it){ return it ? it.code + " | " + it.label : ""; }

/* één stap voor één punt: eerst de tekst, daarna de foto's één voor één */
async function syncStep(r){
  if((r.syncedRev || 0) !== r.rev){
    var rev = r.rev, nrSent = r.nr;
    await post({action: "upsert", record: {
      id: r.id, nr: r.nr, prevNr: r.syncedNr || 0, created: r.created,
      item1: itemText(r.items[0]), item2: itemText(r.items[1]),
      note: r.note || "", status: r.status, price: r.price == null ? "" : r.price,
      photos: (r.photos || []).map(function(p){ return p.pid; }), seq: r.photoSeq || 0
    }});
    await Store.update(r.id, function(x){ if((x.syncedRev || 0) < rev){ x.syncedRev = rev; x.syncedNr = nrSent; } });
    return;
  }
  var p = (r.photos || []).filter(function(q){ return !q.up; })[0];
  if(p){
    var data = await blobToBase64(p.blob);
    await post({action: "photo", id: r.id, nr: r.nr, n: p.pid, data: data});
    await Store.update(r.id, function(x){ (x.photos || []).forEach(function(q){ if(q.pid === p.pid) q.up = true; }); });
  }
}

async function syncPass(){
  var out = {done: 0, total: 0, kind: "", msg: "", failures: []};
  var raw = await Store.all();
  var tombs = raw.filter(function(r){ return r.tomb; });
  var recs = raw.filter(function(r){ return !r.tomb && !isSynced(r); }).sort(function(a, b){ return a.nr - b.nr; });
  out.total = recs.length;
  renderSync(0, out.total);

  /* serverfouten slaan dit onderdeel over en gaan door; netwerk- en sleutelfouten stoppen de ronde */
  async function unit(fn){
    try{ await fn(); return true; }
    catch(e){
      if(e instanceof SyncError && e.kind === "server"){ out.failures.push(e.message); return false; }
      throw e;
    }
  }
  try{
    if(codesDirty){
      await unit(async function(){
        await post({action: "codes", codes: codes});
        await Store.setMeta("codesDirty", false);
        codesDirty = false;
      });
    }
    for(var i = 0; i < tombs.length; i++){
      await unit(async function(){
        await post({action: "delete", id: tombs[i].id});
        await Store.del(tombs[i].id);
      });
    }
    for(var j = 0; j < recs.length; j++){
      var id = recs[j].id;
      var ok = await unit(async function(){
        for(var guard = 0; guard < 400; guard++){
          var r = await Store.get(id);
          if(!r || r.tomb || isSynced(r)) break;
          await syncStep(r);
        }
        var fresh = await Store.get(id);
        if(fresh && !fresh.tomb){
          for(var k = 0; k < records.length; k++){ if(records[k].id === id){ records[k] = fresh; break; } }
        }
      });
      if(ok){ out.done++; renderSync(out.done, out.total); renderList(); renderStats(); }
    }
  }catch(e){
    out.kind = e instanceof SyncError ? e.kind : "server";
    out.msg = e instanceof SyncError ? e.message : "Onverwachte fout bij het synchroniseren.";
  }
  if(!out.msg && out.failures.length){ out.kind = "server"; out.msg = out.failures[0]; }
  return out;
}

function withLock(fn){
  if(navigator.locks && navigator.locks.request){
    return navigator.locks.request("inspect-sync", {ifAvailable: true}, function(lock){ return lock ? fn() : {skipped: true}; });
  }
  return fn();
}

async function trySync(manual){
  if(syncing) return;
  if(!cfg){
    if(manual){ toast("Stel eerst de verbinding in."); openCodes(); }
    return;
  }
  if(pendingAll() === 0){ if(manual) toast("Alles is al gesynchroniseerd."); return; }
  if(!isOnline()){ if(manual) toast("Geen verbinding. De punten blijven veilig op deze gsm."); return; }
  if(manual) resetRetry();
  clearTimeout(retryTimer);
  syncing = true; syncErr = "";
  renderSync(0, 0);
  var out;
  try{ out = await withLock(syncPass); }
  catch(e){ out = {kind: "server", msg: "Onverwachte fout bij het synchroniseren.", done: 0, total: 0}; }
  syncing = false;
  if(out && out.skipped){ await load(); renderAll(); return; }
  await load();
  syncErr = out.msg || "";
  renderAll();
  notifyOthers();
  if(!out.msg){
    resetRetry();
    if(out.done) toast(out.done + (out.done === 1 ? " punt" : " punten") + " verstuurd.");
  }else if(out.kind === "auth"){
    toast("Sleutel geweigerd. Controleer de verbinding in Beheer.");
  }else{
    if(out.done) toast("Niet alles is verstuurd. De rest blijft op de gsm.");
    scheduleRetry();
  }
}

/* ---------- Beheer ---------- */
function openCodes(){
  if(stack.indexOf("codes") >= 0) return;
  $("#codesTa").value = codesToText(codes);
  $("#codesCount").textContent = codes.length + " items";
  $("#btnWipe").textContent = "Alle punten wissen";
  $("#cfgUrl").value = cfg ? cfg.url : "";
  $("#cfgKey").value = "";
  $("#cfgKeyHint").textContent = cfg ? "Een sleutel is opgeslagen. Laat leeg om die te houden." : "";
  setCfgState("", "");
  $("#firstRun").hidden = !!cfg;
  renderStorage();
  pushLayer("codes");
}
function setCfgState(text, cls){
  var el = $("#cfgState");
  el.textContent = text;
  el.className = "cfgstate" + (cls ? " " + cls : "");
}
function readCfgInputs(){
  var url = $("#cfgUrl").value.trim();
  var key = $("#cfgKey").value.trim() || (cfg ? cfg.key : "");
  if(!/^https:\/\/script\.google\.com\/.+\/exec$/.test(url)){
    setCfgState("Het webadres moet beginnen met https://script.google.com/ en eindigen op /exec.", "bad");
    return null;
  }
  if(!key){ setCfgState("Vul de geheime sleutel in.", "bad"); return null; }
  return {url: url, key: key};
}
async function testCfg(){
  var c = readCfgInputs();
  if(!c) return;
  if(!isOnline()){ setCfgState("Geen verbinding. Probeer het opnieuw met internet.", "bad"); return; }
  var btn = $("#btnCfgTest");
  btn.disabled = true; setCfgState("Verbinding testen…", "");
  try{
    await post({action: "ping"}, c);
    setCfgState("Verbinding werkt.", "ok");
  }catch(e){
    setCfgState(e.message || "Verbinding mislukt.", "bad");
  }
  btn.disabled = false;
}
async function saveCfg(){
  var c = readCfgInputs();
  if(!c) return;
  cfg = c;
  await Store.setMeta("config", c);
  await Store.setMeta("codesDirty", true);
  codesDirty = true;
  resetRetry();
  $("#cfgKey").value = "";
  $("#cfgKeyHint").textContent = "Een sleutel is opgeslagen. Laat leeg om die te houden.";
  $("#firstRun").hidden = true;
  setCfgState("Verbinding opgeslagen.", "ok");
  renderSync();
  toast("Verbinding opgeslagen.");
  trySync(false);
}

/* tweetraps-bevestiging voor wissen */
function armButton(btn, label, action){
  if(btn.getAttribute("data-armed")){
    btn.removeAttribute("data-armed");
    action();
    return;
  }
  var original = btn.textContent;
  btn.setAttribute("data-armed", "1");
  btn.textContent = label;
  setTimeout(function(){
    if(btn.getAttribute("data-armed")){ btn.removeAttribute("data-armed"); btn.textContent = original; }
  }, 4000);
}

/* ---------- Opslagpersistentie en update ---------- */
function requestPersist(){
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist().then(renderStorage, function(){}); }catch(e){}
}
async function renderStorage(){
  var el = $("#aboutInfo");
  try{
    var est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
    var persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null;
    var txt = "InspectSolutions versie " + VERSION + (document.documentElement.classList.contains("env-dev") ? " (testomgeving DEV)" : "") + ".";
    if(est && est.usage != null) txt += " Opslag in gebruik: " + (est.usage / 1048576).toFixed(1).replace(".", ",") + " MB.";
    if(persisted != null) txt += persisted ? " Opslag is beveiligd tegen opruimen." : " Opslag is nog niet beveiligd tegen opruimen.";
    el.textContent = txt;
  }catch(e){}
}
var updating = false;
function showUpdate(worker){
  var bar = $("#updateBar");
  bar.hidden = false;
  $("#btnUpdate").onclick = function(){ updating = true; worker.postMessage({type: "SKIP_WAITING"}); };
}
function initServiceWorker(){
  if(!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("controllerchange", function(){ if(updating) location.reload(); });
  navigator.serviceWorker.register("sw.js").then(function(reg){
    if(reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener("updatefound", function(){
      var w = reg.installing;
      if(!w) return;
      w.addEventListener("statechange", function(){
        if(w.state === "installed" && navigator.serviceWorker.controller) showUpdate(w);
      });
    });
    var check = function(){ try{ reg.update(); }catch(e){} };
    document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "visible") check(); });
    window.addEventListener("online", check);
  }).catch(function(){});
}

/* ---------- Events ---------- */
function bind(){
  $("#btnNew").addEventListener("click", function(){ openForm(null); });
  $("#btnCodes").addEventListener("click", openCodes);
  $("#btnSync").addEventListener("click", function(){ trySync(true); });
  $("#btnCancel").addEventListener("click", back);
  $("#btnSave").addEventListener("click", saveDraft);

  $("#list").addEventListener("click", function(e){
    var card = e.target.closest(".card");
    if(!card) return;
    var rec = records.filter(function(r){ return r.id === card.getAttribute("data-id"); })[0];
    if(rec) openForm(rec);
  });

  $("#filter").addEventListener("click", function(e){
    var b = e.target.closest("button");
    if(!b) return;
    filter = b.getAttribute("data-f");
    Array.prototype.forEach.call(document.querySelectorAll("#filter button"), function(x){ x.classList.toggle("on", x === b); });
    renderList();
  });

  $("#simOff").addEventListener("change", function(e){
    forceOff = e.target.checked;
    renderNet(); renderSync();
    if(!forceOff){ toast("Verbinding hersteld."); resetRetry(); trySync(false); }
  });
  window.addEventListener("online", function(){ renderNet(); renderSync(); resetRetry(); trySync(false); });
  window.addEventListener("offline", function(){ renderNet(); renderSync(); });
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible"){ renderNet(); trySync(false); }
  });

  /* items */
  $("#pick0").addEventListener("click", function(){ openPicker(0); });
  $("#pick1").addEventListener("click", function(){ openPicker(1); });
  $("#addItem2").addEventListener("click", function(){ showItem2 = true; renderItems(); openPicker(1); });
  $("#rm1").addEventListener("click", function(){ draft.items[1] = null; showItem2 = false; renderItems(); });
  $("#pickClose").addEventListener("click", back);
  $("#pickQ").addEventListener("input", function(e){ renderPick(e.target.value); });
  $("#pickClear").addEventListener("click", function(){
    draft.items[pickSlot] = null;
    if(pickSlot === 1) showItem2 = false;
    renderItems(); back();
  });
  $("#pickList").addEventListener("click", function(e){
    var b = e.target.closest(".opt");
    if(!b) return;
    var code = b.getAttribute("data-code");
    var c = codes.filter(function(x){ return x.code === code; })[0];
    if(c){ draft.items[pickSlot] = {code: c.code, label: c.label}; }
    renderItems(); back();
  });

  /* foto's */
  $("#btnCam").addEventListener("click", function(){ $("#fileCam").click(); });
  $("#btnGal").addEventListener("click", function(){ $("#fileGal").click(); });
  $("#fileCam").addEventListener("change", function(e){ addFiles(e.target.files); e.target.value = ""; });
  $("#fileGal").addEventListener("change", function(e){ addFiles(e.target.files); e.target.value = ""; });
  $("#thumbs").addEventListener("click", function(e){
    var rm = e.target.closest("[data-rm]");
    if(rm){
      var i = Number(rm.getAttribute("data-rm"));
      try{ URL.revokeObjectURL(draft.photos[i].url); }catch(err){}
      draft.photos.splice(i, 1);
      renderThumbs();
      return;
    }
    var img = e.target.closest("img[data-i]");
    if(img){ $("#lbImg").src = img.src; pushLayer("lightbox"); }
  });
  $("#lightbox").addEventListener("click", back);

  /* status en prijs */
  $("#statusSeg").addEventListener("click", function(e){
    var b = e.target.closest("button");
    if(!b) return;
    draft.status = b.getAttribute("data-s");
    renderStatus();
  });
  $("#chips").addEventListener("click", function(e){
    var b = e.target.closest(".chip");
    if(!b) return;
    var v = Number(b.getAttribute("data-v"));
    draft.price = (draft.price === v) ? null : v;
    $("#price").value = draft.price == null ? "" : draft.price;
    renderChips();
  });
  $("#price").addEventListener("input", function(e){
    var v = e.target.value;
    draft.price = (v === "" || isNaN(Number(v))) ? null : Math.max(0, Number(v));
    renderChips();
  });

  $("#btnDelete").addEventListener("click", function(){
    armButton($("#btnDelete"), "Tik nogmaals om te verwijderen", async function(){
      var id = draft.id;
      /* grafsteen: zo wordt de rij ook uit de Sheet verwijderd bij de volgende synchronisatie */
      await Store.put({id: id, tomb: true, at: new Date().toISOString()});
      await load();
      leaveForm(); renderAll(); notifyOthers(); toast("Punt verwijderd.");
      trySync(false);
    });
  });

  /* beheer */
  $("#btnCodesBack").addEventListener("click", back);
  $("#codesTa").addEventListener("input", function(e){
    $("#codesCount").textContent = parseCodes(e.target.value).length + " items";
  });
  $("#btnCodesSave").addEventListener("click", async function(){
    var parsed = parseCodes($("#codesTa").value);
    if(!parsed.length){ toast("De lijst mag niet leeg zijn."); return; }
    codes = parsed;
    await Store.setMeta("codes_v2", codes);
    await Store.setMeta("codesDirty", true);
    codesDirty = true;
    toast("Codelijst opgeslagen (" + codes.length + " items).");
    back();
    renderSync();
    trySync(false);
  });
  $("#btnReset").addEventListener("click", function(){
    var list = parseCodes(DEFAULT_TEXT);
    $("#codesTa").value = codesToText(list);
    $("#codesCount").textContent = list.length + " items";
    toast("Standaardlijst ingevuld. Tik op ‘Codelijst opslaan’ om te bewaren.");
  });
  $("#btnWipe").addEventListener("click", function(){
    var open = pendingRecords();
    var label = open
      ? "Let op: " + open + (open === 1 ? " punt is" : " punten zijn") + " nog niet verstuurd. Tik nogmaals om alles te wissen"
      : "Tik nogmaals om alles te wissen";
    armButton($("#btnWipe"), label, async function(){
      await Store.clear();
      await load();
      renderAll(); back(); notifyOthers(); toast("Alle punten gewist. Nummering start opnieuw bij 1.");
    });
  });
  $("#fNr").addEventListener("input", function(){ if(draft){ draft.nrTouched = true; renderNr(); } });
  $("#btnCfgTest").addEventListener("click", testCfg);
  $("#btnCfgSave").addEventListener("click", saveCfg);
}

/* ---------- Start ---------- */
async function init(){
  bind();
  try{ history.replaceState({d: 0}, ""); }catch(e){}
  var ok = await Store.open();
  $("#memwarn").hidden = ok;
  var saved = await Store.getMeta("codes_v2");
  codes = (Array.isArray(saved) && saved.length) ? saved : parseCodes(DEFAULT_TEXT);
  cfg = (await Store.getMeta("config")) || null;
  await load();
  renderAll();
  requestPersist();
  initServiceWorker();
  try{
    channel = new BroadcastChannel("inspectsolutions");
    channel.onmessage = function(){ load().then(function(){ renderAll(); }); };
  }catch(e){}
  if(!cfg) openCodes();
  trySync(false);
}
init();
})();
