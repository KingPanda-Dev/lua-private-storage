import { redis } from "../../lib/redis.js";

export default async function handler(req, res) {
  const { code } = req.body || {};

  if (!code || !/^[A-Z]{6}$/.test(code)) {
    return res.status(400).json({ error: "invalid_format" });
  }

  const exists = await redis.get(`security:code:${code}`);

  if (!exists) {
    return res.status(401).json({ error: "invalid_or_expired" });
  }

  // optional: hapus biar 1x pakai
  await redis.del(`security:code:${code}`);

  res.json({ ok: true });
}
