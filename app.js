/* app.js - small helpers shared by both pages */
var REASONS = ["Equipment breakdown", "Shovel / dumper shortage", "Rain / bad weather",
  "Blasting delay", "Fuel shortage", "Power failure", "Coal dispatch / siding problem",
  "Haul road condition", "Manpower shortage", "Law & order / local disturbance",
  "Statutory / safety stoppage", "Other"];
var LOCATION = "Bhubaneswari OCP";

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c];
  });
}
function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
function fmt(n, d) {
  return Number(n || 0).toLocaleString("en-IN", {maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d});
}
function pct(actual, target) { return target > 0 ? actual / target * 100 : null; }
function pctText(p) { return p == null ? "-" : p.toFixed(1) + "%"; }
function isoDate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function showMsg(id, kind, text) {
  var el = document.getElementById(id);
  el.className = "msg " + kind;
  el.textContent = text;
  el.style.display = "block";
}
function errText(e) { return e && e.message ? e.message : String(e); }
function makeClient() {
  var url = window.SUPABASE_URL || "", key = window.SUPABASE_PUBLISHABLE_KEY || "";
  if (url.indexOf("PASTE") !== -1 || key.indexOf("PASTE") !== -1 || !window.supabase) return null;
  return window.supabase.createClient(url, key);
}
var NOT_READY = "The database settings in config.js are not filled in yet (or the Supabase library did not load). Ask the Data Keeper to fill in config.js.";
