// ===============================
// WEBHOOKI
// ===============================
const webhookMandat      = "https://discord.com/api/webhooks/1403683432227410001/aSOQ2awWpU5bBgGsgo1E0k_kkBIGU6bwOUEBsuSXgaVc-vp3-cmAlIWk5wHSkkdLheNg";
const webhookSadDecyzja  = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";
const webhookWniosekSad  = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";
const webhookRaport      = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";

// PATROLE MODE
const webhookPatrol = "https://discord.com/api/webhooks/1472388815510442110/k_cnN7d0XWEXEuRaFVqKAklUXfb_o2oxiRFWYzzxJ9Enmz4heKLyadeME-dKQ4NA3Fwb";

// ZARZĄD
const webhookAdaptacja   = "https://discord.com/api/webhooks/1453899121382653962/2-pKVCsfszoPdDoaIEIJRw9Zy8QtdDijF_kPDh4ZvYd5mUQLnd4gxbyaXPEFBXuEnJJD";
const webhookNagany      = "https://discord.com/api/webhooks/1400233440586240113/kfPPxAIhTowtkaF3fGdQvaudz9cAkZY0JlOfYmqJdmi1QImdnSJGbZQILKzvmI5qL_Rd";
const webhookPochwaly    = "https://discord.com/api/webhooks/1400233266836930641/ahEDsZQ15IL8DysKoUCAehtH-_9lzFixaP96ehax4d8jp-Rxijd8dvcVCt0fN03JqSa1";
const webhookAwanse      = "https://discord.com/api/webhooks/1471984933227466764/ieXF8Tx-oAyr3ZFS5Jn1ACMGQ_xzASSHwgAQSyoD8pMCnf87omVrSaawch0q4h84Dl-s";
const webhookZwolnienia  = "https://discord.com/api/webhooks/1471980589597851859/KQSoiWq5v3ViP_D28nmlKSv8OuFzPDNbGHA5FzY50SSzQyky78iztShVpuJdCDH8C9CN";


// ===============================
// FUNKCJONARIUSZE
// ===============================
const OFFICERS = [
  { id: "01", name: "Admin",   rank: "ALL",          pin: "6745", isBoard: true },
  { id: "480101", name: "Michał Nowacki",   rank: "Inspektor",          pin: "4827", isBoard: true },
  { id: "480202", name: "Michał Zieliński", rank: "Młodszy Inspektor",  pin: "9042", isBoard: true },
  { id: "480303", name: "Anna Nowak",       rank: "Podinspektor",       pin: "0711", isBoard: true },
  { id: "480404", name: "Aleksander Trok",  rank: "Podinspektor",       pin: "1568", isBoard: true },
  { id: "480505", name: "Leonard Bielik",   rank: "Komisarz",           pin: "7394", isBoard: true },

  { id: "480606", name: "Mariusz Tarkowski",      rank: "Starszy sierżant",      pin: "3175" },
  { id: "480707", name: "Bartłomiej Kowalewski",  rank: "Sierżant",              pin: "6281" },
  { id: "480808", name: "Hubert Jogurt",          rank: "Starszy Posterunkowy",  pin: "8459" },
  { id: "480909", name: "Ignacy Borowski",        rank: "Posterunkowy",          pin: "2706" },
  { id: "481010", name: "Kamil Brzoza",           rank: "Posterunkowy",          pin: "5913" },
  { id: "481111", name: "Szymon Klacz",           rank: "Posterunkowy",          pin: "7630" },
  { id: "481212", name: "Kamil Wojciechowski",    rank: "Posterunkowy",          pin: "4182" },
  { id: "481313", name: "Tomasz Dunczyk",         rank: "Posterunkowy",          pin: "1234" } // zmień PIN jak chcesz
];

const SESSION_KEY = "mtp_session_v2";
const SESSION_TTL_MIN = 180; // 3h

// ===============================
// Helpers
// ===============================
function $(id){ return document.getElementById(id); }
function nowISO(){ return new Date().toISOString(); }

