export default function handler(req, res) {
  const owners = (process.env.OWNER_DISCORD_IDS || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)

  const allowed = (process.env.ALLOWED_DISCORD_IDS || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)

  res.json({ owners, allowed })
}
