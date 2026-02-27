import express from "express";
import { randomUUID } from "node:crypto";
import { ensureSeedData, readDb, writeDb } from "./data/store.js";
import { sendError } from "./utils/http.js";

const app = express();
ensureSeedData();
app.use(express.json({ limit: "15mb" }));
const MAX_ACTIVITY_COUNT = 500;

const toPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

const appendActivity = (db, entry) => {
  if (!Array.isArray(db.activities)) db.activities = [];
  db.activities.push({
    id: randomUUID(),
    scope: entry.scope,
    type: entry.type,
    message: entry.message,
    actorRole: entry.actorRole || "system",
    actor: entry.actor || "system",
    severity: entry.severity || "info",
    createdAt: new Date().toISOString(),
  });
  if (db.activities.length > MAX_ACTIVITY_COUNT) {
    db.activities = db.activities.slice(-MAX_ACTIVITY_COUNT);
  }
};

const getRecentActivities = (activities, predicate, limit = 30) =>
  [...(Array.isArray(activities) ? activities : [])]
    .filter(predicate)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "GameCloud backend is running",
    health: "/api/health",
  });
});

app.post("/api/auth/register", (req, res) => {
  const { username, email, password, role = "user" } = req.body;
  if (!username || !email || !password) {
    return sendError(res, 400, "username, email, and password are required");
  }

  const db = readDb();
  const usernameTaken = db.users.some(
    (user) => user.username.toLowerCase() === String(username).toLowerCase()
  );
  const emailTaken = db.users.some(
    (user) => user.email.toLowerCase() === String(email).toLowerCase()
  );

  if (usernameTaken) return sendError(res, 409, "username already exists");
  if (emailTaken) return sendError(res, 409, "email already exists");

  const user = {
    id: randomUUID(),
    username: String(username).trim(),
    email: String(email).trim(),
    password: String(password),
    role: ["user", "employee", "manager"].includes(role) ? role : "user",
    status: "Active",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);
  return res.status(201).json({ user: toPublicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return sendError(res, 400, "username and password are required");
  }

  const db = readDb();
  const user = db.users.find(
    (candidate) =>
      candidate.username.toLowerCase() === String(username).toLowerCase() &&
      candidate.password === String(password)
  );

  if (!user) {
    const usernameMatch = db.users.find(
      (candidate) =>
        candidate.username.toLowerCase() === String(username).toLowerCase()
    );
    const isStaffUsername = usernameMatch && ["employee", "manager"].includes(usernameMatch.role);
    if (role === "employee" || isStaffUsername) {
      appendActivity(db, {
        scope: "security",
        type: "unauthorized_staff_login",
        message: `Unauthorized staff login attempt for "${String(username)}" (invalid credentials).`,
        actorRole: isStaffUsername ? usernameMatch.role : "unknown",
        actor: String(username),
        severity: "warn",
      });
      writeDb(db);
    }
    return sendError(res, 401, "invalid credentials");
  }
  if (user.status === "Banned") return sendError(res, 403, "user is banned");
  const isStaffLogin = role === "employee";
  const isAllowedStaffRole = ["employee", "manager"].includes(user.role);
  const roleMismatch = isStaffLogin ? !isAllowedStaffRole : role && user.role !== role;
  if (roleMismatch) {
    if (isStaffLogin) {
      appendActivity(db, {
        scope: "security",
        type: "unauthorized_staff_login",
        message: `Unauthorized staff portal login blocked for "${user.username}" (registered as ${user.role}).`,
        actorRole: user.role,
        actor: user.username,
        severity: "warn",
      });
      writeDb(db);
    }
    return sendError(res, 403, `this account is registered as ${user.role}`);
  }

  if (user.role === "user") {
    appendActivity(db, {
      scope: "gamer",
      type: "user_login",
      message: `User "${user.username}" logged in.`,
      actorRole: "user",
      actor: user.username,
      severity: "info",
    });
    writeDb(db);
  }

  return res.json({ user: toPublicUser(user) });
});

app.get("/api/achievements", (req, res) => {
  const { userId, status = "all" } = req.query;
  const db = readDb();

  let items = [...db.achievements];
  if (userId) items = items.filter((item) => item.userId === userId);
  if (status === "verified") items = items.filter((item) => item.verified);
  if (status === "pending") items = items.filter((item) => !item.verified);

  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ achievements: items });
});

