// ===============================
// WEBHOOKI (Konfiguracja)
// ===============================
const webhookMandat      = "https://discord.com/api/webhooks/1403683432227410001/aSOQ2awWpU5bBgGsgo1E0k_kkBIGU6bwOUEBsuSXgaVc-vp3-cmAlIWk5wHSkkdLheNg";
const webhookSadDecyzja  = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";
const webhookWniosekSad  = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";
const webhookRaport      = "https://discord.com/api/webhooks/1400235543039840276/eORj9cfyFdBNHEmRavXYoXszjo9fO_NkSV4zP1AJkRmTn5OAxYocKL1q3zkd6Bb50jVc";

// ZARZĄD
const webhookAdaptacja   = "https://discord.com/api/webhooks/1453899121382653962/2-pKVCsfszoPdDoaIEIJRw9Zy8QtdDijF_kPDh4ZvYd5mUQLnd4gxbyaXPEFBXuEnJJD";
const webhookNagany      = "https://discord.com/api/webhooks/1400233440586240113/kfPPxAIhTowtkaF3fGdQvaudz9cAkZY0JlOfYmqJdmi1QImdnSJGbZQILKzvmI5qL_Rd";
const webhookPochwaly    = "https://discord.com/api/webhooks/1400233266836930641/ahEDsZQ15IL8DysKoUCAehtH-_9lzFixaP96ehax4d8jp-Rxijd8dvcVCt0fN03JqSa1";
const webhookAwanse      = "https://discord.com/api/webhooks/1471984933227466764/ieXF8Tx-oAyr3ZFS5Jn1ACMGQ_xzASSHwgAQSyoD8pMCnf87omVrSaawch0q4h84Dl-s";
const webhookZwolnienia  = "https://discord.com/api/webhooks/1471980589597851859/KQSoiWq5v3ViP_D28nmlKSv8OuFzPDNbGHA5FzY50SSzQyky78iztShVpuJdCDH8C9CN";
const webhookPsychologiczne = "https://discord.com/api/webhooks/1480281220779606239/6zWCesT2bEuqF2t2qrTaw4YaA3l0EoPecd7-_6idwgam_FTERp2UiOidN5W8LH4YUWZz";

// ===============================
// FUNKCJONARIUSZE (Baza Danych)
// Przypisanie do window. gwarantuje widoczność w HTML
// ===============================
window.OFFICERS = [
    { id: "480101", name: "Michał Nowacki",   rank: "Inspektor",           pin: "4827", isBoard: true },
    { id: "480202", name: "Michał Zieliński", rank: "Młodszy Inspektor",   pin: "9042", isBoard: true },
    { id: "480303", name: "Anna Nowak",       rank: "Podinspektor",        pin: "0711", isBoard: true },
    { id: "480404", name: "Aleksander Trok",  rank: "Podinspektor",        pin: "1568", isBoard: true },
    { id: "480505", name: "Leonard Bielik",   rank: "Komisarz",            pin: "7394", isBoard: true },
    { id: "480606", name: "Mariusz Tarkowski",      rank: "Starszy Aspirant",      pin: "3175" },
    { id: "480707", name: "Bartłomiej Kowalewski",  rank: "Sierżant",              pin: "6281" },
    { id: "480808", name: "Hubert Jogurt",          rank: "Starszy Posterunkowy",  pin: "8459" },
    { id: "480909", name: "Ignacy Borowski",        rank: "Posterunkowy",          pin: "2706" },
    { id: "481010", name: "Kamil Brzoza",           rank: "Posterunkowy",          pin: "5913" },
    { id: "481111", name: "Szymon Klacz",           rank: "Posterunkowy",          pin: "7630" },
    { id: "481212", name: "Kamil Wojciechowski",    rank: "Posterunkowy",          pin: "4182" },
    { id: "481313", name: "Tomasz Dunczyk",         rank: "Posterunkowy",          pin: "6053" },
    { id: "481414", name: "Dawid Bieg",             rank: "Posterunkowy",          pin: "5365" },
    { id: "481515", name: "Aleksander Polkowski",   rank: "Posterunkowy",          pin: "7437" },
    { id: "481616", name: "Krzysztof Zielinski",    rank: "Sierżant",              pin: "7437" },
    { id: "481717", name: "Mariusz Tarkowski",      rank: "Posterunkowy",          pin: "7437" }
];

