// ====== CONFIG ======
const OWNER_IDS = [
  process.env.OWNER_DISCORD_IDS
]

const ALLOWED_IDS = [
  process.env.ALLOWED_DISCORD_IDS
]

async function getMe() {
  const r = await fetch("/api/auth/me")
  return await r.json().catch(() => ({}))
}

function isAllowed(id) {
  return ALLOWED_IDS.includes(id) || OWNER_IDS.includes(id)
}

/* ===== DROPDOWN ===== */
window.toggleDrop = function (id) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.toggle("show")
}

/* ===== PAGES ===== */
window.showPage = function (page) {
  const title = document.getElementById("pageTitle")
  const desc = document.getElementById("pageDesc")
  const content = document.getElementById("pageContent")

  // active intro button
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

/* ===== LOGOUT ===== */
window.logout = async function () {
  await fetch("/api/auth/logout")
  location.href = "/"
}

/* ===== MOBILE SIDEBAR TOGGLE ===== */
function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebar")
  const btn = document.getElementById("sidebarToggle")

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches

  function applyMode() {
    // PC: sidebar always open + hide toggle button
    if (!isMobile()) {
      sidebar.classList.remove("mobileHide")
      btn.style.display = "none"
    } else {
      // Mobile: default hidden, tombol muncul
      btn.style.display = "inline-flex"
      sidebar.classList.add("mobileHide")
    }
  }

  btn.addEventListener("click", () => {
    if (!isMobile()) return
    sidebar.classList.toggle("mobileHide")
  })

  window.addEventListener("resize", applyMode)
  applyMode()
}

/* ===== INIT ===== */
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
  document.getElementById("sideName").innerText = me.username
  document.getElementById("sideId").innerText = `ID: ${me.id}`

  setupSidebarToggle()
  showPage("intro")
}

init()
