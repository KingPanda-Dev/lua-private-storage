import { GITHUB } from "../config.js";
import { validateCode } from "./generate-code.js";
import { sendLog } from "./webhook.js";

function parseOwnerIds() {
  const raw = process.env.OWNER_DISCORD_IDS || "";
  return raw.split(",").map(x => x.trim()).filter(Boolean);
}

function parseAllowedIds() {
  const raw = process.env.ALLOWED_DISCORD_IDS || "";
  return raw.split(",").map(x => x.trim()).filter(Boolean);
}

function getSessionUser(req){
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  return JSON.parse(Buffer.from(match[1], "base64").toString());
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Not logged in" });

  const owners = parseOwnerIds();
  const allowed = parseAllowedIds();
  const isOwner = owners.includes(user.id);
  const isAllowed = isOwner || allowed.includes(user.id);

  if (!isAllowed) {
    return res.status(403).json({ error: "No permission" });
  }

  const { file, code, category } = req.body || {};

  if (!file || !code || !category) {
    return res.status(400).json({ error: "Missing file/code/category" });
  }

  if (!validateCode(code)) {
    return res.status(403).json({ error: "Code invalid or expired" });
  }

  const url = `https://raw.githubusercontent.com/${GITHUB.OWNER}/${GITHUB.REPO}/${GITHUB.BRANCH}/${file}`;

  const r = await fetch(url, {
    headers: { Authorization: `token ${GITHUB.TOKEN}` }
  });

  if (!r.ok) return res.status(404).json({ error: "File not found" });

  const data = await r.text();

  res.setHeader("Content-Disposition", `attachment; filename=${file.split("/").pop()}`);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(data);

  // webhook log
  sendLog(user, file, category);
}
