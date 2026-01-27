import redis from "@/lib/redis"
import { getSession } from "@/lib/auth"

export default async function handler(req, res) {
  const me = await getSession(req)

  if (!me || !OWNER_IDS.includes(me.id)) {
    return res.status(403).json({ error: "forbidden" })
  }

  const keys = await redis.keys("security:*")
  const list = []

  for (const k of keys) {
    const data = JSON.parse(await redis.get(k))
    list.push(data)
  }

  res.json(list)
}
