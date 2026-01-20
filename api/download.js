import { FILE_CODES, GITHUB } from "../config"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { file, code } = req.body

  if (!FILE_CODES[file]) {
    return res.status(404).json({ error: "File not registered" })
  }

  if (FILE_CODES[file] !== code) {
    return res.status(403).json({ error: "Invalid code" })
  }

  const url = `https://raw.githubusercontent.com/${GITHUB.OWNER}/${GITHUB.REPO}/${GITHUB.BRANCH}/${file}`

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB.TOKEN}`
    }
  })

  if (!response.ok) {
    return res.status(404).json({ error: "File not found" })
  }

  const data = await response.text()

  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Content-Disposition", `attachment; filename="${file}"`)
  res.send(data)
}
