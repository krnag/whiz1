import db from '$lib/db';

export function get({ locals }) {
  if (locals.role === "admin") {
    const articles = db.prepare('SELECT * FROM articles;').all();
    return {
      body: { articles }
    };
  }
  return {status: 404};
};
