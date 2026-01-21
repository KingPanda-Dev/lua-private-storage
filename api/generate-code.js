import { PERMISSION } from "../config.js"

let codes = {}

export default function handler(req, res) {
  const cookie = req.headers.cookie || ""
  const match = cookie.match(/session=([^;]+)/)
  if (!match) return res.status(401).end()

  const user = JSON.parse(Buffer.from(match[1], "base64").toString())
  if (!PERMISSION.OWNERS.includes(user.id)) {
    return res.status(403).end()
  }

  const length = 5 + Math.floor(Math.random() * 6)
  const code = Math.random().toString(36).substring(2, 2 + length).toUpperCase()
  const expire = Date.now() + 1000 * 60 * 60

  codes[code] = expire

  res.json({ code, expire })
}

export function validateCode(code) {
  return codes[code] && Date.now() < codes[code]
}
