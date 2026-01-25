// ====== CONFIG ======
const OWNER_IDS = [
  process.env.OWNER_DISCORD_IDS
]

const ALLOWED_IDS = [
  process.env.ALLOWED_DISCORD_IDS
]

// ====== AUTH ======
async function getMe() {
  const r = await fetch("/api/auth/me")
  const data = await r.json().catch(() => ({}))
  return data
}

function isAllowed(id) {
  return ALLOWED_IDS.includes(id) || OWNER_IDS.includes(id)
}

// ====== SIDEBAR UI ======
window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("closed")
}

window.toggleDrop = function (id) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.toggle("open")
}

window.showPage = function (page) {
  const title = document.getElementById("pageTitle")
  const desc = document.getElementById("pageDesc")
  const content = document.getElementById("pageContent")

  // reset active intro button
  document.querySelectorAll(".sideLink").forEach(x => x.classList.remove("active"))

  if (page === "intro") {
    document.querySelector(".sideLink").classList.add("active")
    title.innerText = "Introduction"
    desc.innerText = "Welcome to KingPanda private storage dashboard."
    content.innerHTML = `
      <div class="glass card">
        <h3 style="margin:0 0 6px 0;">👋 Welcome</h3>
        <p class="muted" style="margin:0;">
          This dashboard is private. Access is limited and downloads are protected.
        </p>
      </div>

      <div class="glass card">
        <h3 style="margin:0 0 6px 0;">🔐 Rules</h3>
        <p class="muted" style="margin:0;">
          Do not share codes. Do not reupload scripts. Your activity can be logged.
        </p>
      </div>
    `
    return
  }

  // sementara: placeholder untuk file pages
  title.innerText = "Coming Soon"
  desc.innerText = "Design first, scripts later."
  content.innerHTML = `
    <div class="glass card">
      <h3 style="margin:0 0 6px 0;">🛠 ${page}</h3>
      <p class="muted" style="margin:0;">
        This page will be connected to file downloads later.
      </p>
    </div>
  `
}

window.logout = async function () {
  await fetch("/api/auth/logout")
  location.href = "/"
}

// ====== INIT ======
async function init() {
  const me = await getMe()

  // 🚨 belum login => 404
  if (!me || me.error || !me.id) {
    location.href = "/404"
    return
  }

  // 🚨 login tapi tidak allowed => no-access
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

  // default intro
  showPage("intro")
}

init()