function setStatus(elementId, message, isSuccess){
  const el = $(elementId);
  if(!el) return;
  el.textContent = message;
  el.classList.remove("status-success","status-error");
  if(isSuccess === true) el.classList.add("status-success");
  if(isSuccess === false) el.classList.add("status-error");
}

function clamp(str, max){
  const s = String(str ?? "").trim();
  if(!s) return "—";
  return s.length > max ? s.slice(0, max-1) + "…" : s;
}

function escQuote(text){
  if(!text) return "—";
  return String(text).split("\n").map(l => `> ${l}`).join("\n");
}
function escList(text){
  if(!text) return "—";
  return String(text).split("\n").map(l => `• ${l}`).join("\n");
}


// ===============================
// Session / Gate
// ===============================
function getSession(){
  try{
    const raw = localStorage.getItem(SESSION_KEY);
    if(!raw) return null;
    const s = JSON.parse(raw);
    const age = Date.now() - (s.ts || 0);
    if(age > SESSION_TTL_MIN * 60 * 1000) return null;
    return s;
  }catch{ return null; }
}

function setSession(officer){
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    officerId: officer.id,
    officerName: officer.name,
    officerRank: officer.rank,
    isBoard: !!officer.isBoard,
    ts: Date.now()
  }));
}

function clearSession(){ localStorage.removeItem(SESSION_KEY); }

function showGate(){
  const lock = $("lock");
  if(!lock) return;
  lock.classList.add("show");

  if($("officerIdInput")) $("officerIdInput").value = "";
  if($("pinInput")) $("pinInput").value = "";

  setStatus("statusGate","Wpisz numer legitymacji i PIN.", null);
  setTimeout(()=> $("officerIdInput")?.focus(), 50);
}

function hideGate(){
  const lock = $("lock");
  if(!lock) return;
  lock.classList.remove("show");
}

function updateSessionBadge(){
  const badge = $("sessionBadge");
  const s = getSession();
  if(!badge) return;

  if(!s){
    badge.innerHTML = `<span class="dot warn"></span>Brak sesji`;
    return;
  }

  const role = s.isBoard ? "ZARZĄD" : "Funkcjonariusz";
  badge.innerHTML = `<span class="dot"></span>${role}: <b>${s.officerId}</b> · ${s.officerRank} · ${s.officerName}`;
}

function requireGate(){
  const s = getSession();
  if(!s){
    showGate();
    return null;
  }
  updateSessionBadge();
  return s;
}

function isBoardUser(){
  const s = getSession();
  return !!(s && s.isBoard);
}

function requireBoard(){
  if(!requireGate()) return false;
  if(!isBoardUser()){
    alert("Brak uprawnień: ta sekcja jest tylko dla ZARZĄDU.");
    window.location.href = "./index.html";
    return false;
  }
  return true;
}

function autofillOfficer(){
  const s = getSession();
  if(!s) return;

  const display = `${s.officerId} — ${s.officerRank} — ${s.officerName}`;

  ["funkcjonariusz","sporadzilPatrol","sporadzilInterw","funkcjonariuszZatrzymanie"].forEach(id=>{
    const el = $(id);
    if(el && (!el.value || !el.value.trim())) el.value = display;
  });

  const author = $("autorBoard");
  if(author && (!author.value || !author.value.trim())) author.value = display;
}

function handleLogin(){
  const officerId = ($("officerIdInput")?.value || "").trim();
  const pin = ($("pinInput")?.value || "").trim();

  if(!officerId){
    setStatus("statusGate","Wpisz numer legitymacji.", false);
    return;
  }
  if(pin.length < 4){
    setStatus("statusGate","PIN za krótki.", false);
    return;
  }

  const officer = OFFICERS.find(o => o.id === officerId);
  if(!officer){
    setStatus("statusGate","Nie znaleziono funkcjonariusza o takim numerze.", false);
    return;
  }
  if(pin !== officer.pin){
    setStatus("statusGate","Niepoprawny PIN.", false);
    return;
  }

  setSession(officer);
  hideGate();
  updateSessionBadge();
  autofillOfficer();
  updateBoardVisibility();
  patrolUI();
}

