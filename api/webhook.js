import { WEBHOOK_URL } from "../config.js"

export async function sendLog(user, file, category) {
  if (!WEBHOOK_URL) return

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Lua Logger",
      embeds: [{
        title: "Lua Script Downloaded",
        color: 3447003,
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        },
        fields: [
          { name: "User", value: user.username, inline: true },
          { name: "Discord ID", value: user.id, inline: true },
          { name: "Category", value: category, inline: true },
          { name: "File", value: file }
        ],
        timestamp: new Date()
      }]
    })
  })
}
