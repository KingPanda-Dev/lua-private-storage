// api/test.js
import { redis } from "../lib/redis.js";

export default async function handler(req, res) {
  await redis.set("ping", "pong");
  const v = await redis.get("ping");
  res.json({ ok: true, v });
}
