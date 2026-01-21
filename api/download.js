import { GITHUB } from "../config.js"
import { validateCode } from "./generate-code.js"
import { sendLog } from "./webhook.js"

async function getUser(req) {
  const r = await fetch(
    `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/auth/me`,
    { headers: { cookie: req.headers.cookie || "" } }
  )

  if (!r.ok) return null
  return await r.json()
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end()

  // 1️⃣ Ambil user dari session
  const user = await getUser(req)

  if (!user)
    return res.status(401).json({ error: "Unauthorized" })

  // 2️⃣ Ambil data request
  const { file, code, category } = req.body

  if (!file || !code || !category)
    return res.status(400).json({ error: "Invalid request" })

  // 3️⃣ Validasi code
  if (!validateCode(code))
    return res.status(403).json({ error: "Code invalid or expired" })

  // 4️⃣ Ambil file dari GitHub
  const url = `https://raw.githubusercontent.com/${GITHUB.OWNER}/${GITHUB.REPO}/${GITHUB.BRANCH}/${category}/${file}`

  const r = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB.TOKEN}`,
      "User-Agent": "KingPanda-Storage"
    }
  })

  if (!r.ok)
    return res.status(404).json({ error: "File not found" })

  const data = await r.text()

  // 5️⃣ Kirim webhook log
  sendLog(user, file, category).catch(() => {})

  // 6️⃣ Kirim file
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file}"`
  )
  res.setHeader("Content-Type", "text/plain")
  res.send(data)
}
