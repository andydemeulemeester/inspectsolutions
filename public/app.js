(function(){
"use strict";

var VERSION = "1.4.1"; /* houd gelijk met VERSION in sw.js */
var CODES_VERSION = 2;   /* verhoog als de standaardcodelijst verandert (zie scripts/update-codes.js) */

var $ = function(s){ return document.querySelector(s); };
var esc = function(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };

/* Groepen = type doorvoering: de letter vóór het streepje in de code (B-1 hoort bij B). Bijgehouden door scripts/update-codes.js */
var GROUPS = [{"letter":"B","name":"Buis"},{"letter":"K","name":"Kabel"},{"letter":"G","name":"Kabelgoot"},{"letter":"L","name":"Luchtkanaal"},{"letter":"A","name":"Andere"}];
/* Hashes van eerdere standaardlijsten, zodat een ongewijzigde oude lijst vervangen wordt (door scripts/update-codes.js bijgehouden) */
var KNOWN_DEFAULT_HASHES = [838722764];

/* ---------- Standaard codelijst (80 items van de klant, ongewijzigd) ---------- */
var DEFAULT_TEXT = [
  "B-1 | opening vergroten kabels/ buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "B-2 | productoplossing voor kabels en buis",
  "B-3 | buizen en kabels vlgs TV254/293",
  "B-4 | diversen kabels buizen lin voeg - productopl",
  "B-5 | mortel verwijderen, opening vergroten rond kabelbundel /buis en productoplossing uitvoeren",
  "B-6 | 1 buis opening vergroten en typeoplossing TV254/293 uitvoeren",
  "B-7 | opening vergroten, kabels/buizen uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "B-8 | opening vergroten en uitvoeren met typeoplossing TV 254/293 en rond de buis omkasting maken met flexibele productoplossing",
  "B-9 | plafond herstellen + kabels TV + buizen productoplossing",
  "B-10 | buizen en kabels doorheen nieuw bovenpaneel productoplossing",
  "B-11 | productoplossing voor kabels en buis - kabelgoot",
  "B-12 | Schuim verwijderen , opening vergroten rond buis en productoplossing uitvoeren",
  "B-13 | typeoplossing TV254/293 uitvoeren en nadien mantelbuis opstoppen met rotswol",
  "B-14 | typeoplossing TV254/293 uitvoeren en ook mantelbuis opstoppen met rotswol",
  "K-15 | kabels uit elkaar en uitvoeren typeoplossing TV254/293",
  "K-16 | kabels uit elkaar en uitvoeren typeoplossing TV254/293+ productoplossingen",
  "K-17 | opening vergroten rond kabelbundel and productoplossing uitvoeren",
  "K-18 | kabels uit elkaar zetten nadien typeoplossing TV254/293 uitvoeren",
  "K-19 | mortel verwijderen , opening vergroten rond kabelbundel en productoplossing uitvoeren",
  "K-20 | Schuim verwijderen, kabels uit elkaar en uitvoeren typeoplossing TV254/293",
  "G-21 | Opening vergroten rond goot en productoplossing uitvoeren",
  "A-22 | opening vergroten en typeoplossing TV254/293 uitvoeren",
  "A-23 | Achterliggende wand EI30 te plaatsen",
  "A-24 | afdichting via panelen te maken productopl.",
  "A-25 | algemeen zicht",
  "A-26 | bovenconstructie type opl TV 254/293 + nieuw plafond",
  "A-27 | brandwerend glas ok",
  "A-28 | brandwerend rooster",
  "A-29 | Brandwerende schuifdeur EI30-schilderafwerking",
  "A-30 | detail",
  "A-31 | Deur conform = ok",
  "A-32 | dichten opening met panelen",
  "A-33 | Evt Schuim wegnemen + opstop volgens productoplossing",
  "A-34 | Evt Schuim wegnemen + opstop volgens productoplossing + uitlijning controleren",
  "A-35 | herstel achter wand via luik",
  "A-36 | Herstellen vasthoudmagneet",
  "A-37 | isolatie openknippen en achterliggend op the muur typeoplossing uitvoeren TV254/293",
  "A-38 | lin voeg",
  "A-39 | lin voeg en paneel",
  "A-40 | Lineaire voeg uit te voeren",
  "A-41 | Lineaire voeg uit te voeren-oude weg productoplossing",
  "A-42 | luik openen en afdichten productopl panelen",
  "A-43 | meting",
  "A-44 | Nazicht gesteldheid muur - lijkt ok te zijn",
  "A-45 | Nieuw brandwerend luik",
  "A-46 | nieuw brandwerend raam",
  "A-47 | nieuwe deur te plaatsen - EI30 schilderafwerking",
  "A-48 | Nieuwe afscherming E60 rolluik/gordijn douches en inkom",
  "A-49 | nieuwe deur te plaatsen - EI30 schilderafwerking",
  "A-50 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet",
  "A-51 | nieuwe deur te plaatsen - EI30 schilderafwerking + magneet + doorvoeren bovenpaneel",
  "A-52 | nieuwe deur te plaatsen - EI30 schilderafwerking + tussendeurdorpel",
  "A-53 | nieuwe doorgeefluik te plaatsen - EI30 schilderafwerking + brandwerende onderbouw",
  "A-54 | nieuwe wand EI 30",
  "A-55 | nieuwe wand EI30 achter bestaand raam",
  "A-56 | nieuwe wand EI30 achter bestaand raam - 3 stuks",
  "A-57 | nieuwe wand EI30 achter bestaand raam - achter bekleding",
  "A-58 | nieuwe zwaai deur te plaatsen - EI30 schilderafwerking + magneet",
  "A-59 | nieuwe zwaaideur te plaatsen EI30 schilderafwerking",
  "A-60 | Opening vergroten en typeoplossing TV254/293",
  "A-61 | opening vergroten en typeoplossing TV254/293 uitvoeren",
  "A-62 | Opening vergroten en typeoplossing TV254/293 uitvoeren",
  "A-63 | opmetsen wand +afdichten vlgs TV + lin voeg",
  "A-64 | opstop volgens productoplossing",
  "A-65 | paneel bovenaan brandwerend maken",
  "A-66 | plafond 2 lagen gips erop",
  "A-67 | plafond herstellen",
  "A-68 | productoplossing lin voeg",
  "A-69 | productoplossing panelen",
  "A-70 | rooster te plaatsen",
  "A-71 | Schuim verwijderen, opening vergroten rond item en productoplossing uitvoeren",
  "A-72 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 type C uitvoeren",
  "A-73 | Schuim verwijderen, opening vergroten en typeoplossing TV254/293 uitvoeren",
  "A-74 | Schuim verwijderen, opening vergroten enproductoplossing",
  "A-75 | Schuim wegnemen opstop volgens productoplossing uitlijning is Niet ok+nieuwe klep",
  "A-76 | typeoplossing TV254/293 uitvoeren",
  "A-77 | typeoplossing TV254/293 uitvoeren",
  "A-78 | typeoplossing TV254/293 uitvoeren blind gat te dichten",
  "A-79 | typeoplossing TV254/293 uitvoeren gatte dichten",
  "A-80 | Wand EI30 te plaatsen"
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
function hashText(t){
  var h = 5381;
  for(var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
  return h >>> 0;
}
/* Versie van de lijst: "2" voor de standaardlijst, "2 (aangepast)" als ze in Beheer gewijzigd is */
function codesVersionLabel(){
  var isDefault = codesToText(codes) === codesToText(parseCodes(DEFAULT_TEXT));
  return String(CODES_VERSION) + (isDefault ? "" : " (aangepast)");
}
/* Tekst onder de codelijst in Beheer, met een hint als er een nieuwere standaardlijst is dan waarop de eigen lijst gebaseerd is */
var codesBase = CODES_VERSION;
function codesVersionNote(){
  var s = "Versie van de lijst: " + codesVersionLabel();
  if(codesVersionLabel().indexOf("aangepast") >= 0 && codesBase < CODES_VERSION){
    s += ". Er is een nieuwere standaardlijst (versie " + CODES_VERSION + "). Tik op ‘Standaardlijst herstellen’ om ze te gebruiken.";
  }
  return s;
}
/* Groep van een code: de letters vóór het streepje of het eerste cijfer ("B-1" geeft "B"); anders "Overig" */
function groupOf(code){
  var m = /^([A-Za-z]+)[-\s]?\d/.exec(code);
  return m ? m[1].toUpperCase() : "Overig";
}
function groupTitle(letter){
  for(var i = 0; i < GROUPS.length; i++){
    if(GROUPS[i].letter === letter) return letter + " · " + GROUPS[i].name;
  }
  return letter === "Overig" ? "Overig" : "Groep " + letter;
}
function groupRank(letter){
  for(var i = 0; i < GROUPS.length; i++){ if(GROUPS[i].letter === letter) return i; }
  return GROUPS.length;
}
function codesToText(list){
  return list.map(function(c){ return c.code + " | " + c.label; }).join("\n");
}

/* ---------- Foto's: vorm van een foto in een record ----------
   { pid, blob, orig, ops, ver, up, upOrig }
   blob  = de versie die getoond en verstuurd wordt (bewerkt, of het origineel als er niets getekend is)
   orig  = het onbewerkte origineel, enkel ingevuld als de foto bewerkt is (anders null, om opslag te sparen)
   ops   = de tekenacties (JSON), ver = teller die bij elke bewerking omhooggaat
   up / upOrig = is blob / orig al bevestigd door de server.
   Oudere records (lijst van Blobs, of {pid, blob, up} zonder de rest) worden bij het lezen omgezet. */
function normPhoto(p, i){
  if(typeof Blob !== "undefined" && p instanceof Blob) return {pid: i + 1, blob: p, orig: null, ops: [], ver: 0, up: false, upOrig: false};
  if(!Array.isArray(p.ops)) p.ops = [];
  if(p.orig === undefined) p.orig = null;
  p.ver = p.ver || 0; p.up = !!p.up; p.upOrig = !!p.upOrig;
  return p;
}
function normRecord(r){
  if(!r || r.tomb) return r;
  r.photos = (r.photos || []).map(normPhoto);
  r.photoSeq = Math.max(r.photoSeq || 0, r.photos.reduce(function(m, p){ return Math.max(m, p.pid); }, 0));
  return r;
}
function isEdited(p){ return !!(p.ops && p.ops.length); }

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
      if(useMem) return Promise.resolve(Object.keys(mem.records).map(function(k){ return normRecord(mem.records[k]); }));
      return tx("records", "readonly", function(t){ var r = t.objectStore("records").getAll(); return function(){ return r.result.map(normRecord); }; });
    },
    get: function(id){
      if(useMem) return Promise.resolve(normRecord(mem.records[id]));
      return tx("records", "readonly", function(t){ var r = t.objectStore("records").get(id); return function(){ return normRecord(r.result); }; });
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
        var m = normRecord(mem.records[id]);
        if(!m) return Promise.resolve(undefined);
        mem.records[id] = fn(m) || m;
        return Promise.resolve(mem.records[id]);
      }
      return tx("records", "readwrite", function(t){
        var s = t.objectStore("records"), out;
        s.get(id).onsuccess = function(e){
          var rec = e.target.result;
          if(!rec || rec.tomb) return;
          rec = normRecord(rec);
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
        all = all.map(normRecord);
        var existing = all.filter(function(r){ return r.id === id && !r.tomb; })[0];
        var rec = build(existing);
        if(!rec) return null;
        /* het nummer moet uniek zijn binnen het project */
        var others = all.filter(function(r){ return !r.tomb && r.id !== rec.id && r.project === rec.project; });
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
var edIndex = -1, editorDiscard = false;
var PRICES = [50,100,200,300,400,500,600,700,800,900,1000];
var DEFAULT_PRICE = 50;
var channel = null;
var projects = [], activeProjectId = null;

/* ---------- Projecten ----------
   { id, number, name, created, archived, rev, syncedRev, sheetUrl, folderUrl }
   Elk project heeft een eigen Google Sheet en fotomap (het Apps Script maakt ze aan) en een eigen nummering. */
function projectById(id){ return projects.filter(function(p){ return p.id === id; })[0] || null; }
function activeProject(){ return projectById(activeProjectId); }
function activeRecords(){ return records.filter(function(r){ return r.project === activeProjectId; }); }
function projectRecords(id){ return records.filter(function(r){ return r.project === id; }); }
function projSnap(p){ return {id: p.id, number: p.number, name: p.name, created: p.created}; }
function pendingProjects(){ return projects.filter(function(p){ return (p.syncedRev || 0) !== p.rev; }).length; }
function slugName(s){
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}
function ymd(iso){
  var d = new Date(iso), z = function(n){ return String(n).padStart(2, "0"); };
  return d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate());
}
/* naam van de Sheet: {projectnummer}_{naam in kleine letters aaneen}_{jjjjmmdd}; hetzelfde als in het Apps Script */
function sheetNameFor(number, name, created){
  return String(number).trim() + "_" + (slugName(name) || "project") + "_" + ymd(created);
}
function saveProjects(){ return Store.setMeta("projects", projects); }

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
  return (r.syncedRev || 0) === r.rev && (r.photos || []).every(function(p){ return p.up && (!isEdited(p) || p.upOrig); });
}
function pendingRecords(){ return records.filter(function(r){ return !isSynced(r); }).length; }
function pendingAll(){ return pendingRecords() + tombCount + pendingProjects() + (codesDirty ? 1 : 0); }
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
  projects = (await Store.getMeta("projects")) || [];
  activeProjectId = await Store.getMeta("activeProject") || null;
  var cur = projectById(activeProjectId);
  if(!cur || cur.archived){
    var first = projects.filter(function(p){ return !p.archived; })[0];
    activeProjectId = first ? first.id : null;
  }
}

/* Punten uit een oudere versie (zonder project) komen in een project "Algemeen" te staan en worden opnieuw
   gesynchroniseerd, omdat Sheet en bestandsnamen nu per project zijn. */
async function migrateProjects(){
  var legacy = records.filter(function(r){ return !r.project; });
  if(!legacy.length) return;
  var oldest = legacy.reduce(function(m, r){ return r.created < m ? r.created : m; }, legacy[0].created);
  var def = projects.filter(function(p){ return p.number === "0" && p.name === "Algemeen"; })[0];
  if(!def){
    def = {id: uid(), number: "0", name: "Algemeen", created: oldest, archived: false, rev: 1, syncedRev: 0};
    projects.push(def);
    await saveProjects();
  }
  if(!activeProjectId) await Store.setMeta("activeProject", def.id);
  for(var i = 0; i < legacy.length; i++){
    await Store.update(legacy[i].id, function(x){
      x.project = def.id; x.rev = (x.rev || 0) + 1; x.syncedNr = 0;
      (x.photos || []).forEach(function(p){ p.up = false; p.upOrig = false; });
    });
  }
  await load();
}

/* ---------- Weergave: lijst ---------- */
function renderNet(){
  var on = isOnline();
  $("#net").className = "net" + (on ? "" : " off");
  $("#netTxt").textContent = on ? "Online" : "Offline";
}
function renderStats(){
  var mine = activeRecords();
  var ok = mine.filter(function(r){ return r.status === "OK"; }).length;
  $("#stTotal").textContent = mine.length;
  $("#stOk").textContent = ok;
  $("#stNok").textContent = mine.length - ok;
}
function renderProjectBar(){
  var p = activeProject();
  $("#projNum").textContent = p ? p.number : "–";
  $("#projName").textContent = p ? p.name : "Geen project. Tik om er een te maken.";
}
function renderSync(progress, total){
  var pending = pendingRecords();
  var waiting = pendingProjects() + tombCount + (codesDirty ? 1 : 0);   /* projecten, verwijderingen en codelijst die nog moeten */
  var box = $("#syncBox"), title = $("#syncTitle"), sub = $("#syncSub"), btn = $("#btnSync");
  box.className = "sync" + (pending || waiting ? " pending" : "");
  btn.textContent = cfg ? "Nu synchroniseren" : "Instellen";
  btn.disabled = syncing || (!!cfg && pendingAll() === 0 && !scriptProblem);
  if(syncing){
    title.textContent = total ? "Synchroniseren " + progress + " van " + total : "Synchroniseren…";
    sub.textContent = "";
  }else if(!cfg){
    title.textContent = "Verbinding niet ingesteld";
    sub.textContent = "Stel de verbinding in via Beheer om te synchroniseren.";
  }else if(scriptProblem){
    title.textContent = "Apps Script is verouderd";
    sub.textContent = scriptProblem + (pending || waiting ? " Er is niets verstuurd; alles blijft veilig op deze gsm." : "");
  }else if(pending === 0 && waiting > 0){
    title.textContent = pendingProjects() ? "Project wacht op synchronisatie" : "Wacht op synchronisatie";
    sub.textContent = syncErr ? "Laatste fout: " + syncErr
      : (isOnline() ? "Het wordt zo verstuurd." : "Het blijft veilig op deze gsm tot er verbinding is.");
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
  var mine = activeRecords();
  var rows = mine.filter(function(r){
    if(filter === "ok") return r.status === "OK";
    if(filter === "nok") return r.status !== "OK";
    return true;
  }).sort(function(a, b){ return b.nr - a.nr; });

  if(!rows.length){
    $("#list").innerHTML = '<div class="empty">' + (!activeProject()
      ? "Maak eerst een project aan. Tik bovenaan op ‘Project’."
      : mine.length
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
function renderAll(){ renderNet(); renderProjectBar(); renderStats(); renderSync(); renderList(); }

/* ---------- Schermen en terugknop (History API) ---------- */
function show(v){
  if(view === "List") listScroll = window.scrollY;
  view = v;
  ["List","Form","Codes","Projects"].forEach(function(n){
    $("#view" + n).hidden = (n !== v);
    $("#dock" + n).hidden = (n !== v);
  });
  window.scrollTo(0, v === "List" ? listScroll : 0);
}
function applyLayers(){
  var base = stack.indexOf("codes") >= 0 ? "Codes"
    : stack.indexOf("projects") >= 0 ? "Projects"
    : (stack.indexOf("form") >= 0 ? "Form" : "List");
  if(base !== view) show(base);
  $("#picker").hidden = stack.indexOf("picker") < 0;
  $("#projForm").hidden = stack.indexOf("projectForm") < 0;
  $("#editor").hidden = stack.indexOf("editor") < 0;
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
    $("#note").value.trim(), draft.status, draft.price, draft.photos.length, $("#fNr").value.trim(),
    draft.photos.map(function(p){ return p.ver || 0; }).join()
  ]);
}
function layerClosed(name){
  if(name === "form"){
    if(draft) draft.photos.forEach(function(p){ try{ URL.revokeObjectURL(p.url); }catch(e){} });
    draft = null; discardOk = false;
  }else if(name === "editor"){
    window.PhotoEditor.close();       /* geeft afbeelding, canvassen en object-URL's vrij */
    $("#edConfirm").hidden = true;
    editorDiscard = false; edIndex = -1;
  }
}
window.addEventListener("popstate", function(e){
  var d = (e.state && e.state.d) || 0;
  while(stack.length > d){
    var top = stack[stack.length - 1];
    if(top === "editor" && !editorDiscard && window.PhotoEditor.isDirty()){
      /* niet-bewaarde tekening: eerst een bevestiging in de app zelf (geen window.confirm) */
      history.pushState({d: stack.length}, "");
      $("#edConfirm").hidden = false;
      return;
    }
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
    id: uid(), isNew: true, nr: null, nrTouched: false, project: activeProjectId, created: new Date().toISOString(),
    items: [null, null], photos: [], photoSeq: 0, note: "", status: "NIET OK", price: DEFAULT_PRICE
  };
}

/* ---------- Volgnummer ---------- */
/* het volgende nummer is altijd het hoogste bestaande nummer + 1 (zonder het punt dat je zelf bewerkt) */
/* de nummering is per project */
function highestNr(excludeId, projectId){
  return projectRecords(projectId).reduce(function(m, r){ return r.id === excludeId ? m : Math.max(m, r.nr); }, 0);
}
function readNr(){
  var v = $("#fNr").value.trim();
  if(!/^\d+$/.test(v) || Number(v) < 1) return {ok: false, msg: "Vul een geheel nummer in (1 of hoger)."};
  var n = Number(v);
  if(projectRecords(draft.project).some(function(r){ return r.nr === n && r.id !== draft.id; })) return {ok: false, msg: "Nummer " + n + " is al in gebruik."};
  return {ok: true, nr: n};
}
function renderNr(){
  var res = readNr(), inp = $("#fNr"), hint = $("#nrHint");
  inp.classList.toggle("invalid", !res.ok);
  inp.setAttribute("aria-invalid", res.ok ? "false" : "true");
  hint.classList.toggle("bad", !res.ok);
  if(res.ok){
    draft.nr = res.nr;
    hint.textContent = "Het volgende punt krijgt nummer " + (Math.max(highestNr(draft.id, draft.project), res.nr) + 1) + ".";
  }else{
    hint.textContent = res.msg;
  }
  return res;
}
async function openForm(rec){
  if(stack.indexOf("form") >= 0) return;
  if(rec){
    draft = {
      id: rec.id, isNew: false, nr: rec.nr, project: rec.project, created: rec.created,
      items: [rec.items[0] || null, rec.items[1] || null],
      photos: (rec.photos || []).map(function(p){
        return {pid: p.pid, up: p.up, upOrig: p.upOrig, blob: p.blob, orig: p.orig, ops: p.ops, ver: p.ver, dirty: false, url: URL.createObjectURL(p.blob)};
      }),
      photoSeq: rec.photoSeq || 0,
      note: rec.note || "", status: rec.status, price: rec.price
    };
  }else{
    draft = blankDraft();
    draft.nr = highestNr(null, draft.project) + 1;
  }
  showItem2 = !!draft.items[1];
  var pj = projectById(draft.project);
  $("#fProject").textContent = pj ? "Project " + pj.number + " · " + pj.name : "";
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
    var pen = isEdited(p)
      ? '<span class="pen" role="img" aria-label="Bewerkt"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1-5L16 4l4 4L9 19z"/></svg></span>'
      : "";
    return '<div class="th"><img src="' + p.url + '" alt="Foto ' + (i + 1) + (isEdited(p) ? " (bewerkt)" : "") + ' bewerken" data-i="' + i + '">' + pen +
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

/* ---------- Foto bewerken (tekenen) ---------- */
/* Een tik op een miniatuur opent de editor met het origineel en de bestaande tekenacties. */
async function openEditor(i){
  if(!draft || stack.indexOf("editor") >= 0) return;
  var p = draft.photos[i];
  if(!p) return;
  edIndex = i; editorDiscard = false;
  pushLayer("editor");
  try{
    await window.PhotoEditor.open({blob: p.orig || p.blob, ops: p.ops || []});
  }catch(e){
    toast("Foto kon niet geopend worden.");
    editorDiscard = true; back();
  }
}
async function editorDone(){
  var res;
  try{ res = await window.PhotoEditor.finish(); }
  catch(e){ toast("De foto kon niet bewaard worden."); return; }
  var p = draft && draft.photos[edIndex];
  if(res.changed && p){
    var wasEdited = isEdited(p);
    if(res.ops.length){
      if(!p.orig) p.orig = p.blob;           /* het onbewerkte origineel blijft altijd bewaard */
      p.blob = res.blob; p.ops = res.ops;
      p.upOrig = wasEdited && p.upOrig;      /* het origineel zelf verandert niet; was het al verstuurd, dan blijft dat zo */
    }else{
      if(p.orig){ p.blob = p.orig; p.orig = null; }   /* alles gewist: terug naar het origineel */
      p.ops = []; p.upOrig = false;
    }
    try{ URL.revokeObjectURL(p.url); }catch(e){}
    p.url = URL.createObjectURL(p.blob);
    p.up = false; p.ver = (p.ver || 0) + 1; p.dirty = true;   /* opnieuw te versturen */
    renderThumbs();
  }
  editorDiscard = true; back();
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
      draft.photos.push({pid: ++draft.photoSeq, up: false, upOrig: false, blob: blob, orig: null, ops: [], ver: 0, dirty: true, url: URL.createObjectURL(blob)});
    }catch(e){
      toast("Een foto kon niet verwerkt worden.");
    }
  }
  if(draft) renderThumbs();
}

/* item kiezen */
/* welke groepen openstaan: onthouden zolang de app open is. Eerste keer: enkel de groep van het gekozen item, anders de eerste groep. */
var pickOpen = null;
function openPicker(slot){
  pickSlot = slot;
  $("#pickQ").value = "";
  var cur = draft && draft.items[slot] ? draft.items[slot].code : null;
  if(!pickOpen){
    pickOpen = {};
    var first = codes.length ? groupOf(codes[0].code) : null;
    pickOpen[cur ? groupOf(cur) : first] = true;
  }else if(cur){
    pickOpen[groupOf(cur)] = true;      /* het gekozen item moet zichtbaar zijn */
  }
  renderPick("");
  pushLayer("picker");
  var on = $("#pickList .opt.on");
  if(on) on.scrollIntoView({block: "center"});
  else setTimeout(function(){ $("#pickQ").focus(); }, 50);
}
function renderPick(q){
  q = q.trim().toLowerCase();
  var cur = draft && draft.items[pickSlot] ? draft.items[pickSlot].code : null;
  var rows = codes.filter(function(c){ return !q || (c.code + " " + c.label).toLowerCase().indexOf(q) !== -1; });
  if(!rows.length){ $("#pickList").innerHTML = '<div class="empty tight">Geen item gevonden.</div>'; return; }
  /* per groep (type doorvoering) onder een kop; binnen een groep blijft de volgorde van de lijst */
  var byGroup = {}, order = [];
  rows.forEach(function(c){
    var g = groupOf(c.code);
    if(!byGroup[g]){ byGroup[g] = []; order.push(g); }
    byGroup[g].push(c);
  });
  order.sort(function(a, b){ return groupRank(a) - groupRank(b); });   /* stabiel: onbekende groepen blijven in lijstvolgorde */
  /* bij zoeken staan alle groepen met resultaat open; anders bepaalt de gebruiker met de kop wat open of dicht is */
  var searching = q !== "";
  $("#pickList").innerHTML = order.map(function(g){
    var open = searching || !!(pickOpen && pickOpen[g]);
    return '<button type="button" class="grp" data-g="' + esc(g) + '" aria-expanded="' + (open ? "true" : "false") + '" aria-controls="grp-' + esc(g) + '"' + (searching ? " disabled" : "") + ">" +
      '<span class="chev" aria-hidden="true"></span><span class="grpt">' + esc(groupTitle(g)) + '</span><span class="grpn">' + byGroup[g].length + "</span></button>" +
      '<div class="grpbody" id="grp-' + esc(g) + '"' + (open ? "" : " hidden") + ">" +
      byGroup[g].map(function(c){
        return '<button type="button" class="opt' + (c.code === cur ? " on" : "") + '" data-code="' + esc(c.code) + '"><span class="code">' + esc(c.code) + "</span><span>" + esc(c.label) + "</span></button>";
      }).join("") + "</div>";
  }).join("");
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
    var items = d.items.filter(Boolean);
    /* Een foto die in dit formulier nieuw of bewerkt is, moet opnieuw verstuurd worden. Een ongewijzigde foto neemt de
       synchronisatiestatus over die de synchronisatie intussen in de opslag zette (zolang het dezelfde versie is). */
    var buildPhotos = function(latest){
      var byPid = {};
      (latest || []).forEach(function(q){ byPid[q.pid] = q; });
      return d.photos.map(function(p){
        var l = byPid[p.pid], same = !!l && (l.ver || 0) === (p.ver || 0);
        return {
          pid: p.pid, blob: p.blob, orig: p.orig || null, ops: p.ops || [], ver: p.ver || 0,
          up: p.dirty ? false : !!(p.up || (same && l.up)),
          upOrig: p.dirty ? !!p.upOrig : !!(p.upOrig || (same && l.upOrig))
        };
      });
    };
    var wasNew = d.isNew;
    var saved = await Store.commit(d.id, function(x){
      if(wasNew){
        return {
          id: d.id, nr: nrRes.nr, project: d.project, created: d.created, items: items, photos: buildPhotos(null), photoSeq: d.photoSeq,
          note: d.note, status: d.status, price: d.price, rev: 1, syncedRev: 0, updated: now
        };
      }
      if(!x) return null;
      x.nr = nrRes.nr;
      x.items = items;
      x.photos = buildPhotos(x.photos);
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

/* Controle van het Apps Script: de app stuurt pas iets als het script een recent genoeg protocol (API) heeft.
   Verhoog REQUIRED_SCRIPT_API samen met API in apps-script/Code.gs als de app nieuwe acties of gegevens stuurt. */
var REQUIRED_SCRIPT_API = 1;
var scriptCheckedAt = 0, scriptProblem = "";
function scriptProblemFor(res){
  var api = Number(res && res.api) || 0;
  if(api >= REQUIRED_SCRIPT_API) return "";
  return "Het Apps Script is verouderd" + (res && res.version ? " (versie " + res.version + ")" : "") +
    ". Plak de nieuwste Code.gs in Apps Script en implementeer een nieuwe versie.";
}
async function checkScript(){
  /* hoogstens eens per 5 minuten opnieuw controleren, tenzij er een probleem is */
  if(!scriptProblem && scriptCheckedAt && Date.now() - scriptCheckedAt < 300000) return;
  var res = await post({action: "ping"});
  scriptProblem = scriptProblemFor(res);
  scriptCheckedAt = scriptProblem ? 0 : Date.now();
  if(scriptProblem) throw new SyncError("script", scriptProblem);
}

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
    var msg = (data && data.error) || "Onbekende fout van de server.";
    /* een verouderd script kent de nieuwe acties niet */
    if(/^Onbekende actie/.test(msg)) msg = "Het Apps Script is verouderd (" + msg + "). Plak de nieuwste Code.gs en implementeer een nieuwe versie.";
    throw new SyncError(data && data.code === "auth" ? "auth" : "server", msg);
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
  var pj = projectById(r.project);
  if(!pj) throw new SyncError("server", "Het project van punt " + r.nr + " bestaat niet meer.");
  var project = projSnap(pj);
  if((r.syncedRev || 0) !== r.rev){
    var rev = r.rev, nrSent = r.nr;
    await post({action: "upsert", project: project, record: {
      id: r.id, nr: r.nr, prevNr: r.syncedNr || 0, created: r.created,
      item1: itemText(r.items[0]), item2: itemText(r.items[1]),
      note: r.note || "", status: r.status, price: r.price == null ? "" : r.price,
      photos: (r.photos || []).map(function(p){ return p.pid; }),
      edited: (r.photos || []).filter(isEdited).map(function(p){ return p.pid; }),
      seq: r.photoSeq || 0
    }});
    await Store.update(r.id, function(x){ if((x.syncedRev || 0) < rev){ x.syncedRev = rev; x.syncedNr = nrSent; } });
    return;
  }
  /* één foto per request: eerst de te tonen versie (bewerkt of enige), daarna het origineel van bewerkte foto's.
     De vlag wordt enkel gezet als de foto intussen niet opnieuw bewerkt is (zelfde ver). */
  var photos = r.photos || [];
  var p = photos.filter(function(q){ return !q.up; })[0], sendOrig = false;
  if(!p){ p = photos.filter(function(q){ return isEdited(q) && !q.upOrig; })[0]; sendOrig = true; }
  if(p){
    var ver = p.ver || 0, blob = sendOrig ? p.orig : p.blob;
    var data = await blobToBase64(blob);
    await post({action: "photo", project: project, id: r.id, nr: r.nr, created: r.created, n: p.pid, orig: sendOrig, seq: r.photoSeq || 0, data: data});
    await Store.update(r.id, function(x){
      (x.photos || []).forEach(function(q){
        if(q.pid === p.pid && (q.ver || 0) === ver){ if(sendOrig) q.upOrig = true; else q.up = true; }
      });
    });
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
    await checkScript();          /* een verouderd script: niets versturen, zodat er niets op de verkeerde plaats terechtkomt */
    if(codesDirty){
      await unit(async function(){
        await post({action: "codes", codes: codes, version: codesVersionLabel()});
        await Store.setMeta("codesDirty", false);
        codesDirty = false;
      });
    }
    /* eerst de projecten: het script maakt daar de Sheet en de fotomap voor aan (of past de naam aan) */
    var pend = projects.filter(function(p){ return (p.syncedRev || 0) !== p.rev; });
    for(var q = 0; q < pend.length; q++){
      await unit(async function(){
        var sent = pend[q].rev, pid = pend[q].id;
        var res = await post({action: "project", project: projSnap(pend[q])});
        var list = (await Store.getMeta("projects")) || [];
        list.forEach(function(x){
          if(x.id !== pid) return;
          if((x.syncedRev || 0) < sent) x.syncedRev = sent;
          x.sheetUrl = res.sheetUrl || x.sheetUrl; x.folderUrl = res.folderUrl || x.folderUrl;
        });
        await Store.setMeta("projects", list);
        projects = list;
      });
    }
    for(var i = 0; i < tombs.length; i++){
      await unit(async function(){
        if(tombs[i].project) await post({action: "delete", project: tombs[i].project, id: tombs[i].id});
        await Store.del(tombs[i].id);
      });
    }
    for(var j = 0; j < recs.length; j++){
      var id = recs[j].id, projId = recs[j].project;
      var ok = await unit(async function(){
        /* punten gaan pas naar het script als hun project daar bestaat; anders zouden ze op de verkeerde plaats terechtkomen */
        var pj = projectById(projId);
        if(!pj || (pj.syncedRev || 0) !== pj.rev) throw new SyncError("server", "Project " + (pj ? pj.number : "?") + " is nog niet gesynchroniseerd. De punten wachten.");
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
  if(pendingAll() === 0 && !scriptProblem){ if(manual) toast("Alles is al gesynchroniseerd."); return; }
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
  }else if(out.kind === "script"){
    toast("Het Apps Script is verouderd. Er is niets verstuurd.");
    scheduleRetry();
  }else{
    if(out.done) toast("Niet alles is verstuurd. De rest blijft op de gsm.");
    scheduleRetry();
  }
}

/* ---------- Projecten beheren ---------- */
var pfEditId = null;

function openProjects(){
  if(stack.indexOf("projects") >= 0) return;
  renderProjects();
  pushLayer("projects");
}
function renderProjects(){
  var showArchived = $("#projArchived").checked;
  var list = projects.filter(function(p){ return showArchived || !p.archived; })
    .sort(function(a, b){ return b.created < a.created ? -1 : 1; });
  $("#projList").innerHTML = list.length ? list.map(function(p){
    var n = projectRecords(p.id).length, active = p.id === activeProjectId;
    var sub = n + (n === 1 ? " punt" : " punten") + (active ? " · Actief" : "") + (p.archived ? " · Gearchiveerd" : "") + (p.sheetUrl ? "" : " · Nog niet gesynchroniseerd");
    return '<div class="pcard' + (active ? " active" : "") + (p.archived ? " archived" : "") + '">' +
      '<button type="button" class="pmain" data-pick="' + esc(p.id) + '"' + (p.archived ? " disabled" : "") + '>' +
      '<span class="pnum">' + esc(p.number) + '</span><span class="pbody"><span class="pname">' + esc(p.name) + '</span><span class="psub">' + esc(sub) + "</span></span></button>" +
      '<button type="button" class="btn small pedit" data-edit="' + esc(p.id) + '" aria-label="Project ' + esc(p.number) + ' bewerken">Bewerken</button></div>';
  }).join("") : '<div class="empty">Nog geen projecten. Tik op ‘Nieuw project’.</div>';
}
async function chooseProject(id){
  activeProjectId = id;
  await Store.setMeta("activeProject", id);
  filter = "all";
  Array.prototype.forEach.call(document.querySelectorAll("#filter button"), function(x){ x.classList.toggle("on", x.getAttribute("data-f") === "all"); });
  renderAll();
  back();
}
function openProjectForm(id){
  if(stack.indexOf("projectForm") >= 0) return;
  pfEditId = id;
  var p = id ? projectById(id) : null;
  var locked = !!p && (p.syncedRev || 0) > 0;
  $("#pfTitle").textContent = p ? "Project bewerken" : "Nieuw project";
  $("#pfNumber").value = p ? p.number : "";
  $("#pfName").value = p ? p.name : "";
  $("#pfNumber").disabled = locked;
  $("#pfNumberHint").textContent = locked
    ? "Het projectnummer kan na de eerste synchronisatie niet meer gewijzigd worden."
    : "Letters, cijfers of streepjes, maximaal 12 tekens.";
  $("#pfArchive").hidden = !p;
  $("#pfArchive").textContent = p && p.archived ? "Project herstellen" : "Project archiveren";
  $("#pfLinks").hidden = !(p && p.sheetUrl);
  if(p && p.sheetUrl){ $("#pfSheetLink").href = p.sheetUrl; $("#pfFolderLink").href = p.folderUrl || p.sheetUrl; }
  $("#pfErr").textContent = "";
  updateProjectPreview();
  pushLayer("projectForm");
  if(!p) setTimeout(function(){ $("#pfNumber").focus(); }, 60);
}
function updateProjectPreview(){
  var num = $("#pfNumber").value.trim(), name = $("#pfName").value.trim();
  var p = pfEditId ? projectById(pfEditId) : null;
  $("#pfSheet").textContent = (num || name) ? sheetNameFor(num || "…", name, p ? p.created : new Date().toISOString()) : "";
}
async function saveProject(){
  var num = $("#pfNumber").value.trim(), name = $("#pfName").value.trim();
  var p = pfEditId ? projectById(pfEditId) : null, err = "";
  if(!/^[A-Za-z0-9-]{1,12}$/.test(num)) err = "Projectnummer: 1 tot 12 letters, cijfers of streepjes.";
  else if(!name || !slugName(name)) err = "Vul een projectnaam in.";
  else if(name.length > 60) err = "De projectnaam is te lang (maximaal 60 tekens).";
  else if(projects.some(function(x){ return x.number.toLowerCase() === num.toLowerCase() && (!p || x.id !== p.id); })) err = "Projectnummer " + num + " is al in gebruik.";
  if(err){ $("#pfErr").textContent = err; return; }
  if(p){
    if(p.number !== num || p.name !== name){ p.number = num; p.name = name; p.rev = (p.rev || 0) + 1; }
    await saveProjects();
    renderProjects(); renderAll();
    toast("Project bijgewerkt.");
    back();
  }else{
    p = {id: uid(), number: num, name: name, created: new Date().toISOString(), archived: false, rev: 1, syncedRev: 0};
    projects.push(p);
    await saveProjects();
    activeProjectId = p.id;
    await Store.setMeta("activeProject", p.id);
    renderAll();
    toast("Project " + num + " aangemaakt.");
    history.go(-2);                 /* sluit het formulier en het projectenscherm */
  }
  notifyOthers();
  trySync(false);
}
async function toggleArchive(){
  var p = pfEditId ? projectById(pfEditId) : null;
  if(!p) return;
  p.archived = !p.archived;
  await saveProjects();
  if(p.archived && p.id === activeProjectId){
    var next = projects.filter(function(x){ return !x.archived; })[0];
    activeProjectId = next ? next.id : null;
    await Store.setMeta("activeProject", activeProjectId);
  }
  renderProjects(); renderAll();
  toast(p.archived ? "Project gearchiveerd." : "Project hersteld.");
  back();
}
function bindProjects(){
  $("#projBar").addEventListener("click", openProjects);
  $("#btnProjBack").addEventListener("click", back);
  $("#btnProjNew").addEventListener("click", function(){ openProjectForm(null); });
  $("#projArchived").addEventListener("change", renderProjects);
  $("#projList").addEventListener("click", function(e){
    var pick = e.target.closest("[data-pick]");
    if(pick){ chooseProject(pick.getAttribute("data-pick")); return; }
    var ed = e.target.closest("[data-edit]");
    if(ed) openProjectForm(ed.getAttribute("data-edit"));
  });
  $("#pfClose").addEventListener("click", back);
  $("#pfCancel").addEventListener("click", back);
  $("#pfSave").addEventListener("click", saveProject);
  $("#pfArchive").addEventListener("click", toggleArchive);
  $("#pfNumber").addEventListener("input", updateProjectPreview);
  $("#pfName").addEventListener("input", updateProjectPreview);
}

/* ---------- Beheer ---------- */
function openCodes(){
  if(stack.indexOf("codes") >= 0) return;
  $("#codesTa").value = codesToText(codes);
  $("#codesCount").textContent = codes.length + " items";
  $("#codesVersion").textContent = codesVersionNote();
  $("#btnWipe").textContent = "Alle punten wissen";
  $("#btnResend").textContent = "Alles opnieuw versturen";
  $("#cfgUrl").value = cfg ? cfg.url : (window.INSPECT_SCRIPT_URL || "");
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
    var res = await post({action: "ping"}, c);
    var problem = scriptProblemFor(res);
    if(problem) setCfgState("Verbinding werkt, maar: " + problem, "bad");
    else setCfgState("Verbinding werkt.", "ok");
  }catch(e){
    setCfgState(e.message || "Verbinding mislukt.", "bad");
  }
  btn.disabled = false;
}
async function saveCfg(){
  var c = readCfgInputs();
  if(!c) return;
  cfg = c;
  scriptCheckedAt = 0; scriptProblem = "";
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
  $("#btnNew").addEventListener("click", function(){
    if(!activeProject()){ toast("Maak eerst een project aan."); openProjects(); openProjectForm(null); return; }
    openForm(null);
  });
  bindProjects();
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
    var head = e.target.closest(".grp");
    if(head){
      /* groep open- of dichtklappen, zonder de lijst opnieuw op te bouwen (de scrollpositie blijft) */
      var g = head.getAttribute("data-g"), open = head.getAttribute("aria-expanded") !== "true";
      pickOpen = pickOpen || {};
      pickOpen[g] = open;
      head.setAttribute("aria-expanded", open ? "true" : "false");
      $("#grp-" + g).hidden = !open;
      return;
    }
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
    if(img) openEditor(Number(img.getAttribute("data-i")));
  });
  $("#edCancel").addEventListener("click", function(){
    if(window.PhotoEditor.isDirty()) $("#edConfirm").hidden = false; else back();
  });
  $("#edKeep").addEventListener("click", function(){ $("#edConfirm").hidden = true; });
  $("#edDiscard").addEventListener("click", function(){ editorDiscard = true; back(); });
  $("#edDone").addEventListener("click", editorDone);

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
      var pj = projectById(draft.project);
      await Store.put({id: id, tomb: true, at: new Date().toISOString(), project: pj ? projSnap(pj) : null});
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
    codesBase = CODES_VERSION;
    await Store.setMeta("codes_base", CODES_VERSION);
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
    $("#codesVersion").textContent = "Versie van de lijst: " + CODES_VERSION + " (standaard)";
    toast("Standaardlijst ingevuld. Tik op ‘Codelijst opslaan’ om te bewaren.");
  });
  $("#btnResend").addEventListener("click", function(){
    armButton($("#btnResend"), "Tik nogmaals om alles opnieuw te versturen", async function(){
      /* alle punten, foto's en projecten gelden weer als nog niet verstuurd; het script werkt bestaande rijen bij en vervangt foto's */
      var all = await Store.all();
      for(var i = 0; i < all.length; i++){
        if(all[i].tomb) continue;
        await Store.update(all[i].id, function(x){
          x.rev = (x.rev || 0) + 1; x.syncedNr = 0;
          (x.photos || []).forEach(function(p){ p.up = false; p.upOrig = false; });
        });
      }
      projects.forEach(function(p){ p.rev = (p.rev || 0) + 1; });
      await saveProjects();
      codesDirty = true; await Store.setMeta("codesDirty", true);
      await load(); renderAll(); notifyOthers();
      $("#btnResend").textContent = "Alles opnieuw versturen";
      toast("Alles staat klaar om opnieuw verstuurd te worden.");
      resetRetry(); trySync(true);
    });
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
  /* Een zelf opgeslagen lijst (Beheer) blijft altijd staan. Anders geldt de standaardlijst uit deze versie, en bij een
     nieuwe standaardlijst wordt ze opnieuw naar het tabblad Codes in de Sheet gestuurd. */
  var hasSaved = Array.isArray(saved) && saved.length > 0;
  if(hasSaved && KNOWN_DEFAULT_HASHES.indexOf(hashText(codesToText(saved))) >= 0){
    /* een ongewijzigde oudere standaardlijst: vervangen door de nieuwe */
    hasSaved = false;
    await Store.setMeta("codes_v2", null);
    await Store.setMeta("codesDirty", true);
  }
  codes = hasSaved ? saved : parseCodes(DEFAULT_TEXT);
  codesBase = (await Store.getMeta("codes_base")) || 1;
  if((await Store.getMeta("codes_default_ver")) !== CODES_VERSION){
    await Store.setMeta("codes_default_ver", CODES_VERSION);
    if(!hasSaved) await Store.setMeta("codesDirty", true);
  }
  cfg = (await Store.getMeta("config")) || null;
  await load();
  await migrateProjects();
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