app.post("/api/achievements", (req, res) => {
  const { userId, title, description, proofFileName = "", proofDataUrl = "" } = req.body;
  if (!userId || !description) {
    return sendError(res, 400, "userId and description are required");
  }

  if (proofDataUrl && !String(proofDataUrl).startsWith("data:image/")) {
    return sendError(res, 400, "proofDataUrl must be an image data URL");
  }

  const db = readDb();
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) return sendError(res, 404, "user not found");

  const achievement = {
    id: randomUUID(),
    userId,
    username: user.username,
    title: title || "Achievement Submission",
    description,
    proofFileName,
    proofDataUrl,
    date: new Date().toISOString(),
    verified: false,
    points: 0,
    status: "Pending",
  };

  db.achievements.push(achievement);
  appendActivity(db, {
    scope: "gamer",
    type: proofDataUrl ? "user_proof_uploaded" : "user_achievement_submitted",
    message: proofDataUrl
      ? `User "${user.username}" uploaded a score proof.`
      : `User "${user.username}" submitted an achievement.`,
    actorRole: "user",
    actor: user.username,
    severity: "info",
  });
  writeDb(db);
  res.status(201).json({ achievement });
});

app.get("/api/scores", (req, res) => {
  const { userId } = req.query;
  const db = readDb();
  const scores = userId ? db.scores.filter((item) => item.userId === userId) : db.scores;
  scores.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ scores });
});

app.post("/api/scores", (req, res) => {
  const { userId, game, score, date } = req.body;
  if (!userId || !game || !score || !date) {
    return sendError(res, 400, "userId, game, score, and date are required");
  }

  const db = readDb();
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) return sendError(res, 404, "user not found");

  const scoreEntry = {
    id: randomUUID(),
    userId,
    username: user.username,
    game: String(game),
    score: String(score),
    numericScore: Number.parseInt(String(score).replace(/\D/g, ""), 10) || 0,
    date: new Date(date).toISOString(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  db.scores.push(scoreEntry);
  appendActivity(db, {
    scope: "gamer",
    type: "user_score_submitted",
    message: `User "${user.username}" submitted a score for ${scoreEntry.game}.`,
    actorRole: "user",
    actor: user.username,
    severity: "info",
  });
  writeDb(db);
  res.status(201).json({ score: scoreEntry });
});

app.get("/api/leaderboard", (req, res) => {
  const { game = "Global" } = req.query;
  const db = readDb();

  const scorePool =
    game === "Global" ? db.scores : db.scores.filter((item) => item.game === game);

  const grouped = new Map();
  for (const score of scorePool) {
    const current = grouped.get(score.userId) || {
      userId: score.userId,
      name: score.username,
      score: 0,
      game: game === "Global" ? "Global" : score.game,
    };
    current.score += score.numericScore;
    grouped.set(score.userId, current);
  }

  const leaderboard = [...grouped.values()]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      score: entry.score.toLocaleString(),
      game: entry.game,
      change: "same",
    }));

  res.json({ players: leaderboard });
});

app.get("/api/tournaments", (_req, res) => {
  const db = readDb();
  const tournaments = db.tournaments
    .map((entry) => ({
      ...entry,
      registered: entry.registeredUserIds.length,
    }))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  res.json({ tournaments });
});

