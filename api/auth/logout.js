export default function handler(req, res) {
  const cookies = [
    // normal
    "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    // secure (vercel https)
    "session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0",
    // sameSite none (kadang dipakai oauth)
    "session=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0",
    // path root & dashboard (jaga-jaga)
    "session=; Path=/dashboard; HttpOnly; SameSite=Lax; Max-Age=0",
    "session=; Path=/dashboard; HttpOnly; SameSite=Lax; Secure; Max-Age=0",
  ]

  res.setHeader("Set-Cookie", cookies)
  return res.status(200).json({ ok: true })
}
