import { DISCORD } from "../../config.js"

export default function handler(req, res) {
  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${DISCORD.CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DISCORD.REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify email`

  res.writeHead(302, { Location: url })
  res.end()
}
