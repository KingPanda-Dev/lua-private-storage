// ====== CONFIG (LOAD FROM API) ======
let OWNER_IDS = []
let ALLOWED_IDS = []

async function loadConfig() {
  const r = await fetch("/api/config")
  const cfg = await r.json()

  OWNER_IDS = cfg.owners || []
  ALLOWED_IDS = cfg.allowed || []
}

function isAllowed(id) {
  return OWNER_IDS.includes(id) || ALLOWED_IDS.includes(id)
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
window.toggleDrop = function (id) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.toggle("show")
}

/* ===== Pages ===== */
window.showPage = function (page) {
  const title = document.getElementById("pageTitle")
  const desc = document.getElementById("pageDesc")
  const content = document.getElementById("pageContent")

  // auto close sidebar on mobile after click
  if (window.matchMedia("(max-width: 900px)").matches) {
    closeSidebar()
  }

  document.getElementById("btnIntro").classList.remove("active")

  if (page === "intro") {
    document.getElementById("btnIntro").classList.add("active")
    title.innerText = "Introduction"
    desc.innerText = "Welcome to KingPanda private storage dashboard."
    content.innerHTML = `
      <div class="glass card">
        <h3>👋 Welcome</h3>
        <p>This dashboard is private. Access is limited and downloads are protected.</p>
      </div>

      <div class="glass card">
        <h3>🔐 Rules</h3>
        <p>Do not share codes. Do not reupload scripts. Your activity can be logged.</p>
      </div>
    `
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
    // pastiin endpoint ini ada: /api/auth/logout.js
    await fetch("/api/auth/logout", { method: "GET" })
  } catch (e) {}
  location.href = "/"
}

/* ===== Auth check ===== */
async function getMe() {
  const r = await fetch("/api/auth/me")
  return await r.json().catch(() => ({}))
}

async function init() {
  const me = await getMe()

  // belum login => 404
  if (!me || me.error || !me.id) {
    location.href = "/404"
    return
  }

  // login tapi ga allowed => no-access
  if (!isAllowed(me.id)) {
    location.href = "/no-access"
    return
  }

  const avatarUrl = me.avatar
    ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`

  document.getElementById("sideAvatar").src = avatarUrl
  document.getElementById("sideName").innerText = me.username || "User"
  document.getElementById("sideId").innerText = `ID: ${me.id}`

  showPage("intro")
}

init()
