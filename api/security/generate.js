import { redis } from "../../lib/redis.js";

const OWNER_ID = process.env.OWNER_DISCORD_IDS || ""; // nanti bisa dari env

function genCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default async function handler(req, res) {
  const { ownerId } = req.query;

  if (ownerId !== OWNER_ID) {
    return res.status(403).json({ error: "forbidden" });
  }

  const code = genCode();

  await redis.set(
    `security:code:${code}`,
    "valid",
    { ex: 60 * 60 } // 1 jam
  );

  res.json({
    code,
    expires_in: "1 hour"
  });
}