const SESSION_KEY = "mtp_session_v2";
const SESSION_TTL_MIN = 180;

// ===============================
// POMOCNIKI (Helpers)
// ===============================
function $(id) { return document.getElementById(id); }
function nowISO() { return new Date().toISOString(); }

function clamp(str, max) {
    if (!str) return "—";
    str = String(str);
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
}

function escQuote(str) { return str ? `\`${str}\`` : "—"; }
function escList(str) { return str ? str.replace(/\n/g, ", ") : "—"; }

function setStatus(elementId, message, isSuccess) {
    const el = $(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("status-success", "status-error");
    if (isSuccess === true) { el.classList.add("status-success"); playSound('snd-success'); }
    else if (isSuccess === false) { el.classList.add("status-error"); playSound('snd-error'); }
}

// ===============================
// SESJA I LOGOWANIE
// ===============================
function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        const age = Date.now() - (s.ts || 0);
        if (age > SESSION_TTL_MIN * 60 * 1000) return null;
        return s;
    } catch { return null; }
}

function buildOfficerSelect() {
    const sel = $("officerSelect");
    if (!sel) return;
    sel.innerHTML = `<option value="" disabled selected>Wybierz funkcjonariusza...</option>` +
        window.OFFICERS.map(o => `<option value="${o.id}">${o.id} — ${o.rank} — ${o.name}</option>`).join("");
}

function handleLogin() {
    const officerId = $("officerSelect")?.value;
    const pin = ($("pinInput")?.value || "").trim();
    const officer = window.OFFICERS.find(o => o.id === officerId);

    if (!officer || pin !== officer.pin) {
        return setStatus("statusGate", "Niepoprawny numer legitymacji lub PIN.", false);
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({
        officerId: officer.id,
        officerName: officer.name,
        officerRank: officer.rank,
        isBoard: !!officer.isBoard,
        ts: Date.now()
    }));

    $("lock")?.classList.remove("show");
    updateSessionBadge();
    autofillOfficer();
    updateBoardVisibility();
}

function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    location.reload();
}

function updateSessionBadge() {
    const badge = $("sessionBadge");
    const s = getSession();
    if (!badge) return;
    if (!s) { badge.innerHTML = `<span class="dot warn"></span>Brak sesji`; return; }
    const role = s.isBoard ? "ZARZĄD" : "Funkcjonariusz";
    badge.innerHTML = `<span class="dot"></span>${role}: <b>${s.officerId}</b> · ${s.officerRank} · ${s.officerName}`;
}

function requireGate() {
    if (!getSession()) { $("lock")?.classList.add("show"); return null; }
    return getSession();
}

function updateBoardVisibility() {
    const box = $("zarzadLinks");
    if (box) box.style.display = (getSession()?.isBoard) ? "grid" : "none";
}

function autofillOfficer() {
    const s = getSession();
    if (!s) return;
    const display = `${s.officerId} — ${s.officerRank} — ${s.officerName}`;
    ["funkcjonariusz", "sporadzilPatrol", "sporadzilInterw", "funkcjonariuszZatrzymanie", "autorBoard"].forEach(id => {
        const el = $(id);
        if (el && !el.value) el.value = display;
    });
}

