import db from '$lib/db';

export function get() {
  const articles = db.prepare('SELECT * FROM articles;').all()
  return {
    body: { articles }
  }
}
