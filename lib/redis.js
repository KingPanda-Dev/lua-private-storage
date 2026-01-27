import { createClient } from "redis";

let redis;

if (!global.redis) { 
  global.redis = createClient({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
  });

  global.redis.on("error", (err) =>
    console.error("Redis Error", err)
  );
}

redis = global.redis;

export async function getRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}