function handleLogout(){
  clearSession();
  updateSessionBadge();
  showGate();
  updateBoardVisibility();
}


// ===============================
// Webhook send (JS-only)
// ===============================
function sanitizeEmbed(embed){
  embed = embed || {};
  embed.title = clamp(embed.title || "MTP", 256);
  if(embed.description) embed.description = clamp(embed.description, 4096);

  if(!Array.isArray(embed.fields)) embed.fields = [];
  embed.fields = embed.fields.slice(0,25).map(f=>({
    name: clamp(f?.name ?? "—", 256),
    value: clamp(f?.value ?? "—", 1024),
    inline: !!f?.inline
  }));

  embed.timestamp = embed.timestamp || nowISO();
  embed.footer = embed.footer || { text: "KWP GDAŃSK — MTP • Summer RP" };
  return embed;
}

async function wyslijWebhook(url, embed, content=null){
  if(!url || !url.startsWith("https://discord.com/api/webhooks/")){
    const e = new Error("Webhook jest pusty albo niepoprawny.");
    e.isNetwork = true;
    throw e;
  }

  embed = sanitizeEmbed(embed);
  const payload = content ? { content, embeds:[embed] } : { embeds: [embed] };

  const body = new URLSearchParams();
  body.set("payload_json", JSON.stringify(payload));

  await fetch(url, { method:"POST", body, mode:"no-cors" });
}


// ===============================
// UI toggles
// ===============================
function pokazPoleArtykulu(){
  const select = $("przyczyna");
  const div = $("innePrzyczynaDiv");
  if(!select || !div) return;
  div.style.display = select.value !== "" ? "block" : "none";
}

function toggleWniosekType(){
  const sel = $("typWniosku");
  const odmowa = $("wniosekOdmowa");
  const sad = $("wniosekSad");
  if(!sel || !odmowa || !sad) return;

  const isOdmowa = sel.value === "odmowa";
  odmowa.style.display = isOdmowa ? "block" : "none";
  sad.style.display = isOdmowa ? "none" : "block";

  const powodOdmowa = $("powodOdmowa");
  const opisSad = $("opisSad");
  if(powodOdmowa) powodOdmowa.required = isOdmowa;
  if(opisSad) opisSad.required = !isOdmowa;
}

function toggleRaportType(){
  const sel = $("rodzajRaportu");
  const patrol = $("patrolFields");
  const interw = $("interwencjaFields");
  if(!sel || !patrol || !interw) return;
  const type = sel.value;
  patrol.style.display = type === "patrol" ? "block" : "none";
  interw.style.display = type === "interwencja" ? "block" : "none";
}

function updateBoardVisibility(){
  const box = $("zarzadLinks");
  if(!box) return;
  box.style.display = isBoardUser() ? "grid" : "none";
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
  $("loginBtn")?.addEventListener("click", handleLogin);
  $("logoutBtn")?.addEventListener("click", handleLogout);

  $("pinInput")?.addEventListener("keydown", (e)=>{ if(e.key==="Enter") handleLogin(); });
  $("officerIdInput")?.addEventListener("keydown", (e)=>{ if(e.key==="Enter") handleLogin(); });

  requireGate();
  updateSessionBadge();
  updateBoardVisibility();
  autofillOfficer();

  pokazPoleArtykulu();
  toggleWniosekType();
  toggleRaportType();

  if(document.body?.dataset?.board === "true"){
    requireBoard();
  }

  patrolUI();
});


// ===============================
// TRYB PATROLU — TYLKO webhookPatrol
// ===============================
const PATROL_KEY = "mtp_patrol_state_v1";
let patrolTimer = null;

