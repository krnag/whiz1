import db from '$lib/db';

export function get({ locals, params }) {
  if (locals.role === "admin") {
    const questions = db.prepare("SELECT * FROM questions ORDER BY edited DESC LIMIT 20").all();
    return { body: { questions } };
  }
  return {status: 404};
};
