import { updateLesson, updateLessonInfo, publishLesson } from "$lib/json/lessons";
import type { ResponseMessage } from "src/types";

export async function post({ locals, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    const data = await request.json();
    const msg = updateLessonInfo(data.topic, data.id, data.title, data.remove, data.position);
    return {
      body: { msg }
    }
  }
}

export async function put({ locals, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    const data = await request.json();
    let msg: ResponseMessage;
    msg = updateLesson(data.id, data.payload);
    return { body: { msg } };
  }
}

// publish lesson
export async function patch({ locals, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    const data = await request.json();
    let msg: ResponseMessage;
    msg = publishLesson(data.id, data.topicId);
    return { body: { msg } };
  }
}

