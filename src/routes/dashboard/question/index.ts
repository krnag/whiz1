import db from '$lib/db';
import { existsSync, rm } from "fs";

export async function put({ locals, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    let question = (await request.json()).question;
    question.cover = Number(question.cover);
    question.has_images = Number(question.has_images);
    db.prepare(`REPLACE INTO questions VALUES (@id, @subject_id, @topic_id, @lesson_id, @page_id,
      @question, @choices, @explanation, @cover, @has_images, @difficulty, @edited, @published);`).run(question);
    db.prepare(`REPLACE INTO question_md VALUES (@id, @q_md, @c_md, @e_md);`).run(question);
    return { status: 200 };
  }
  return { status: 401 }
}

export async function del({ locals, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    let id = (await request.json()).id;
    db.prepare('DELETE FROM questions WHERE id = ?;').run(id);
    db.prepare('DELETE FROM question_md WHERE id = ?;').run(id);
    const IMG_DIR = "static/images/quiz/" + id;
    if (existsSync(IMG_DIR))
    rm(IMG_DIR, { recursive: true }, (err) => {
    });
    return { status: 200 };
  }
  return { status: 401 }
}