// ===============================
// LOGIN (ZMIENIONY)
// ===============================
function handleLogin(){
  const officerId = ($("officerSelect")?.value || "").trim();
  const pin = ($("pinInput")?.value || "").trim();
  const officer = OFFICERS.find(o => o.id === officerId);

  if(!officer) return setStatus("statusGate","Nie znaleziono funkcjonariusza.", false);
  if(pin.length < 4) return setStatus("statusGate","PIN za krótki.", false);
  if(pin !== officer.pin) return setStatus("statusGate","Niepoprawny PIN.", false);

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    officerId: officer.id,
    officerName: officer.name,
    officerRank: officer.rank,
    isBoard: !!officer.isBoard,
    ts: Date.now()
  }));

  document.getElementById("lock").classList.remove("show");
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

function buildOfficerSelect(){
  const sel = $("officerSelect");
  if(!sel) return;

  sel.innerHTML =
    `<option value="" disabled selected>Numer legitymacji lub PIN jest nie prawidłowy...</option>` +
    OFFICERS.map(o =>
      `<option value="${o.id}">${o.id} — ${o.rank} — ${o.name}</option>`
    ).join("");
}

function showGate(){
  const lock = $("lock");
  if(!lock) return;
  buildOfficerSelect();
  lock.classList.add("show");
  if($("pinInput")) $("pinInput").value = "";
  setStatus("statusGate","Wprowadź ID i PIN.", null);
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
  const officerId = $("officerSelect")?.value;
  const pin = ($("pinInput")?.value || "").trim();
  const officer = OFFICERS.find(o => o.id === officerId);

  if(!officer) return setStatus("statusGate","Numer legitymacji lub PIN jest nie prawidłowy.", false);
  if(pin.length < 4) return setStatus("statusGate","PIN za krótki.", false);
  if(pin !== officer.pin) return setStatus("statusGate","Niepoprawny PIN.", false);

  setSession(officer);
  hideGate();
  updateSessionBadge();
  autofillOfficer();
  updateBoardVisibility();
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
  const payload = content ? { content, embeds:[embed] } : { embeds:[embed] };

  const body = new URLSearchParams();
  body.set("payload_json", JSON.stringify(payload));

  // opaque response, ale request poleci
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


// ===============================
// ZARZĄD — widoczność w index.html
// ===============================
function updateBoardVisibility(){
  const box = $("zarzadLinks");
  if(!box) return;
  box.style.display = isBoardUser() ? "grid" : "none";
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
  buildOfficerSelect();

  $("loginBtn")?.addEventListener("click", handleLogin);
  $("logoutBtn")?.addEventListener("click", handleLogout);
  $("pinInput")?.addEventListener("keydown", (e)=>{ if(e.key==="Enter") handleLogin(); });

  requireGate();
  updateSessionBadge();
  updateBoardVisibility();
  autofillOfficer();

  pokazPoleArtykulu();
  toggleWniosekType();
  toggleRaportType();

  // jeśli to strona zarządu, zablokuj wejście
  if(document.body?.dataset?.board === "true"){
    requireBoard();
  }

// =========================
// MANDAT (ZAKTUALIZOWANY)
// =========================
const mandatForm = $("mandatForm");
if(mandatForm){
  mandatForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if(!requireGate()) return;

    setStatus("statusMandat","Wysyłam mandat…",null);

    try{
      const imie = clamp($("imie")?.value, 128);
      const nick = clamp($("nick")?.value, 128);
      const discId = $("discordId")?.value.trim();
      const dataWyst = $("dataWystawienia")?.value;
      const godzZdarz = $("godzinaZdarzenia")?.value || "—";
      const miejsce = clamp($("miejsce")?.value, 256);

      const przycz = $("przyczyna")?.value || "";
      const art = $("innePrzyczyna")?.value?.trim() || "";
      if(!art){
        setStatus("statusMandat","Wpisz artykuł (wymagane).",false);
        return;
      }
      const przyczynaFinal = (przycz === "inne" || !przycz) ? art : `${przycz} — (${art})`;

      const kwota = Number($("kwota")?.value || 0);
      const punkty = Number($("punkty")?.value || 0);
      const pojazd = clamp($("pojazd")?.value, 256);
      const funkc = clamp($("funkcjonariusz")?.value || "", 256);

      const d = new Date(dataWyst);
      const dataStr = isNaN(d) ? "—" : (d.toLocaleDateString("pl-PL") + ", " + d.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"}));

      const embed = {
        title: "💸 MANDAT KARNY — MTP",
        description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
        color: 0xdc143c,
        fields: [
          { name:"Dane osoby ukaranej", value:`> Imię i nazwisko: **${imie}**\n> Nick (OOC): ${nick}` },
          { name:"Informacje o zdarzeniu", value:`> Data wystawienia: **${dataStr}**\n> Godzina zdarzenia: **${godzZdarz}**\n> Miejsce: **${miejsce}**` },
          { name:"Przyczyna", value:`> **${clamp(przyczynaFinal, 900)}**` },
          { name:"Wymiar kary", value:`> Kwota: **${kwota.toLocaleString()} PLN**\n> Punkty: **${punkty} pkt**` },
          { name:"Pojazd", value:`> ${pojazd}` },
          { name:"Funkcjonariusz", value:`> **${funkc}**` },
          { name:"⏳ Informacja", value: `> Należy opłacić w ciągu **7 dni** do <@1484671868785922170>` }
        ],
        footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
      };

      await wyslijWebhook(webhookMandat, embed, `<@${discId}>`); 
      
      setStatus("statusMandat","Mandat wysłany i gracz zapingowany!",true);

      mandatForm.reset();
      pokazPoleArtykulu();
      autofillOfficer();
    }catch(err){
      setStatus("statusMandat","Błąd: " + (err.message || String(err)),false);
    }
  });
}
  // =========================
  // WNIOSEK
  // =========================
  const wniosekForm = $("wniosekForm");
  if(wniosekForm){
    wniosekForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      if(!requireGate()) return;

      setStatus("statusWniosek","Wysyłam wniosek…",null);

      try{
        const ukarany = clamp($("ukarany")?.value, 128);
        const nick = clamp($("nickWniosek")?.value, 128);
        const typ = $("typWniosku")?.value || "odmowa";

        let embed;

        if(typ === "odmowa"){
          const dataMandatu = $("dataMandatu")?.value || "—";
          const typMandatu = clamp($("typMandatu")?.value, 128);
          const kwotaMandatu = $("kwotaMandatu")?.value ? Number($("kwotaMandatu").value) : null;
          const powod = $("powodOdmowa")?.value?.trim() || "";
          if(!powod){
            setStatus("statusWniosek","Opisz powód odmowy (wymagane).",false);
            return;
          }

          embed = {
            title: "📜 WNIOSEK DO SĄDU — ODMOWA MANDATU — MTP",
            description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
            color: 0x3b82f6,
            fields: [
              { name:"Dane osoby", value:`> **${ukarany}**\n> Nick: ${nick}` },
              { name:"Mandat", value:`> Data: **${dataMandatu}**\n> Typ: **${typMandatu}**\n> Kwota: **${kwotaMandatu==null || Number.isNaN(kwotaMandatu) ? "—" : kwotaMandatu.toLocaleString()+" PLN"}**` },
              { name:"Powód odmowy", value:`> ${clamp(powod, 900)}` }
            ],
            footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
          };
        }else{
          const dataCzas = $("dataCzasZdarzeniaSad")?.value;
          const dataCzasStr = dataCzas ? new Date(dataCzas).toLocaleString("pl-PL") : "—";
          const miejsce = clamp($("miejsceSad")?.value, 256);
          const kwal = clamp($("kwalifikacjaSad")?.value, 900);
          const opis = $("opisSad")?.value?.trim() || "";
          const dowody = clamp($("dowodySad")?.value, 900);

          if(!opis){
            setStatus("statusWniosek","Opis sprawy jest wymagany.",false);
            return;
          }

          embed = {
            title: "📜 WNIOSEK DO SĄDU — SPRAWA PRZEKAZANA — MTP",
            description: "**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
            color: 0x3b82f6,
            fields: [
              { name:"Strona", value:`> **${ukarany}**\n> Nick: ${nick}` },
              { name:"Zdarzenie", value:`> Czas: **${dataCzasStr}**\n> Miejsce: **${miejsce}**` },
              { name:"Kwalifikacja", value:`> ${kwal}` },
              { name:"Opis", value:`> ${clamp(opis, 900)}` },
              { name:"Dowody", value:`> ${dowody}` }
            ],
            footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
          };
        }

        let ok1=false, ok2=false;
        try{ await wyslijWebhook(webhookWniosekSad, embed); ok1=true; }catch(e1){ console.warn(e1); }
        try{ await wyslijWebhook(webhookSadDecyzja, embed); ok2=true; }catch(e2){ console.warn(e2); }

        if(ok1 || ok2){
          setStatus("statusWniosek","Wniosek wysłany.",true);
          wniosekForm.reset();
          toggleWniosekType();
        }else{
          setStatus("statusWniosek","Nie poszło na żaden webhook (sprawdź URL).",false);
        }

      }catch(err){
        setStatus("statusWniosek","Błąd: " + (err.message || String(err)),false);
        console.error(err);
      }
    });
  }

  // =========================
  // ZARZĄD — formularze (podstrony)
  // =========================
