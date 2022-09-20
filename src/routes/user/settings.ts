import db from '$lib/db';

export function get({ locals }) {
  const user = db.prepare("SELECT username, email, has_avatar FROM users WHERE username = ?;").get(locals.username);
  return {
    body: user
  }
};
