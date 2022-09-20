import bcrypt from "bcryptjs";
import db from '$lib/db';
import jwt from "jsonwebtoken";
import { secret } from "$lib/helpers";


export async function post({ request }) {
  const user = await request.json();
  user.username = user.username.trim().toLowerCase();
  user.email = user.email.trim().toLowerCase();
  // Create new user
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);
  const now = Math.round(Date.now() / 1000);
  const id = salt.slice(-10);
  try {
    db.prepare("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, 0, 0, 0, 1);")
      .run(id, user.username, user.email, hash, now, now);
    const token = jwt.sign({ user: user.username }, secret, { expiresIn: 2592000 });
    return { // Set cookie, send username
      headers: { "Set-Cookie" : `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict` },
      body: { username: user.username, avatar: false }
    };
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        status: 409,
        body: { error: error.toString().split(".")[1] }
      };
    }
  }
}

export async function patch({ params }) {
  const email = db.prepare("SELECT email FROM reset_pw WHERE code = ?").get(params.code);
  if (email) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(params.password, salt);
    db.prepare("DELETE FROM reset_pw WHERE code = ?").get(params.code);
    db.prepare("UPDATE users SET password = ? WHERE email = ?;").run(hash, email);
  }
  return { status: 302, headers: {location: "/accounts/login"} }
};

