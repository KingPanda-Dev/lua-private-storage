// ====== CONFIG (LOAD FROM API) ======
let OWNER_IDS = []
let ALLOWED_IDS = []
let files = []
let allFiles = []

async function loadConfig() {
  const r = await fetch("/api/config", { cache: "no-store" })
  const cfg = await r.json()

  OWNER_IDS = (cfg.owners || []).map((x) => String(x).trim())
  ALLOWED_IDS = (cfg.allowed || []).map((x) => String(x).trim())
}

function isAllowed(id) {
  id = String(id).trim()
  return OWNER_IDS.includes(id) || ALLOWED_IDS.includes(id)
}

function isOwner(id) {
  id = String(id).trim()
  return OWNER_IDS.includes(id)
}

/* ===== Sidebar control ===== */
window.openSidebar = function () {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  if (!sidebar || !overlay) return

  sidebar.classList.add("open")
  overlay.classList.add("show")
}

window.closeSidebar = function () {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  if (!sidebar || !overlay) return

  sidebar.classList.remove("open")
  overlay.classList.remove("show")
}

/* ===== Dropdown ===== */
window.toggleDrop = function (id, btn) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.toggle("show")
  if (btn) btn.classList.toggle("open")
}

/* ===== Pages ===== */
window.showPage = function (page) {
  const title = document.getElementById("pageTitle")
  const desc = document.getElementById("pageDesc")
  const intro = document.getElementById("pageIntro")
  const owner = document.getElementById("pageOwner")

  intro.style.display = "none"
  owner.style.display = "none"

   // active reset
  document.getElementById("btnIntro")?.classList.remove("active")
  document.getElementById("btnOwner")?.classList.remove("active")
  
  // auto close sidebar on mobile after click
  if (window.matchMedia("(max-width: 900px)").matches) {
    closeSidebar()
  }

  if (page === "intro") {
    intro.style.display = "grid"
    title.innerText = "Introduction"
    desc.innerText = "Welcome to KingPanda private storage dashboard."
    document.getElementById("btnIntro")?.classList.add("active")
    return
  }

  if (page === "owner") {
    owner.style.display = "block"
    title.innerText = "Owner Panel"
    desc.innerText = "Manage file codes & access control"
    document.getElementById("btnOwner")?.classList.add("active")
    renderTable()
    return
  }

  title.innerText = "Coming Soon"
  desc.innerText = "Design first, scripts later."
  content.innerHTML = `
    <div class="glass card">
      <h3>🛠 ${page}</h3>
      <p>This page will be connected to file downloads later.</p>
    </div>
  `
}

/* ===== Logout ===== */
window.logout = async function () {
  try {
    await fetch("/api/auth/logout", { method: "GET", cache: "no-store" })
  } catch (e) {}

  location.replace("/?logout=" + Date.now())
}

function toggleEdit(id) {
  document.querySelectorAll(".edit-box").forEach(b => b.classList.remove("open"))
  const box = document.getElementById("edit-" + id)
  if (box) box.classList.toggle("open")
}

function saveEdit(id) {
  const f = files.find(x => x.id === id)
  const hours = Number(document.getElementById("time-" + id).value)
  const limit = Number(document.getElementById("limit-" + id).value)

  f.expireAt = Date.now() + hours * 3600000
  f.limit = limit

  toggleEdit(id)
  renderTable()
}

function filterFiles(force = false) {
  const q = document.getElementById("searchInput").value.toLowerCase().trim()

  if (!force && q.length === 0) {
    renderTable()
    return
  }

  const filtered = files.filter(f =>
    f.title.toLowerCase().includes(q)
  )

  renderTable(filtered)
}

function handleSearchKey(e) {
  if (e.key === "Enter") {
    filterFiles(true)
  }
}

function formatTime(ms) {
  if (ms <= 0) return "Expired"
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}m ${s}s`
}

let allFiles = [
  {
    title: "GrowPai Auto Farm",
    category: "GrowPai",
    code: "GP-AX92K",
    expire: "2026-01-12",
    used: 3
  },
  {
    title: "GrowLauncher Boost",
    category: "GrowLauncher",
    code: "GL-ZX21M",
    expire: "2025-11-08",
    used: 10
  }
];

function renderTable(data = files) {
  const body = document.getElementById("fileTableBody")
  body.innerHTML = ""

  data.forEach(file => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${file.title}</td>
      <td>${file.category}</td>
      <td>${file.code}</td>
      <td id="exp-${file.id}"></td>
      <td>${file.used}/${file.limit === -1 ? "∞" : file.limit}</td>
      <td>
        <button class="edit-btn" onclick="toggleEdit('${file.id}')">Edit</button>
      </td>
    `
    body.appendChild(tr)

    // edit row
    const edit = document.createElement("tr")
    edit.innerHTML = `
      <td colspan="6">
        <div class="edit-box" id="edit-${file.id}">
          <div class="edit-grid">
            <select id="time-${file.id}">
              <option value="1">1 Hour</option>
              <option value="6">6 Hours</option>
              <option value="24">1 Day</option>
            </select>
            <select id="limit-${file.id}">
              <option value="1">1x</option>
              <option value="3">3x</option>
              <option value="5">5x</option>
              <option value="-1">Unlimited</option>
            </select>
          </div>

          <div class="edit-footer">
            <button class="btn btn-cancel" onclick="toggleEdit('${file.id}')">Cancel</button>
            <button class="btn btn-save" onclick="saveEdit('${file.id}')">Save</button>
          </div>
        </div>
      </td>
    `
    body.appendChild(edit)
  })
}

setInterval(() => {
  files.forEach(f => {
    const el = document.getElementById("exp-" + f.id)
    if (el) el.innerText = formatTime(f.expireAt - Date.now())
  })
}, 1000)

/* ===== Auth check ===== */
async function getMe() {
  const r = await fetch("/api/auth/me", { cache: "no-store" })
  return await r.json().catch(() => ({}))
}

async function init() {
  try {
    // hide dulu biar ga flash intro
    document.body.style.visibility = "hidden"

    // load config dulu (biar permission stabil)
    await loadConfig()

    const me = await getMe()

    // belum login => 404
    if (!me || me.error || !me.id) {
      location.replace("/404")
      return
    }

    // login tapi ga allowed => no-access
    if (!isAllowed(me.id)) {
      location.replace("/no-access")
      return
    }

    // OWNER PANEL CHECK
    if (isOwner(me.id)) {
      document.getElementById("btnOwner").style.display = "block"
    }

    // ==== BARU BOLEH TAMPILKAN DASHBOARD ====
    document.body.style.visibility = "visible"

    const avatarUrl = me.avatar
      ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`

    document.getElementById("sideAvatar").src = avatarUrl
    document.getElementById("sideName").innerText = me.username || "User"
    document.getElementById("sideId").innerText = `ID: ${me.id}`

    showPage("intro")
  } catch (e) {
    location.replace("/404")
  }
}

init()
