let ME = null;
let selectedDownload = null;

async function getMe() {
  const r = await fetch("/api/auth/me");
  const data = await r.json();
  return data;
}

function setUserUI(me){
  const avatar = document.getElementById("avatar");
  const username = document.getElementById("username");

  if (avatar) avatar.src = me.avatarURL || "";
  if (username) username.textContent = `${me.username}`;
}

function show(section){
  document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`[data-section="${section}"]`);
  if (btn) btn.classList.add("active");

  const title = document.getElementById("title");
  const content = document.getElementById("content");

  if (section === "growpai") {
    title.textContent = "GrowPai Scripts";
    content.innerHTML = `
      <div class="card file-card">
        <h3>GrowPai Main</h3>
        <p>GrowPai Lua script package (protected)</p>
        <div class="row">
          <button class="btn primary" onclick="openCodeModal('growpai/growpai.lua','GrowPai')">Download</button>
        </div>
      </div>
    `;
  }

  if (section === "growlauncher") {
    title.textContent = "GrowLauncher Scripts";
    content.innerHTML = `
      <div class="card file-card">
        <h3>GrowLauncher Main</h3>
        <p>GrowLauncher Lua script package (protected)</p>
        <div class="row">
          <button class="btn primary" onclick="openCodeModal('growlauncher/growlauncher.lua','GrowLauncher')">Download</button>
        </div>
      </div>
    `;
  }

  if (section === "owner") {
    title.textContent = "Owner Code Generator";
    content.innerHTML = `
      <div class="card file-card">
        <h3>Generate Code</h3>
        <p>Owner-only access. Create temporary download codes.</p>
        <div class="row">
          <button class="btn primary" onclick="generateCode()">Generate</button>
        </div>
        <div class="hr"></div>
        <div id="codeResult" class="small">No code generated yet.</div>
      </div>
    `;
  }
}

async function logout(){
  await fetch("/api/auth/logout");
  location.href="/";
}

/* ===== Custom Modal Code Input ===== */

function openCodeModal(file, category){
  selectedDownload = { file, category };
  document.getElementById("codeInput").value = "";
  document.getElementById("codeModal").classList.add("show");
  document.getElementById("codeInput").focus();
}

function closeCodeModal(){
  document.getElementById("codeModal").classList.remove("show");
  selectedDownload = null;
}

async function confirmDownload(){
  if (!selectedDownload) return;

  const code = document.getElementById("codeInput").value.trim();
  if (!code) return alert("Enter code first!");

  const { file, category } = selectedDownload;

  const r = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ file, category, code })
  });

  if (!r.ok) {
    const err = await r.json().catch(()=>({}));
    alert(err.error || "Download failed");
    return;
  }

  const blob = await r.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.split("/").pop();
  a.click();

  closeCodeModal();
}

/* ===== Owner generate code ===== */

async function generateCode(){
  const r = await fetch("/api/generate-code");
  const data = await r.json();

  if (!r.ok) {
    alert(data.error || "Failed generate code");
    return;
  }

  document.getElementById("codeResult").innerHTML =
    `<b>Code:</b> <span style="color:var(--blue)">${data.code}</span> <br/>
     <b>Expires:</b> ${data.expiresRelative}`;
}

/* ===== Boot ===== */

(async function(){
  ME = await getMe();

  if (ME.error) {
    location.href = "/";
    return;
  }

  // 🔥 SECURITY: block non-allowed users
  if (!ME.isAllowed) {
    location.href = "/no-access";
    return;
  }

  setUserUI(ME);

  // owner button
  if (ME.isOwner) {
    const ownerBtn = document.getElementById("ownerBtn");
    if (ownerBtn) ownerBtn.style.display = "block";
  }

  // default tab
  show("growpai");
})();
