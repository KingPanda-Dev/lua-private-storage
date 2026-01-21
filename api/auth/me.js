export default function handler(req, res) {
  const cookie = req.headers.cookie || ""
  const match = cookie.match(/session=([^;]+)/)

  if (!match) {
    return res.status(401).json({ error: "Not logged in" })
  }

  const user = JSON.parse(
    Buffer.from(match[1], "base64").toString()
  )

  res.json(user)
}
