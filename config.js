export const DISCORD = {
  CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  REDIRECT_URI: process.env.DISCORD_REDIRECT_URI
}

export const PERMISSION = {
  OWNERS: [
    "ISI_DISCORD_ID_KAMU"
  ],
  ALLOWED_USERS: [
    "ISI_DISCORD_ID_KAMU"
  ]
}

export const SCRIPT_CATEGORIES = {
  growpai: {
    name: "GrowPai Lua",
    files: ["growpai.lua"]
  },
  growlauncher: {
    name: "GrowLauncher Lua",
    files: ["growlauncher.lua"]
  }
}

export const GITHUB = {
  OWNER: "USERNAME_GITHUB",
  REPO: "lua-private-storage",
  BRANCH: "main",
  TOKEN: process.env.GH_TOKEN
}

export const WEBHOOK_URL = ""
