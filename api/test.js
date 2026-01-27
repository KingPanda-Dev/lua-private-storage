import { getRedis } from "../lib/redis.js";

export default async function handler(req, res) {
  const redis = await getRedis();

  await redis.set("hello", "world");
  const data = await redis.get("hello");

  res.json({ data });
}