app.post("/api/tournaments", (req, res) => {
  const {
    name,
    game,
    minRank = "",
    maxPlayers = 0,
    startDate,
    actor = "staff",
    actorRole = "employee",
  } = req.body;
  if (!name || !game || !startDate) {
    return sendError(res, 400, "name, game, and startDate are required");
  }

  const db = readDb();
  const tournament = {
    id: randomUUID(),
    name: String(name),
    game: String(game),
    minRank: String(minRank),
    maxPlayers: Number(maxPlayers) || 0,
    registeredUserIds: [],
    startDate: new Date(startDate).toISOString(),
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  db.tournaments.push(tournament);
  appendActivity(db, {
    scope: "staff_management",
    type: "tournament_created",
    message: `${actor} created tournament "${tournament.name}".`,
    actorRole,
    actor,
    severity: "info",
  });
  writeDb(db);
  res.status(201).json({ tournament });
});

app.post("/api/tournaments/:id/register", (req, res) => {
  const { userId } = req.body;
  if (!userId) return sendError(res, 400, "userId is required");

  const db = readDb();
  const tournament = db.tournaments.find((entry) => entry.id === req.params.id);
  if (!tournament) return sendError(res, 404, "tournament not found");
  if (tournament.registeredUserIds.includes(userId)) {
    return sendError(res, 409, "already registered");
  }
  if (tournament.maxPlayers > 0 && tournament.registeredUserIds.length >= tournament.maxPlayers) {
    return sendError(res, 409, "tournament is full");
  }

  tournament.registeredUserIds.push(userId);
  writeDb(db);
  res.json({ message: "registered", tournamentId: tournament.id });
});

app.delete("/api/tournaments/:id", (req, res) => {
  const { actorRole, actor = "staff" } = req.body ?? {};
  if (!["employee", "manager"].includes(actorRole)) {
    return sendError(res, 403, "only employee or manager can remove tournaments");
  }

  const db = readDb();
  const targetIndex = db.tournaments.findIndex((entry) => entry.id === req.params.id);
  if (targetIndex === -1) return sendError(res, 404, "tournament not found");

  const [removedTournament] = db.tournaments.splice(targetIndex, 1);
  appendActivity(db, {
    scope: "staff_management",
    type: "tournament_removed",
    message: `${actor} removed tournament "${removedTournament.name}".`,
    actorRole,
    actor,
    severity: "warn",
  });
  writeDb(db);
  res.json({ message: "tournament removed", tournament: removedTournament });
});

app.patch("/api/tournaments/:id", (req, res) => {
  const {
    actorRole,
    actor = "staff",
    name,
    game,
    minRank = "",
    maxPlayers = 0,
    startDate,
    status = "Open",
  } = req.body ?? {};

  if (!["employee", "manager"].includes(actorRole)) {
    return sendError(res, 403, "only employee or manager can edit tournaments");
  }
  if (!name || !game || !startDate) {
    return sendError(res, 400, "name, game, and startDate are required");
  }

  const db = readDb();
  const tournament = db.tournaments.find((entry) => entry.id === req.params.id);
  if (!tournament) return sendError(res, 404, "tournament not found");

  tournament.name = String(name);
  tournament.game = String(game);
  tournament.minRank = String(minRank);
  tournament.maxPlayers = Math.max(0, Number(maxPlayers) || 0);
  tournament.startDate = new Date(startDate).toISOString();
  tournament.status = status === "Closed" ? "Closed" : "Open";

  appendActivity(db, {
    scope: "staff_management",
    type: "tournament_updated",
    message: `${actor} updated tournament "${tournament.name}".`,
    actorRole,
    actor,
    severity: "info",
  });
  writeDb(db);
  return res.json({
    message: "tournament updated",
    tournament: {
      ...tournament,
      registered: tournament.registeredUserIds.length,
    },
  });
});

app.get("/api/verifications", (_req, res) => {
  const db = readDb();
  const verifications = db.achievements
    .filter((entry) => !entry.verified)
    .map((entry) => ({
      id: entry.id,
      user: entry.username,
      game: "N/A",
      proof: entry.proofFileName || "proof-not-provided",
      hasProof: Boolean(entry.proofDataUrl),
      status: entry.status,
    }));
  res.json({ verifications });
});

app.get("/api/verifications/achievements/:id/proof", (req, res) => {
  const db = readDb();
  const achievement = db.achievements.find((entry) => entry.id === req.params.id);
  if (!achievement) return sendError(res, 404, "achievement not found");
  if (!achievement.proofDataUrl) return sendError(res, 404, "proof image not found");

  return res.json({
    proofFileName: achievement.proofFileName || "proof-image",
    proofDataUrl: achievement.proofDataUrl,
  });
});

app.patch("/api/verifications/achievements/:id", (req, res) => {
  const { approved, points = 0 } = req.body;
  if (typeof approved !== "boolean") {
    return sendError(res, 400, "approved must be boolean");
  }

  const db = readDb();
  const achievement = db.achievements.find((entry) => entry.id === req.params.id);
  if (!achievement) return sendError(res, 404, "achievement not found");

  achievement.verified = approved;
  achievement.status = approved ? "Verified" : "Rejected";
  achievement.points = approved ? Number(points) || 100 : 0;
  writeDb(db);
  res.json({ achievement });
});

app.get("/api/users", (_req, res) => {
  const db = readDb();
  const users = db.users.map((user) => ({
    id: user.id,
    name: user.username,
    role: user.role[0].toUpperCase() + user.role.slice(1),
    status: user.status,
    login: "recently",
  }));
  res.json({ users });
});

app.patch("/api/users/:id/status", (req, res) => {
  const { status, actor = "manager", actorRole = "manager" } = req.body;
  if (!["Active", "Banned"].includes(status)) {
    return sendError(res, 400, 'status must be "Active" or "Banned"');
  }

  const db = readDb();
  const user = db.users.find((entry) => entry.id === req.params.id);
  if (!user) return sendError(res, 404, "user not found");

  user.status = status;
  appendActivity(db, {
    scope: "staff_management",
    type: "staff_status_changed",
    message: `${actor} changed status of "${user.username}" to ${status}.`,
    actorRole,
    actor,
    severity: status === "Banned" ? "warn" : "info",
  });
  writeDb(db);
  res.json({ user: toPublicUser(user) });
});

app.patch("/api/users/:id/role", (req, res) => {
  const { role, actor = "manager", actorRole = "manager" } = req.body;
  const normalizedRole = String(role || "").toLowerCase();
  if (!["user", "employee", "manager"].includes(normalizedRole)) {
    return sendError(res, 400, 'role must be "user", "employee", or "manager"');
  }

  const db = readDb();
  const targetUser = db.users.find((entry) => entry.id === req.params.id);
  if (!targetUser) return sendError(res, 404, "user not found");

  targetUser.role = normalizedRole;
  appendActivity(db, {
    scope: "staff_management",
    type: "staff_role_changed",
    message: `${actor} changed role of "${targetUser.username}" to ${normalizedRole}.`,
    actorRole,
    actor,
    severity: "info",
  });
  writeDb(db);
  res.json({ user: toPublicUser(targetUser) });
});

app.get("/api/feed/manager", (req, res) => {
  const { kind = "all" } = req.query;
  const db = readDb();
  const activities = getRecentActivities(db.activities, (entry) => {
    if (!["security", "staff_management"].includes(entry.scope)) return false;
    if (kind === "security") return entry.scope === "security";
    if (kind === "staff") return entry.scope === "staff_management";
    return true;
  });
  res.json({ activities });
});

app.get("/api/feed/employee", (req, res) => {
  const { kind = "all" } = req.query;
  const db = readDb();
  const activities = getRecentActivities(db.activities, (entry) => {
    if (entry.scope !== "gamer") return false;
    if (kind === "logins") return entry.type === "user_login";
    if (kind === "proofs") return entry.type === "user_proof_uploaded";
    return true;
  });
  res.json({ activities });
});

app.get("/api/stats/system", (_req, res) => {
  const db = readDb();
  const activeUsers = db.users.filter((user) => user.status === "Active").length;
  const activeGames = new Set(db.scores.map((score) => score.game)).size;
  const securityAlerts = (Array.isArray(db.activities) ? db.activities : []).filter(
    (entry) => entry.scope === "security" && entry.severity === "warn"
  ).length;
  res.json({
    stats: {
      totalUsers: db.users.length,
      activeUsers,
      activeGames,
      systemLoad: "42%",
      securityAlerts,
    },
  });
});

app.use((_req, res) => {
  sendError(res, 404, "route not found");
});

export default app;
