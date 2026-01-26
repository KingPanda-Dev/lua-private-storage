// ====== CONFIG (LOAD FROM API) ======
let OWNER_IDS = []
let ALLOWED_IDS = []

async function loadConfig() {
  const r = await fetch("/api/config", { cache: "no-store" })
  const cfg = await r.json()

  OWNER_IDS = (cfg.owners || []).map(x => String(x).trim())
  ALLOWED_IDS = (cfg.allowed || []).map(x => String(x).trim())
}

function isAllowed(id) {
  id = String(id).trim()
  return OWNER_IDS.includes(id) || ALLOWED_IDS.includes(id)
}

/* ===== Auth check ===== */
async function getMe() {
  const r = await fetch("/api/auth/me", { cache: "no-store" })
  return await r.json().catch(() => ({}))
}

async function init() {
  // 🔥 WAJIB: tunggu config dulu
  try {
    await loadConfig()
  } catch (e) {
    console.log("Config load failed:", e)
    // kalau config gagal load, mending anggap no access
    location.href = "/404"
    return
  }

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
