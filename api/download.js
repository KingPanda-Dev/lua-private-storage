import { GITHUB } from "../config.js"
import { validateCode } from "./generate-code.js"
import { sendLog } from "./webhook.js"
import { getUserFromRequest } from "./auth/me.js"

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end()

  // 1️⃣ Ambil user dari session Discord
  const user = await getUserFromRequest(req)

  if (!user)
    return res.status(401).json({ error: "Unauthorized" })

  // 2️⃣ Ambil data dari frontend
  const { file, code, category } = req.body

  if (!file || !code || !category)
    return res.status(400).json({ error: "Invalid request" })

  // 3️⃣ Validasi code
  const valid = validateCode(code)

  if (!valid)
    return res.status(403).json({ error: "Code invalid or expired" })

  // 4️⃣ Ambil file dari GitHub
  const url = `https://raw.githubusercontent.com/${GITHUB.OWNER}/${GITHUB.REPO}/${GITHUB.BRANCH}/${category}/${file}`

  const r = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB.TOKEN}`,
      "User-Agent": "KingPanda-Lua-Storage"
    }
  })

  if (!r.ok)
    return res.status(404).json({ error: "File not found" })

  const data = await r.text()

  // 5️⃣ Kirim webhook log (AMAN, async)
  sendLog(user, file, category).catch(() => {})

  // 6️⃣ Kirim file
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file}"`
  )
  res.setHeader("Content-Type", "text/plain")
  res.send(data)
}
