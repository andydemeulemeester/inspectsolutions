/* Fotoeditor: tekenen op een foto met een gewoon canvas, zonder externe libraries.
   - Alle tekenacties staan genormaliseerd (0 tot 1) ten opzichte van de foto, dus los van schermgrootte en resolutie.
     Lijndikte en tekstgrootte zijn een fractie van de fotobreedte, zodat het op elke resolutie gelijk uitziet.
   - Twee canvassen boven elkaar: "base" (foto + afgewerkte acties) en "live" (de lopende streek).
     Tijdens het tekenen wordt enkel een nieuw lijnstukje op "live" getekend; "base" wordt pas volledig
     hertekend bij ongedaan maken, opnieuw uitvoeren, wissen of een wijziging van het formaat.
   - De app (app.js) beheert het scherm, de terugknop en Klaar/Annuleren. Dit bestand beheert het tekenen. */
(function(){
"use strict";

var COLORS = {red: "#e53935", yellow: "#ffd600", white: "#ffffff", black: "#000000"};
var WIDTHS = {thin: 0.005, mid: 0.01, thick: 0.02};          /* fractie van de fotobreedte */
var TEXT_SIZES = {thin: 0.035, mid: 0.05, thick: 0.075};     /* idem, voor het tekstgereedschap */
var JPEG_QUALITY = 0.72;                                     /* gelijk aan de foto's in app.js */

var tool = "pen", colorName = "red", widthName = "mid";
var el = null;                                               /* DOM-elementen, bij de eerste open() opgezocht */
var bitmap = null, W = 0, H = 0, bctx = null, lctx = null, ro = null, ready = false, fallbackUrl = null;
var states = [[]], idx = 0, initialJson = "[]";             /* ongedaan maken: elke stand is een lijst van acties */
var cur = null, activeId = null, lastMid = null, rafId = 0, textPos = null;

function $(id){ return document.getElementById(id); }
function clamp(v, a, b){ return Math.min(b, Math.max(a, v)); }
function mid(a, b){ return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }

/* ---------- Tekenen van één actie (voor scherm en voor de uiteindelijke JPEG) ---------- */
function drawOp(ctx, op, cw, ch){
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = op.c; ctx.fillStyle = op.c;
  ctx.lineWidth = Math.max(1, op.w * cw);
  if(op.t === "pen"){
    var p = op.p;
    if(p.length === 1){
      ctx.beginPath(); ctx.arc(p[0][0] * cw, p[0][1] * ch, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill();
    }else{
      ctx.beginPath(); ctx.moveTo(p[0][0] * cw, p[0][1] * ch);
      for(var i = 1; i < p.length; i++){
        var m = mid(p[i - 1], p[i]);
        ctx.quadraticCurveTo(p[i - 1][0] * cw, p[i - 1][1] * ch, m[0] * cw, m[1] * ch);
      }
      ctx.lineTo(p[p.length - 1][0] * cw, p[p.length - 1][1] * ch);
      ctx.stroke();
    }
  }else if(op.t === "arrow"){
    var ax = op.a[0] * cw, ay = op.a[1] * ch, bx = op.b[0] * cw, by = op.b[1] * ch;
    var dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy) || 1, ang = Math.atan2(dy, dx);
    var head = Math.min(Math.max(ctx.lineWidth * 4, cw * 0.035), len * 0.8);
    ctx.beginPath(); ctx.moveTo(ax, ay);
    ctx.lineTo(bx - Math.cos(ang) * head * 0.7, by - Math.sin(ang) * head * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by);
    ctx.lineTo(bx - Math.cos(ang - 0.45) * head, by - Math.sin(ang - 0.45) * head);
    ctx.lineTo(bx - Math.cos(ang + 0.45) * head, by - Math.sin(ang + 0.45) * head);
    ctx.closePath(); ctx.fill();
  }else if(op.t === "oval"){
    var x1 = op.a[0] * cw, y1 = op.a[1] * ch, x2 = op.b[0] * cw, y2 = op.b[1] * ch;
    ctx.beginPath();
    ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.max(1, Math.abs(x2 - x1) / 2), Math.max(1, Math.abs(y2 - y1) / 2), 0, 0, Math.PI * 2);
    ctx.stroke();
  }else if(op.t === "text"){
    var size = op.s * cw;
    ctx.font = "700 " + size + "px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    /* lichte rand voor donkere tekst, donkere rand voor lichte tekst, zodat het op elke foto leesbaar blijft */
    ctx.strokeStyle = (op.c === COLORS.white || op.c === COLORS.yellow) ? "#000000" : "#ffffff";
    ctx.lineWidth = Math.max(2, size * 0.22);
    ctx.strokeText(op.text, op.x * cw, op.y * ch);
    ctx.fillText(op.text, op.x * cw, op.y * ch);
  }
  ctx.restore();
}

/* ---------- Opbouw en formaat ---------- */
function init(){
  if(el) return;
  el = {
    stage: $("edStage"), wrap: $("edWrap"), base: $("edBase"), live: $("edLive"),
    undo: $("edUndo"), redo: $("edRedo"), clear: $("edClear"),
    text: $("edText"), textInput: $("edTextInput")
  };
  bctx = el.base.getContext("2d"); lctx = el.live.getContext("2d");

  /* gereedschap, kleur en dikte */
  var pick = function(attr, set){
    Array.prototype.forEach.call(document.querySelectorAll("#editor [" + attr + "]"), function(b){
      b.addEventListener("click", function(){ set(b.getAttribute(attr)); syncButtons(); });
    });
  };
  pick("data-tool", function(v){ tool = v; });
  pick("data-color", function(v){ colorName = v; });
  pick("data-width", function(v){ widthName = v; });
  el.undo.addEventListener("click", function(){ if(idx > 0){ idx--; redrawBase(); syncButtons(); } });
  el.redo.addEventListener("click", function(){ if(idx < states.length - 1){ idx++; redrawBase(); syncButtons(); } });
  el.clear.addEventListener("click", function(){ if(states[idx].length) pushState([]); });

  /* tekenen met Pointer Events */
  el.live.addEventListener("pointerdown", onDown);
  el.live.addEventListener("pointermove", onMove);
  el.live.addEventListener("pointerup", onUp);
  el.live.addEventListener("pointercancel", onCancel);

  /* tekstvenster */
  $("edTextOk").addEventListener("click", addText);
  $("edTextCancel").addEventListener("click", hideText);
  el.textInput.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addText(); } });
  syncButtons();
}

