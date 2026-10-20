/* Omgeving herkennen aan het adres. Enkel inspect.gapsolutions.be is productie (PRD);
   elk ander adres (dev., localhost, preview-adressen) wordt duidelijk als DEV getoond.
   De klasse env-prd / env-dev op <html> stuurt de accentkleur (zie style.css).
   Moet in <head> staan, direct na de manifest- en iconlinks, vóór de browser het manifest ophaalt. */
(function(){
  var root = document.documentElement;
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
