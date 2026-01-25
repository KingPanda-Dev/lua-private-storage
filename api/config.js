export default function handler(req, res) {
  // Jangan bocorin semua env ya, hanya yang aman aja
  res.json({
    ownerIds: (process.env.OWNER_DISCORD_IDS || "")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean)
  })
}
