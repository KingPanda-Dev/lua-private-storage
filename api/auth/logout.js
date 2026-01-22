export default function handler(req, res) {
  res.setHeader("Set-Cookie", [
    "session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure"
  ])
  res.status(200).json({ success: true })
}
