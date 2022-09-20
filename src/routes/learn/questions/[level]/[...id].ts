import db from '$lib/db';

export async function get({ params }) {
  const [id, n, d] = params.id.split('/');
  if (!n) {
    const sql = `SELECT * FROM questions WHERE ${params.level}_id = ?;`
    const questions = db.prepare(sql).all(id);
    return { body: { questions } };
  } else if (!d) {
    const sql = `SELECT * FROM questions WHERE ${params.level}_id = ? ORDER BY RANDOM() LIMIT ?;`
    const questions = db.prepare(sql).all(id, n);
    return { body: { questions } };
  } else {
    const sql = `SELECT * FROM questions WHERE ${params.level}_id = ? AND difficulty >= ? ORDER BY RANDOM() LIMIT ?;`
    const questions = db.prepare(sql).all(id, d, n);
    return { body: { questions } };
  }
};