function syncButtons(){
  var mark = function(attr, value){
    Array.prototype.forEach.call(document.querySelectorAll("#editor [" + attr + "]"), function(b){
      var on = b.getAttribute(attr) === value;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };
  mark("data-tool", tool); mark("data-color", colorName); mark("data-width", widthName);
  el.undo.disabled = idx === 0;
  el.redo.disabled = idx >= states.length - 1;
  el.clear.disabled = states[idx].length === 0;
}

function layout(){
  if(!bitmap || !el) return;
  var r = el.stage.getBoundingClientRect();
  if(r.width < 10 || r.height < 10) return;
  var s = Math.min(r.width / W, r.height / H);
  var cssW = Math.max(1, Math.floor(W * s)), cssH = Math.max(1, Math.floor(H * s));
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  var pw = Math.round(cssW * dpr), ph = Math.round(cssH * dpr);
  el.wrap.style.width = cssW + "px"; el.wrap.style.height = cssH + "px";
  if(el.base.width !== pw || el.base.height !== ph){ el.base.width = el.live.width = pw; el.base.height = el.live.height = ph; }
  redrawBase();
}

function redrawBase(){
  if(!bitmap) return;
  var cw = el.base.width, ch = el.base.height;
  bctx.clearRect(0, 0, cw, ch);
  bctx.drawImage(bitmap, 0, 0, cw, ch);
  states[idx].forEach(function(op){ drawOp(bctx, op, cw, ch); });
  lctx.clearRect(0, 0, el.live.width, el.live.height);
}

function pushState(ops){
  states = states.slice(0, idx + 1);
  states.push(ops); idx++;
  redrawBase(); syncButtons();
}
function commit(op){
  /* de nieuwe actie komt er enkel bij op "base"; geen volledige hertekening */
  states = states.slice(0, idx + 1);
  states.push(states[idx].concat([op])); idx++;
  drawOp(bctx, op, el.base.width, el.base.height);
  lctx.clearRect(0, 0, el.live.width, el.live.height);
  syncButtons();
}

/* ---------- Pointer Events ---------- */
function pt(e){
  var r = el.live.getBoundingClientRect();
  return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)];
}
function styleLive(op){
  lctx.lineCap = "round"; lctx.lineJoin = "round";
  lctx.strokeStyle = op.c; lctx.fillStyle = op.c; lctx.lineWidth = Math.max(1, op.w * el.live.width);
}
function onDown(e){
  if(!ready || cur || (e.pointerType === "mouse" && e.button !== 0)) return;
  if(!el.text.hidden) return;
  e.preventDefault();
  activeId = e.pointerId;
  try{ el.live.setPointerCapture(e.pointerId); }catch(x){}
  var p = pt(e);
  if(tool === "text"){ textPos = p; cur = {t: "text-pending"}; return; }
  var op = {t: tool, c: COLORS[colorName], w: WIDTHS[widthName]};
  if(tool === "pen"){
    op.p = [p];
    styleLive(op);
    lctx.beginPath(); lctx.arc(p[0] * el.live.width, p[1] * el.live.height, lctx.lineWidth / 2, 0, Math.PI * 2); lctx.fill();
    lastMid = p;
  }else{
    op.a = p; op.b = p;
  }
  cur = op;
}
function onMove(e){
  if(!cur || e.pointerId !== activeId || cur.t === "text-pending") return;
  e.preventDefault();
  var list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
  if(!list || !list.length) list = [e];
  if(cur.t === "pen"){
    var cw = el.live.width, ch = el.live.height;
    for(var i = 0; i < list.length; i++){
      var p = pt(list[i]), prev = cur.p[cur.p.length - 1];
      var dx = (p[0] - prev[0]) * cw, dy = (p[1] - prev[1]) * ch;
      if(dx * dx + dy * dy < 1.5) continue;          /* te dicht bij het vorige punt: overslaan */
      cur.p.push(p);
      var m = mid(prev, p);
      lctx.beginPath(); lctx.moveTo(lastMid[0] * cw, lastMid[1] * ch);
      lctx.quadraticCurveTo(prev[0] * cw, prev[1] * ch, m[0] * cw, m[1] * ch);
      lctx.stroke(); lastMid = m;
    }
  }else{
    cur.b = pt(list[list.length - 1]);
    if(!rafId) rafId = requestAnimationFrame(function(){
      rafId = 0;
      if(!cur || cur.t === "pen") return;
      lctx.clearRect(0, 0, el.live.width, el.live.height);
      drawOp(lctx, cur, el.live.width, el.live.height);
    });
  }
}
function onUp(e){
  if(!cur || e.pointerId !== activeId) return;
  var op = cur; cur = null; activeId = null;
  if(rafId){ cancelAnimationFrame(rafId); rafId = 0; }
  if(op.t === "text-pending"){ showText(); return; }
  if(op.t !== "pen"){
    op.b = pt(e);
    var dx = (op.b[0] - op.a[0]) * el.live.width, dy = (op.b[1] - op.a[1]) * el.live.height;
    if(dx * dx + dy * dy < 36){ lctx.clearRect(0, 0, el.live.width, el.live.height); return; }   /* te klein: geen vorm */
  }
  commit(op);
}
function onCancel(e){
  if(!cur || e.pointerId !== activeId) return;
  cur = null; activeId = null;
  if(rafId){ cancelAnimationFrame(rafId); rafId = 0; }
  lctx.clearRect(0, 0, el.live.width, el.live.height);
}

