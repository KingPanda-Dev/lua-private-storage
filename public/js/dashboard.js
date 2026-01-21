let USER

async function init() {
  const r = await fetch("/api/auth/me")
  USER = await r.json()

  avatar.src = `https://cdn.discordapp.com/avatars/${USER.id}/${USER.avatar}.png`
  username.textContent = USER.username

  if (USER.isOwner) {
    ownerBtn.style.display = "block"
  }

  show("growpai")
}

function show(type) {
  content.innerHTML = ""
  title.textContent = type === "growpai" ? "GrowPai Lua"
                   : type === "growlauncher" ? "GrowLauncher Lua"
                   : "Owner Panel"

  if (type === "owner") {
    content.innerHTML = `
      <div class="card">
        <h3>Generate Code</h3>
        <button onclick="gen()">Generate</button>
        <pre id="out"></pre>
      </div>`
    return
  }

  const files = type === "growpai"
    ? ["growpai.lua"]
    : ["growlauncher.lua"]

  files.forEach(f => {
    const d = document.createElement("div")
    d.className = "card"
    d.innerHTML = `
      <h3>${f}</h3>
      <p>${type.toUpperCase()} Script</p>
      <button onclick="download('${f}','${type}')">Download</button>`
    content.appendChild(d)
  })
}

async function gen() {
  const r = await fetch("/api/generate-code")
  const j = await r.json()
  out.textContent = `CODE: ${j.code}\nEXPIRE: ${new Date(j.expire)}`
}

async function download(file, category) {
  const code = prompt("Enter Code:")
  if (!code) return

  const r = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, code, category })
  })

  if (!r.ok) return alert("Invalid / Expired code")

  const blob = await r.blob()
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = file
  a.click()
}

init()
