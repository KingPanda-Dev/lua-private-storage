function parseOwnerIds() {
  const raw = process.env.OWNER_DISCORD_IDS || "";
  return raw.split(",").map(x => x.trim()).filter(Boolean);
}

function parseAllowedIds() {
  const raw = process.env.ALLOWED_DISCORD_IDS || "";
  return raw.split(",").map(x => x.trim()).filter(Boolean);
}

export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/session=([^;]+)/);

  if (!match) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const user = JSON.parse(Buffer.from(match[1], "base64").toString());

  const owners = parseOwnerIds();
  const allowed = parseAllowedIds();

  const isOwner = owners.includes(user.id);
  const isAllowed = isOwner || allowed.includes(user.id);

  res.json({
    ...user,
    isOwner,
    isAllowed
  });
}