/* ---------- Tekstgereedschap ---------- */
function showText(){
  el.textInput.value = "";
  el.text.hidden = false;
  setTimeout(function(){ el.textInput.focus(); }, 30);
}
function hideText(){ el.text.hidden = true; textPos = null; }
function addText(){
  var v = el.textInput.value.trim();
  var pos = textPos;
  hideText();
  if(!v || !pos) return;
  commit({t: "text", c: COLORS[colorName], s: TEXT_SIZES[widthName], x: pos[0], y: pos[1], text: v});
}

/* ---------- Openen, bewaren, sluiten ---------- */
async function decode(blob){
  try{ return await createImageBitmap(blob); }
  catch(e){
    fallbackUrl = URL.createObjectURL(blob);
    var img = new Image();
    await new Promise(function(res, rej){ img.onload = res; img.onerror = rej; img.src = fallbackUrl; });
    return img;
  }
}
async function open(o){
  init();
  ready = false; cur = null;
  bitmap = await decode(o.blob);
  W = bitmap.width || bitmap.naturalWidth; H = bitmap.height || bitmap.naturalHeight;
  /* eerder getekende acties worden als aparte stappen geladen, zodat ze ook stuk voor stuk ongedaan gemaakt kunnen worden */
  var ops = o.ops || [];
  states = [[]];
  ops.forEach(function(op){ states.push(states[states.length - 1].concat([op])); });
  idx = states.length - 1; initialJson = JSON.stringify(ops);
  syncButtons();
  layout();
  if(window.ResizeObserver){ ro = new ResizeObserver(function(){ if(!cur) layout(); }); ro.observe(el.stage); }
  ready = true;
}
function isDirty(){ return ready && JSON.stringify(states[idx]) !== initialJson; }

/* Voegt de tekening samen met het origineel en geeft de JPEG terug (zelfde afmetingen en kwaliteit als de foto's in de app). */
async function finish(){
  var ops = states[idx].slice();
  if(JSON.stringify(ops) === initialJson) return {changed: false};
  var blob = null;
  if(ops.length){
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, W, H);
    ops.forEach(function(op){ drawOp(ctx, op, W, H); });
    blob = await new Promise(function(res){ c.toBlob(function(b){ res(b); }, "image/jpeg", JPEG_QUALITY); });
    c.width = c.height = 0;
    if(!blob) throw new Error("Foto kon niet bewaard worden");
  }
  return {changed: true, ops: ops, blob: blob};
}

/* Geeft geheugen vrij: afbeelding, canvassen en object-URL. */
function close(){
  ready = false; cur = null; activeId = null;
  if(rafId){ cancelAnimationFrame(rafId); rafId = 0; }
  if(ro){ ro.disconnect(); ro = null; }
  if(bitmap && bitmap.close) bitmap.close();
  bitmap = null;
  if(fallbackUrl){ URL.revokeObjectURL(fallbackUrl); fallbackUrl = null; }
  if(el){
    el.base.width = el.base.height = el.live.width = el.live.height = 0;
    el.text.hidden = true;
  }
  states = [[]]; idx = 0; initialJson = "[]"; textPos = null;
}

window.PhotoEditor = {open: open, finish: finish, close: close, isDirty: isDirty};
})();
