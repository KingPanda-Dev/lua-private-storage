// ====== CONFIG (isi sesuai kamu) ======
const OWNER_IDS = process.env.OWNER_DISCORD_IDS

const ALLOWED_IDS = process.env.ALLOWED_DISCORD_IDS

// contoh data file (nanti kamu bisa ganti)
const FILES = {
  growpai: [
    { name: "GrowPai Main", file: "growpai/main.lua", desc: "GrowPai Lua script package (protected)" }
  ],
  growlauncher: [
    { name: "GrowLauncher Main", file: "growlauncher/main.lua", desc: "GrowLauncher Lua script package (protected)" }
  ]
}

let currentUser = null
let currentCategory = "growpai"

// ===== UI helpers =====
function setActiveBtn(category) {
  document.querySelectorAll(".navBtn").forEach(b => b.classList.remove("active"))
  const map = {
    growpai: 0,
    growlauncher: 1,
    owner: 2
  }
  const idx = map[category]
  const btns = document.querySelectorAll(".navBtn")
  if (btns[idx]) btns[idx].classList.add("active")
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]))
}

// ===== Dropdown =====
window.toggleDropdown = function () {
  const dd = document.getElementById("dropdown")
  dd.classList.toggle("show")
}

document.addEventListener("click", (e) => {
  const dd = document.getElementById("dropdown")
  const btn = document.querySelector(".avatarBtn")
  if (!dd || !btn) return
  if (!btn.contains(e.target) && !dd.contains(e.target)) dd.classList.remove("show")
})

// ===== Auth =====
async function getMe() {
  const r = await fetch("/api/auth/me")
  const data = await r.json()
  return data
}

function isAllowed(id) {
  return ALLOWED_IDS.includes(id) || OWNER_IDS.includes(id)
}

function isOwner(id) {
  return OWNER_IDS.includes(id)
}

// ===== Render =====
function renderCategory(category) {
  const title = document.getElementById("title")
  const subtitle = document.getElementById("subtitle")
  const content = document.getElementById("content")

  currentCategory = category
  setActiveBtn(category)

  if (category === "owner") {
    title.innerText = "Owner Panel"
    subtitle.innerText = "Generate download code (owner only)"

    content.innerHTML = `
      <div class="card glass">
        <h3>Generate Code</h3>
        <p>Click button to generate new code (auto 5 chars).</p>
        <div class="row">
          <button class="btn primary" onclick="generateCode()">Generate</button>
          <input id="genResult" class="input" placeholder="Code result..." readonly />
        </div>
      </div>
    `
    return
  }

  title.innerText = category === "growpai" ? "GrowPai Scripts" : "GrowLauncher Scripts"
  subtitle.innerText = "Select script to download"

  const list = FILES[category] || []
  content.innerHTML = list.map(x => `
    <div class="card glass">
      <h3>${escapeHtml(x.name)}</h3>
      <p>${escapeHtml(x.desc)}</p>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <input id="code-${escapeHtml(x.file)}" class="input" placeholder="Enter access code..." />
        <button class="btn primary" onclick="downloadFile('${escapeHtml(x.file)}','${escapeHtml(category)}')">
          Download
        </button>
      </div>
    </div>
  `).join("")
}

window.showCategory = function (category) {
  // protect owner panel
  if (category === "owner" && (!currentUser || !isOwner(currentUser.id))) {
    alert("Owner only.")
    return
  }
  renderCategory(category)
}

// ===== Actions =====
window.downloadFile = async function (file, category) {
  const input = document.getElementById("code-" + file)
  const code = input ? input.value.trim() : ""

  if (!code) {
    alert("Masukin code dulu.")
    return
  }

  const r = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, code, category })
  })

  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    alert(err.error || "Download failed")
    return
  }

  const blob = await r.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = file.split("/").pop()
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

window.generateCode = async function () {
  const r = await fetch("/api/generate-code")
  const data = await r.json()

  if (!r.ok) {
    alert(data.error || "Failed generate code")
    return
  }

  document.getElementById("genResult").value = data.code
}

window.logout = async function () {
  await fetch("/api/auth/logout")
  location.href = "/"
}

// ===== INIT =====
async function init() {
  try {
    const me = await getMe()

    // belum login
    if (me.error || !me.id) {
      location.href = "/"
      return
    }

    currentUser = me

    // 🚨 INI FIX UTAMA: orang lain gak boleh masuk dashboard
    if (!isAllowed(me.id)) {
      location.href = "/no-access"
      return
    }

    const avatarUrl = me.avatar
      ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`

    // topbar
    document.getElementById("avatar").src = avatarUrl
    document.getElementById("username").innerText = me.username
    document.getElementById("userid").innerText = me.id

    // sidebar footer
    document.getElementById("sideAvatar").src = avatarUrl
    document.getElementById("sideName").innerText = me.username
    document.getElementById("sideId").innerText = `ID: ${me.id}`

    // owner button
    if (isOwner(me.id)) {
      document.getElementById("ownerBtn").style.display = "block"
    }

    renderCategory("growpai")
  } catch (e) {
    // fallback
    location.href = "/"
  }
}

init()
