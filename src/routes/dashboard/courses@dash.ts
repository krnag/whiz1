import { updateDiscipline, updateSubject, updateTopic } from "$lib/json/subjects"

export async function get({locals}) {
  if (locals.role === "admin") return {status: 200 }
  return {status: 404 };
};

export async function patch({ locals, request }) {
  if (locals.role === "admin") {
    let data = await request.json();
    if (data.type === "discipline") {
      const msg = updateDiscipline(data.id, data.name, data.remove);
      return { body: { msg } }
    } else if (data.type === "subject") {
      const msg = updateSubject(data.disc, data.id, data.name, data.remove, data.position);
      return { body: { msg } }
    } else if (data.type === "topic") {
      const msg = updateTopic(data.subject, data.id, data.name, data.remove, data.position);
      return { body: { msg } };
    }
  }
};
