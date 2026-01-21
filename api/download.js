import { GITHUB } from "../config.js"
import { validateCode } from "./generate-code.js"

export default async function handler(req, res) {
  const { file, code } = req.body

  if (!validateCode(code)) {
    return res.status(403).json({ error: "Code invalid or expired" })
  }

  const url = `https://raw.githubusercontent.com/${GITHUB.OWNER}/${GITHUB.REPO}/${GITHUB.BRANCH}/${file}`

  const r = await fetch(url, {
    headers: { Authorization: `token ${GITHUB.TOKEN}` }
  })

  if (!r.ok) return res.status(404).end()

  const data = await r.text()

  res.setHeader("Content-Disposition", `attachment; filename=${file}`)
  res.send(data)
}