function patrolLoad(){
  try{ return JSON.parse(localStorage.getItem(PATROL_KEY) || "null"); }
  catch{ return null; }
}
function patrolSave(state){ localStorage.setItem(PATROL_KEY, JSON.stringify(state)); }
function patrolClear(){ localStorage.removeItem(PATROL_KEY); }

function pad2(n){ return String(n).padStart(2,"0"); }
function fmtHMS(ms){
  const total = Math.max(0, Math.floor(ms/1000));
  const h = Math.floor(total/3600);
  const m = Math.floor((total%3600)/60);
  const s = total%60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}
function genPatrolId(){
  const d = new Date();
  const y = d.getFullYear();
  const mo = pad2(d.getMonth()+1);
  const da = pad2(d.getDate());
  const rnd = Math.floor(1000 + Math.random()*9000);
  return `MTP-PATROL-${y}${mo}${da}-${rnd}`;
}

function patrolUI(){
  const box = $("patrolModeBox");
  if(!box) return;

  const pill = $("patrolStatePill");
  const idText = $("patrolIdText");
  const timeText = $("patrolTimeText");

  const st = patrolLoad();
  const active = !!(st && st.active);

  if(pill){
    pill.textContent = active ? "AKTYWNY" : "NIEAKTYWNY";
    pill.classList.toggle("on", active);
  }
  if(idText) idText.textContent = st?.patrolId || "—";
  if(timeText){
    timeText.textContent = active && st.startedAt ? fmtHMS(Date.now() - st.startedAt) : "00:00:00";
  }

  if(active){
    if(!patrolTimer) patrolTimer = setInterval(patrolUI, 1000);
  }else{
    if(patrolTimer){ clearInterval(patrolTimer); patrolTimer = null; }
  }
}

async function patrolStart(){
  const s = requireGate();
  if(!s) return;

  const existing = patrolLoad();
  if(existing?.active){
    setStatus("patrolStatus", "Patrol już jest aktywny.", false);
    patrolUI();
    return;
  }

  const partner = $("patrolPartner")?.value?.trim() || "—";
  const callsign = $("patrolCallsign")?.value?.trim() || "—";
  const area = $("patrolArea")?.value?.trim() || "—";
  const officer = `${s.officerId} — ${s.officerRank} — ${s.officerName}`;

  const state = {
    active: true,
    patrolId: genPatrolId(),
    startedAt: Date.now(),
    officer,
    partner,
    callsign,
    area
  };
  patrolSave(state);
  patrolUI();

  try{
    setStatus("patrolStatus", "Start patrolu… wysyłam log.", null);

    const embed = {
      title: "🟢 START PATROLU — MTP",
      description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0x2ecc71,
      fields: [
        { name:"Patrol ID", value: state.patrolId, inline:true },
        { name:"Znak patrolu", value: state.callsign, inline:true },
        { name:"Funkcjonariusz", value: state.officer },
        { name:"Partner / skład", value: state.partner },
        { name:"Rejon / sektor", value: state.area }
      ],
      footer: { text: "KWP GDAŃSK — MTP • Summer RP" },
      timestamp: nowISO()
    };

    await wyslijWebhook(webhookPatrol, embed, "**MTP: Start patrolu**");
    setStatus("patrolStatus", "Patrol uruchomiony i zalogowany.", true);
  }catch(err){
    setStatus("patrolStatus", "Patrol uruchomiony, ale nie wysłało logu.", false);
    console.error(err);
  }
}