wireBoardForm("adaptacjaForm", "statusAdaptacja", webhookAdaptacja, () => ({
  content: `${$("candId")?.value}`,
  embed: {
    title: "🧪 WYNIK ADAPTACJI — ZARZĄD MTP",
    color: 0x4aa3ff,
    fields: [
      { name:"Funkcjonariusz (kandydat)", value: clamp($("candName")?.value, 256) },
      { name:"ID", value: clamp($("candId")?.value, 64) },
      { name:"Okres adaptacji", value: clamp($("adaptPeriod")?.value, 128) },
      { name:"Wynik", value: clamp($("adaptResult")?.value, 128) },
      { name:"Ocena / komentarz", value: clamp($("adaptComment")?.value, 900) },
      { name:"Decyzja", value: clamp($("adaptDecision")?.value, 128) },
      { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
    ]
  }
}));

  wireBoardForm("naganyForm", "statusNagany", webhookNagany, () => {
    const discId = $("targetDiscordId")?.value.trim();
    return {
      ping: discId ? `<@${discId}>` : null,
      embed: {
        title: "⛔ NAGANA / DYSCYPLINA — ZARZĄD MTP",
        color: 0xff4d4d,
        fields: [
          { name:"Funkcjonariusz", value: clamp($("targetName")?.value, 256) },
          { name:"ID", value: clamp($("targetId")?.value, 64) },
          { name:"Powód", value: clamp($("reason")?.value, 900) },
          { name:"Kara / środek", value: clamp($("penalty")?.value, 256) },
          { name:"Dowody / linki", value: clamp($("evidence")?.value, 900) },
          { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
        ]
      }
    };
  });

  wireBoardForm("pochwalyForm", "statusPochwaly", webhookPochwaly, () => ({
    embed: {
      title: "✅ POCHWAŁA / WYRÓŻNIENIE — ZARZĄD MTP",
      color: 0x2ecc71,
      fields: [
        { name:"Funkcjonariusz", value: clamp($("pName")?.value, 256) },
        { name:"ID", value: clamp($("pId")?.value, 64) },
        { name:"Za co", value: clamp($("pFor")?.value, 900) },
        { name:"Forma wyróżnienia", value: clamp($("pType")?.value, 256) },
        { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
      ]
    }
  }));

  wireBoardForm("awanseForm", "statusAwanse", webhookAwanse, () => {
    const discId = $("aDiscordId")?.value.trim();
    return {
      ping: discId ? `<@${discId}>` : null,
      embed: {
        title: "⬆️ AWANS / ZMIANA STOPNIA — ZARZĄD MTP",
        color: 0xf1c40f,
        fields: [
          { name:"Funkcjonariusz", value: clamp($("aName")?.value, 256) },
          { name:"ID", value: clamp($("aId")?.value, 64) },
          { name:"Z", value: clamp($("aFrom")?.value, 128) },
          { name:"Na", value: clamp($("aTo")?.value, 128) },
          { name:"Uzasadnienie", value: clamp($("aWhy")?.value, 900) },
          { name:"Data wejścia", value: clamp($("aDate")?.value, 128) },
          { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
        ]
      }
    };
  });

  wireBoardForm("zwolnieniaForm", "statusZwolnienia", webhookZwolnienia, () => ({
    embed: {
      title: "🧾 ZWOLNIENIE / USUNIĘCIE ZE SŁUŻBY — ZARZĄD MTP",
      color: 0x9b59b6,
      fields: [
        { name:"Funkcjonariusz", value: clamp($("zName")?.value, 256) },
        { name:"ID", value: clamp($("zId")?.value, 64) },
        { name:"Powód", value: clamp($("zReason")?.value, 900) },
        { name:"Data", value: clamp($("zDate")?.value, 128) },
        { name:"Uwagi / dalsze kroki", value: clamp($("zNotes")?.value, 900) },
        { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
      ]
    }
  }));

wireBoardForm("psyForm", "statusPsy", webhookPsychologiczne, () => ({
  embed: {
    title: "🧠 SKIEROWANIE NA BADANIA PSYCHOLOGICZNE — ZARZĄD MTP",
    color: 0x3498db,
    fields: [
      { name:"Funkcjonariusz", value: clamp($("psyName")?.value, 256) },
      { name:"ID", value: clamp($("psyId")?.value, 64) },
      { name:"Powód skierowania", value: clamp($("psyReason")?.value, 900) },
      { name:"Rodzaj badań", value: clamp($("psyType")?.value, 256) },
      { name:"Autor (ZARZĄD)", value: clamp($("autorBoard")?.value, 256) }
    ]
  }
}));
});



// ===============================
// ZARZĄD — helper (ZAKTUALIZOWANY)
// ===============================
function wireBoardForm(formId, statusId, webhookUrl, buildDataFn){
  const form = $(formId);
  if(!form) return;

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if(!requireBoard()) return;

    setStatus(statusId, "Wysyłam…", null);

    try{
      const s = getSession();
      const data = buildDataFn();
      
      // Obsługa starego i nowego formatu danych
      const embedRaw = data.embed ? data.embed : data;
      const playerPing = data.ping ? data.ping : "";

      const embed = {
        ...embedRaw,
        description: "**KWP GDAŃSK — Panel Zarządu (MTP)**",
        footer: { text: "KWP GDAŃSK — ZARZĄD MTP" },
        timestamp: nowISO()
      };

      // Połączenie logu zarządu z pingiem gracza
      const content = `**ZARZĄD MTP** · ${s.officerId} — ${s.officerRank} — ${s.officerName} ${playerPing}`;

      await wyslijWebhook(webhookUrl, embed, content);
      setStatus(statusId, "Wysłano pomyślnie.", true);

      form.reset();
      autofillOfficer();
    }catch(err){
      setStatus(statusId, "Błąd: " + (err.message || String(err)), false);
      console.error(err);
    }
  });
}


// ===============================
// RAPORTY / ZATRZYMANIE (dla onclick)
// ===============================
async function sendPatrolReport(){
  if(!requireGate()) return;

  try{
    setStatus("statusRaportPatrol","Wysyłam raport patrolu…",null);

    const dataSluzby = $("dataSluzby")?.value || "—";
    const czasTrwania = $("czasTrwania")?.value || "—";
    const sklad = $("skladPatrolu")?.value?.trim() || "—";
    const obszar = $("obszarPatrolu")?.value?.trim() || "—";
    const czynnosci = $("czynnosciPatrolu")?.value?.trim() || "—";
    const incydenty = $("incydentyPatrolu")?.value?.trim() || "Brak";
    const uwagi = $("uwagiPatrolu")?.value?.trim() || "—";
    const sporadzil = $("sporadzilPatrol")?.value?.trim() || "—";
    const dataSporz = $("dataSporzadzeniaPatrol")?.value || new Date().toLocaleDateString("pl-PL");

    const embed = {
      title:"📋 RAPORT ZE SŁUŻBY / PATROLU — MTP",
      description:"**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0x2ecc71,
      fields:[
        { name:"Data służby", value:dataSluzby, inline:true },
        { name:"Czas trwania", value:czasTrwania, inline:true },
        { name:"Skład patrolu", value:escQuote(sklad) },
        { name:"Obszar patrolu", value:clamp(obszar,900) },
        { name:"Czynności", value:clamp(escList(czynnosci),900) },
        { name:"Incydenty", value:clamp(incydenty,900) },
        { name:"Uwagi", value:clamp(uwagi,900) },
        { name:"Sporządził", value:clamp(sporadzil,256) },
        { name:"Data sporządzenia", value:dataSporz }
      ],
      footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
    };

    await wyslijWebhook(webhookRaport, embed, "**Nowy raport patrolu (MTP)**");
    setStatus("statusRaportPatrol","Raport patrolu wysłany.",true);
  }catch(err){
    setStatus("statusRaportPatrol","Błąd: " + (err.message || String(err)),false);
    console.error(err);
  }
}

async function sendInterwReport(){
  if(!requireGate()) return;

  try{
    setStatus("statusRaportInterw","Wysyłam raport interwencji…",null);

    const dataCzas = $("dataCzasInterw")?.value;
    const dataCzasStr = dataCzas ? new Date(dataCzas).toLocaleString("pl-PL") : "—";
    const miejsce = $("miejsceInterw")?.value?.trim() || "—";
    const zgloszenie = $("zgloszenieInterw")?.value?.trim() || "—";
    const funkcjonariusze = $("funkcjonariuszeInterw")?.value?.trim() || "—";
    const opis = $("opisInterw")?.value?.trim() || "—";
    const zatrzymane = $("zatrzymaneOsoby")?.value?.trim() || "Brak";
    const dowody = $("dowodyInterw")?.value?.trim() || "Brak";
    const uwagi = $("uwagiInterw")?.value?.trim() || "—";
    const sporadzil = $("sporadzilInterw")?.value?.trim() || "—";
    const dataSporz = $("dataSporzadzeniaInterw")?.value || new Date().toLocaleDateString("pl-PL");

    const embed = {
      title:"📄 RAPORT Z INTERWENCJI — MTP",
      description:"**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0xf1c40f,
      fields:[
        { name:"Data i godzina", value:dataCzasStr },
        { name:"Miejsce", value:clamp(miejsce,900) },
        { name:"Zgłoszenie", value:clamp(zgloszenie,900) },
        { name:"Funkcjonariusze", value:escQuote(funkcjonariusze) },
        { name:"Opis", value:clamp(opis,900) },
        { name:"Zatrzymane osoby", value:clamp(zatrzymane,900) },
        { name:"Dowody", value:clamp(escList(dowody),900) },
        { name:"Uwagi", value:clamp(uwagi,900) },
        { name:"Sporządził", value:clamp(sporadzil,256) },
        { name:"Data sporządzenia", value:dataSporz }
      ],
      footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
    };

    await wyslijWebhook(webhookRaport, embed, "**Nowy raport interwencji (MTP)**");
    setStatus("statusRaportInterw","Raport interwencji wysłany.",true);
  }catch(err){
    setStatus("statusRaportInterw","Błąd: " + (err.message || String(err)),false);
    console.error(err);
  }
}

async function sendZatrzymanieProtocol(){
  if(!requireGate()) return;

  try{
    setStatus("statusZatrzymanie","Wysyłam protokół…",null);

    const dataCzas = $("dataCzasZatrzymania")?.value;
    const dataStr = dataCzas ? new Date(dataCzas).toLocaleString("pl-PL") : "—";

    const funkcjonariusz = $("funkcjonariuszZatrzymanie")?.value?.trim() || "—";
    const nickFunc = $("nickFuncZatrzymanie")?.value?.trim() || "—";
    const osoba = $("osobaZatrzymanaIC")?.value?.trim() || "—";
    const idDowod = $("idDowodZatrzymanie")?.value?.trim() || "—";
    const miejsce = $("miejsceZatrzymania")?.value?.trim() || "—";
    const powod = $("powodZatrzymania")?.value?.trim() || "—";
    const zabezp = $("zabezpieczonePrzedmioty")?.value?.trim() || "Brak";
    const czasTrw = $("czasTrwaniaZatrzymania")?.value?.trim() || "—";
    const uwagi = $("uwagiZatrzymanie")?.value?.trim() || "Brak";
    const dataSporz = $("dataSporzadzeniaZatrzymania")?.value || new Date().toLocaleDateString("pl-PL");

    if(!dataCzas || !funkcjonariusz || !nickFunc || !osoba || !miejsce || !powod){
      setStatus("statusZatrzymanie","Uzupełnij wymagane pola (*).",false);
      return;
    }

    const embed = {
      title:"🚨 PROTOKÓŁ ZATRZYMANIA — MTP",
      description:"**Komenda Wojewódzka Policji w Gdańsku – Summer RP**",
      color: 0xe74c3c,
      fields:[
        { name:"Data i godzina zatrzymania", value:`**${dataStr}**` },
        { name:"Funkcjonariusz", value:`> **${clamp(funkcjonariusz,256)}**\n> Nick OOC: ${clamp(nickFunc,128)}` },
        { name:"Zatrzymany", value:`> **${clamp(osoba,128)}**\n> ID/Dowód: ${clamp(idDowod,128)}` },
        { name:"Miejsce", value:clamp(miejsce,900) },
        { name:"Powód", value:clamp(powod,900) },
        { name:"Zabezpieczone przedmioty", value:clamp(escList(zabezp),900) },
        { name:"Czas trwania", value:clamp(czasTrw,128) },
        { name:"Uwagi", value:clamp(uwagi,900) },
        { name:"Podpis (IC)", value:`**${clamp(funkcjonariusz,256)}**\nData: **${dataSporz}**` }
      ],
      footer:{ text:"KWP GDAŃSK — MTP • Summer RP" }
    };

    await wyslijWebhook(webhookRaport, embed, "**Nowy protokół zatrzymania (MTP)**");
    setStatus("statusZatrzymanie","Protokół wysłany.",true);

    $("zatrzymanieForm")?.reset();
    autofillOfficer();
  }catch(err){
    setStatus("statusZatrzymanie","Błąd: " + (err.message || String(err)),false);
    console.error(err);
  }
}
// ===============================
// Statusy patroli
// ===============================
const STATUS_CONFIG = {
  "Dostępny": { color: "#2ecc71", class: "pill on" },
  "Niedostępny": { color: "#ff4d4d", class: "pill" },
  "Zadysponowany": { color: "#4aa3ff", class: "pill" },
  "Podjęcie interwencji": { color: "#ffcc66", class: "pill" },
  "Interwencja własna": { color: "#f39c12", class: "pill" },
  "Przerwa": { color: "#95a5a6", class: "pill" },
  "Transport": { color: "#9b59b6", class: "pill" },
  "Konwój": { color: "#8e44ad", class: "pill" },
  "Zabezpieczenie": { color: "#1abc9c", class: "pill" },
  "Brak łączności": { color: "#e74c3c", class: "pill" }
};

// expose globals for onclick
window.pokazPoleArtykulu = pokazPoleArtykulu;
window.toggleWniosekType = toggleWniosekType;
window.toggleRaportType = toggleRaportType;
window.sendPatrolReport = sendPatrolReport;
window.sendInterwReport = sendInterwReport;
window.sendZatrzymanieProtocol = sendZatrzymanieProtocol;
