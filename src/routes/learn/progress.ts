import { makeId, now } from '$lib/helpers';
import db from '$lib/db';

export async function post({ request }) {
  let lessonProgress = {};
  const data = await request.json();
  if (data.hasOwnProperty("score")) {
    if (data.hasOwnProperty("lessonId")) {// Add Lesson Score
      let recordId:string;
      if (data.recordId) {
        if (data.progress) db.prepare('UPDATE lesson_progress SET score = ?, progress = ? WHERE id = ?;')
          .run(data.score, data.progress, data.recordId);
        else db.prepare('UPDATE lesson_progress SET score = ? WHERE id = ?;').run(data.score, data.recordId);
      } else {
        recordId = makeId();
        db.prepare("INSERT INTO lesson_progress (id, user_id, topic_id, lesson_id, score, progress) VALUES(?,?,?,?,?,?);")
          .run(recordId, data.user, data.topicId, data.lessonId, data.score, data.progress || '');
        if (!data.topicRecordId) {// Create topic_progress record
          const topicRecordId = makeId(), dt = now(), tProgress = data.score >= 80 ? 1 : 0;
          db.prepare('INSERT INTO topic_progress VALUES(?,?,?,?,0,?,?);')
            .run(topicRecordId, data.user, data.topicId, tProgress, dt, dt);
          return { body: {recordId, topicRecordId, tProgress } };
        }
      }
      if (data.tProgress) {// Update topic_progress record
        db.prepare('UPDATE topic_progress SET progress = ? WHERE id = ?;').run(data.tProgress, data.topicRecordId);
      }
      if (recordId) return { body: {recordId} };

    } else {// Add Topic Score
    }
  } else if (data.hasOwnProperty("progress")) {// Add page progress
    if (data.recordId) {
      db.prepare('UPDATE lesson_progress SET progress = ? WHERE id = ?;').run(data.progress.toString(), data.recordId);
    } else {
      const recordId = makeId(11);
      db.prepare('INSERT INTO lesson_progress VALUES(?,?,?,?,0,?);')
        .run(recordId, data.user, data.topicId, data.lessonId, data.progress);
      if (!data.topicRecordId) {// Create topic_progress record
        const topicRecordId = makeId(), dt = now();
        db.prepare('INSERT INTO topic_progress VALUES(?,?,?,0,0,?,?);')
        .run(topicRecordId, data.user, data.topicId, dt, dt);
        return { body: {recordId, topicRecordId} };
      }
      return { body: {recordId} };
    }

  } else {// Get lesson progress
    const stmt = db.prepare('SELECT * FROM lesson_progress where user_id = ? AND topic_id = ?;');
    for ( const rec of stmt.iterate(data.user, data.topicId) ) {
      lessonProgress[rec.lesson_id] = {score: rec.score, progress: rec.progress.split(','), recordId: rec.id};
    }
    return {body: lessonProgress}
  }
  return { status: 200 };
}