async function patrolStop(){
  const s = requireGate();
  if(!s) return;

  const st = patrolLoad();
  if(!st?.active){
    setStatus("patrolStatus", "Nie ma aktywnego patrolu.", false);
    patrolUI();
    return;
  }

  const duration = fmtHMS(Date.now() - st.startedAt);

  try{
    setStatus("patrolStatus", "Stop patrolu… wysyłam log.", null);

    const embed = {
      title: "🔴 STOP PATROLU — MTP",
      description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0xff4d4d,
      fields: [
        { name:"Patrol ID", value: st.patrolId, inline:true },
        { name:"Czas służby", value: duration, inline:true },
        { name:"Znak patrolu", value: st.callsign || "—" },
        { name:"Funkcjonariusz", value: st.officer || "—" },
        { name:"Partner / skład", value: st.partner || "—" },
        { name:"Rejon / sektor", value: st.area || "—" }
      ],
      footer: { text: "KWP GDAŃSK — MTP • Summer RP" },
      timestamp: nowISO()
    };

    await wyslijWebhook(webhookPatrol, embed, "**MTP: Stop patrolu**");
    setStatus("patrolStatus", "Patrol zakończony i zalogowany.", true);
  }catch(err){
    setStatus("patrolStatus", "Zakończono patrol, ale nie wysłało logu.", false);
    console.error(err);
  }finally{
    patrolClear();
    patrolUI();
  }
}

async function patrolEvent(type){
  const s = requireGate();
  if(!s) return;

  const st = patrolLoad();
  if(!st?.active){
    setStatus("patrolStatus", "Najpierw uruchom START patrolu.", false);
    return;
  }

  const note = prompt(`Szczegóły zdarzenia: ${type}\n(krótko — opcjonalnie)`) || "—";
  const elapsed = fmtHMS(Date.now() - st.startedAt);

  try{
    setStatus("patrolStatus", `Wysyłam: ${type}…`, null);

    const embed = {
      title: `📌 ZDARZENIE PATROLU — ${type.toUpperCase()}`,
      description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0x4aa3ff,
      fields: [
        { name:"Patrol ID", value: st.patrolId, inline:true },
        { name:"Czas od startu", value: elapsed, inline:true },
        { name:"Znak patrolu", value: st.callsign || "—" },
        { name:"Rejon", value: st.area || "—" },
        { name:"Funkcjonariusz", value: st.officer || "—" },
        { name:"Partner / skład", value: st.partner || "—" },
        { name:"Szczegóły", value: clamp(note, 900) }
      ],
      footer: { text: "KWP GDAŃSK — MTP • Summer RP" },
      timestamp: nowISO()
    };

    await wyslijWebhook(webhookPatrol, embed, `**MTP: Zdarzenie patrolu — ${type}**`);
    setStatus("patrolStatus", `Wysłano zdarzenie: ${type}`, true);
  }catch(err){
    setStatus("patrolStatus", "Błąd wysyłki.", false);
    console.error(err);
  }
}

async function patrolNote(){
  const s = requireGate();
  if(!s) return;

  const st = patrolLoad();
  if(!st?.active){
    setStatus("patrolStatus", "Najpierw uruchom START patrolu.", false);
    return;
  }

  const text = prompt("Notatka patrolowa (krótko):");
  if(!text) return;

  const elapsed = fmtHMS(Date.now() - st.startedAt);

  try{
    setStatus("patrolStatus", "Wysyłam notatkę…", null);

    const embed = {
      title: "📝 NOTATKA PATROLU — MTP",
      description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0xf1c40f,
      fields: [
        { name:"Patrol ID", value: st.patrolId, inline:true },
        { name:"Czas od startu", value: elapsed, inline:true },
        { name:"Znak patrolu", value: st.callsign || "—" },
        { name:"Rejon", value: st.area || "—" },
        { name:"Funkcjonariusz", value: st.officer || "—" },
        { name:"Partner / skład", value: st.partner || "—" },
        { name:"Notatka", value: clamp(text, 900) }
      ],
      footer: { text: "KWP GDAŃSK — MTP • Summer RP" },
      timestamp: nowISO()
    };

    await wyslijWebhook(webhookPatrol, embed, "**MTP: Notatka patrolu**");
    setStatus("patrolStatus", "Notatka wysłana.", true);
  }catch(err){
    setStatus("patrolStatus", "Błąd wysyłki.", false);
    console.error(err);
  }
}

// expose patrol functions
window.patrolStart = patrolStart;
window.patrolStop = patrolStop;
window.patrolEvent = patrolEvent;
window.patrolNote = patrolNote;
