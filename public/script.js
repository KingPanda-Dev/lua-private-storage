async function download() {
  const file = document.getElementById("file").value
  const code = document.getElementById("code").value
  const msg = document.getElementById("msg")

  const res = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, code })
  })

  if (!res.ok) {
    msg.textContent = "❌ Code salah atau file tidak ada"
    msg.style.color = "red"
    return
  }

  const blob = await res.blob()
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = file
  a.click()

  msg.textContent = "✅ Download success"
  msg.style.color = "lime"
}
