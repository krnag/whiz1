import db from "$lib/db";
import { makeId, now } from "$lib/helpers";

export function get({ locals }) {
  return {
    body: { hasToken: locals.hasToken }
  }
};

export async function post({ request }) {
  const {type, data} = await request.json();
  const email = db.prepare(`SELECT * FROM users WHERE ${type} = ?`).get(data);
  if (email) {
    const code = makeId() + makeId();
    //send email with code
    // If sent create record in db
    db.prepare("INSERT INTO reset_pw VALUES (?, ?, ?)").get(code, email, now());
    return { status: 200 }
  }
};

