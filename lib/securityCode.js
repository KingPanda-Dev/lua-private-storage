import crypto from "crypto"
import redis from "./redis.js"

export async function generateSecurityCode(script) {
  const code = crypto
    .randomBytes(4)
    .toString("base64")
    .replace(/[^A-Z]/g, "")
    .slice(0, 6)

  const key = `security:${code}`

  await redis.set(
    key,
    JSON.stringify({
      code,
      script,
      used: false,
      createdAt: Date.now(),
    }),
    "EX",
    3600
  )

  return code
}
