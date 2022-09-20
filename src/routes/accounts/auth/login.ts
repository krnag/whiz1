import bcrypt from "bcryptjs";
import db from '$lib/db';
import jwt from "jsonwebtoken";
import { secret } from "$lib/helpers";

export async function post({ request }) {
  const auth = await request.json();
  const authId = auth.email ? auth.email.trim().toLowerCase() : auth.username.trim().toLowerCase();

  const user = db.prepare(`SELECT * FROM users WHERE ${auth.email ? 'email' : 'username'} = ?;`)
    .get(authId);
  if (!user) return { status: 400 };
  if (!user) return { status: 401 };

  const verified = await bcrypt.compare(auth.password, user.password);
  if (verified) {
    let creds = <any>{ usr: user.username };
    if (user.is_admin) creds.role = "admin";
    else if (user.is_staff) creds.role = "staff";
    const token = jwt.sign(creds, secret, { expiresIn: 2592000 });
      // update last login time
    const now = Math.round(Date.now() / 1000);
    db.prepare("UPDATE users SET last_login = ? WHERE username = ?;").run(now, user.username);
    creds.avatar = user.has_avatar;
    creds.progress = {};
    const stmt = db.prepare("SELECT * FROM topic_progress WHERE user_id = ?;");
    for (const rec of stmt.iterate(user.id)) {
      creds.progress[rec.topic_id] = { progress: rec.progress, score: rec.score, viewed: rec.last_view, recordId: rec.id };
    }
    creds.id = user.id;

    return { 
      headers: { "Set-Cookie" : `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict` },
      body: creds
    };
  } else {
    return { status: 400 };
  }
}

