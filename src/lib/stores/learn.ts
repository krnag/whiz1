import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { Disciplines, Lesson, SubjectIndex, Topic } from "src/types";

export const disciplines: Writable<Disciplines> = writable([]);
export const subjectStore: Writable<SubjectIndex> = writable([]);
export const topicStore: Writable<{ [key: string]: Topic }> = writable({});
export const lessonStore: Writable<{ [key: string]: Lesson }> = writable({});

