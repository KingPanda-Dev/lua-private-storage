export const DISCORD = {
  CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  REDIRECT_URI: process.env.DISCORD_REDIRECT_URI
}

export const PERMISSION = {
  OWNERS: [
    "675212142701576234"
  ],
  ALLOWED_USERS: [
    "675212142701576234", "813668754084986930"
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
  OWNER: "KingPanda-Dev",
  REPO: "secret-script",
  BRANCH: "main",
  TOKEN: process.env.GH_TOKEN
}

export const WEBHOOK_URL = "https://discord.com/api/webhooks/1329658461910204457/MH5vyt1KeG3EoTamuBhOmWWp0OdxfrFGTCCguyopoz2HTur20nqwl4a3ksiw7oEr_JaS"
