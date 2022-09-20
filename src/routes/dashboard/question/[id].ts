import db from '$lib/db';

export async function get({ params }) {
  const md = db.prepare("SELECT * FROM question_md WHERE id = ?;").get(params.id);
  return { body: md };
};
