/* app.js - helpers shared by all pages (header, theme, numbers, status) */
var LOCATION = "Bhubaneswari OCP";
var REASONS = ["Heavy Rainfall", "Machinery Breakdown", "Dumper Breakdown", "Poor Haul Road",
  "Vehicle Movement Delay", "Blasting Delay", "Power Failure", "Manpower Shortage", "Other"];
var CATS = ["Rainfall", "Machinery Breakdown", "Poor Haul Road", "Vehicle Movement Delay", "Other"];
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* Group any reason text into one of the five chart categories */
function catOf(r) {
  var s = String(r || "").toLowerCase();
  if (!s) return "Other";
  if (/rain|weather|flood/.test(s)) return "Rainfall";
  if (/haul|road/.test(s)) return "Poor Haul Road";
  if (/vehicle|movement|dispatch|siding|rake|traffic/.test(s)) return "Vehicle Movement Delay";
  if (/breakdown|equipment|shovel|dumper|machin|power|drill/.test(s)) return "Machinery Breakdown";
  return "Other";
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c];
  });
}
function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
function fmt(n, d) {
  return Number(n || 0).toLocaleString("en-US", {maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d});
}
function pct(actual, target) { return target > 0 ? actual / target * 100 : null; }
function pctText(p) { return p == null ? "-" : p.toFixed(1) + "%"; }
function isoDate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function parseISO(s) { var p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function addDays(s, n) { var d = parseISO(s); d.setDate(d.getDate() + n); return isoDate(d); }
function longDate(s) { var d = parseISO(s); return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
function shortDate(s) { var d = parseISO(s); return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3); }
function fyStart(s) { var d = parseISO(s); var y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return y + "-04-01"; }

/* Status indicator: 100%+ green, 90-99% yellow, below 90% red */
function statusOf(p) {
  if (p == null) return {cls: "na", icon: "⚪", label: "No target"};
  if (p >= 100) return {cls: "good", icon: "🟢", label: "Target Achieved"};
  if (p >= 90) return {cls: "near", icon: "🟡", label: "Near Target"};
  return {cls: "bad", icon: "🔴", label: "Shortfall"};
}
function badge(p) {
  var s = statusOf(p);
  return '<span class="st ' + s.cls + '" title="' + s.label + '">' + s.icon + ' ' + pctText(p) + '</span>';
}

function showMsg(id, kind, text) {
  var el = document.getElementById(id);
  el.className = "msg " + kind + " noprint";
  el.textContent = text;
  el.style.display = "block";
}
function errText(e) {
  var m = e && e.message ? e.message : String(e);
  if (/failed to fetch|networkerror|load failed/i.test(m)) {
    m += " [The page could not reach the database at " + (window.SUPABASE_URL || "(no address set)") +
      ". Please check: 1) the Project URL in config.js is exactly right, 2) the Supabase project is not paused, 3) your network or ad-blocker is not blocking supabase.co.]";
  }
  return m;
}
function makeClient() {
  var url = window.SUPABASE_URL || "", key = window.SUPABASE_PUBLISHABLE_KEY || "";
  if (url.indexOf("PASTE") !== -1 || key.indexOf("PASTE") !== -1 || !window.supabase) return null;
  return window.supabase.createClient(url, key);
}
var NOT_READY = "The database settings in config.js are not filled in yet (or the Supabase library did not load). Ask the Data Keeper to fill in config.js.";
var NEED_03 = " (If this mentions is_void, ask the Data Keeper to run database/03-add-remove-flag.sql once.)";

/* Read many rows, 1000 at a time (the database sends at most 1000 per request) */
async function fetchAll(makeQuery) {
  var out = [], from = 0;
  for (;;) {
    var r = await makeQuery().range(from, from + 999);
    if (r.error) throw r.error;
    out = out.concat(r.data);
    if (r.data.length < 1000) return out;
    from += 1000;
  }
}

/* ---- theme (light / dark) ---- */
function currentTheme() {
  var t = document.documentElement.getAttribute("data-theme");
  if (t) return t;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function initTheme() {
  try { var t = localStorage.getItem("mcl-theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}
}
function toggleTheme() {
  var t = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("mcl-theme", t); } catch (e) {}
  updateThemeButton();
  document.dispatchEvent(new Event("themechange"));
}
function updateThemeButton() {
  var b = document.getElementById("themebtn");
  if (b) b.textContent = currentTheme() === "dark" ? "☀ Light mode" : "☾ Dark mode";
}
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
initTheme();

/* ---- same header and menu on every page ---- */
function renderHeader(active) {
  var links = [["index.html", "Shift Entry"], ["dashboard.html", "Dashboard"], ["records.html", "Records"]];
  document.getElementById("hdr").innerHTML =
    '<div class="in"><div class="brand"><div><h1>Daily Coal &amp; OB Production</h1>' +
    '<small>' + LOCATION + ', Mahanadi Coalfields Limited (sample data only)</small></div>' +
    '<div class="hright"><button type="button" id="themebtn" class="ghost" aria-label="Switch dark or light mode"></button>' +
    '<img src="logo.jpg" alt="MCL logo" class="logo" onerror="this.style.display=\'none\'"></div></div>' +
    '<nav class="menu">' + links.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[0] === active ? ' class="on"' : '') + '>' + l[1] + '</a>';
    }).join("") + '</nav></div>';
  document.getElementById("hdr").className = "top noprint";
  document.getElementById("themebtn").addEventListener("click", toggleTheme);
  updateThemeButton();
}
