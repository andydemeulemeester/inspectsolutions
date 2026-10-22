/* Omgeving herkennen aan het adres. Enkel inspect.gapsolutions.be is productie (PRD);
   elk ander adres (dev., localhost, preview-adressen) wordt duidelijk als DEV getoond.
   De klasse env-prd / env-dev op <html> stuurt de accentkleur (zie style.css).
   Moet in <head> staan, direct na de manifest- en iconlinks, vóór de browser het manifest ophaalt. */
(function(){
  var root = document.documentElement;
  /* Implementatie-ID van het Apps Script per omgeving. Het webadres is niet geheim (de sleutel beschermt het script).
     Het ID blijft gelijk zolang je een bestaande implementatie bijwerkt met "Nieuwe versie". */
  var SCRIPT_ID_DEV = "AKfycbw8tReQGdfp7_RTtqL2yp4-v8nSf7onw2MPYwnp4g6YJSVafRbAWQj24AVkyJC-X1VU";
  var SCRIPT_ID_PRD = "AKfycbwE3TdbqdUU6d2fxDUYQbmpQ72zEiNmryZ_3w8np6lZQOkzSZ6-3m0X4h6Rq_tvQYRl";
  var scriptId = location.hostname === "inspect.gapsolutions.be" ? SCRIPT_ID_PRD : SCRIPT_ID_DEV;
  window.INSPECT_SCRIPT_URL = scriptId ? "https://script.google.com/macros/s/" + scriptId + "/exec" : "";
  if(location.hostname === "inspect.gapsolutions.be"){ root.className += " env-prd"; return; }
  root.className += " env-dev";
  document.title = "InspectSolutions DEV";
  var set = function(id, href){ var el = document.getElementById(id); if(el) el.setAttribute("href", href); };
  set("lnkManifest", "manifest-dev.webmanifest");
  set("lnkTouch", "icons/dev-apple-touch-icon.png");
  set("lnkIcon", "icons/dev-icon-192.png");
  var icon = document.getElementById("lnkIcon");
  if(icon) icon.setAttribute("type", "image/png");
})();
