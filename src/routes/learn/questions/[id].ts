import db from '$lib/db';

export async function get({ params }) {
    const q = db.prepare("SELECT * FROM questions WHERE id = ?;").get(params.id);
    return { body: q };
};

