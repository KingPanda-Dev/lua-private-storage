import { DISCORD, PERMISSION } from "../../config.js"

export default async function handler(req, res) {
  const code = new URL(req.url, `http://${req.headers.host}`).searchParams.get("code")

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD.CLIENT_ID,
      client_secret: DISCORD.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD.REDIRECT_URI
    })
  })

  const token = await tokenRes.json()

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  })

  const user = await userRes.json()

  res.setHeader(
    "Set-Cookie",
    `session=${Buffer.from(JSON.stringify(user)).toString("base64")}; Path=/; HttpOnly`
  )

  if (!PERMISSION.ALLOWED_USERS.includes(user.id)) {
    res.writeHead(302, { Location: "/public/no-access.html" })
    return res.end()
  }

  res.writeHead(302, { Location: "/dashboard" })
  res.end()
}
