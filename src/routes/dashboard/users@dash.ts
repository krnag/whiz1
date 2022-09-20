import db from '$lib/db';

export function get({ locals }) {
  if (locals.role === "admin") {
    const users = db.prepare('SELECT * FROM users;').all()
    return {
      body: { users }
    };
  }
  return {status: 404 };
};
