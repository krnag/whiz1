import { readFileSync, existsSync, unlinkSync, writeFileSync, rm } from "fs";
import { makeId, now } from "../helpers";
import type { BlockContent, Graph, Lesson, Param, Topic, ResponseMessage } from "../../types";

//const DIR = "./static/courses/";
const SUBJECT = "./static/courses/subjects.json";
const TOPIC_DIR = "./static/courses/topics/";
const LESSON_DRAFT_DIR = "./static/courses/lessons/drafts/";
const LESSON_PUB_DIR = "./static/courses/lessons/published/";
const IMG_DIR = "./static/images/lessons/";


export function updateLessonInfo(topic: string, id: string, title: string, remove=false, position: number): ResponseMessage {
  const TOPIC_FILE = TOPIC_DIR + topic + ".json";
  const LESSON_FILE = LESSON_DRAFT_DIR + id + ".json";
  const rawdata = readFileSync(TOPIC_FILE, "utf8");
  let data: Topic = JSON.parse(rawdata);
  const edited = now();

  if (remove) {
    for (let i = data.lessons.length - 1; i > -1; i--) {
      if (data.lessons[i].id === id) {
        data.lessons.splice(i, 1);
        writeFileSync(TOPIC_FILE, JSON.stringify(data));
        if (existsSync(LESSON_FILE)) unlinkSync(LESSON_FILE);
        rm(IMG_DIR + id, { recursive: true }, (err) => {
          if (err) console.log(err);
        });
        return { success: `Lesson ${title} has been <b>deleted</b>` };
      }
    }
    return { error: `Lesson ${title} not found.` };
    
  } else if (position) {
    const from = data.lessons.findIndex(l => l.id === id);
    data.lessons.splice(from+position, 0, data.lessons.splice(from, 1)[0]);
    writeFileSync(TOPIC_FILE, JSON.stringify(data));
    return { success: `Lesson ${title} has been <b>moved</b>` };
  }
    
  for (let i = data.lessons.length - 1; i > -1; i--) {
    if (data.lessons[i].id === id) {
      data.lessons[i].title = title;
      //data.lessons[i].edited = now();
      writeFileSync(TOPIC_FILE, JSON.stringify(data));
      // WRITE TO LESSON_FILE
      const rawLesson = readFileSync(LESSON_FILE, "utf8");
      let lessonData: Lesson = JSON.parse(rawLesson);
      lessonData.title = title;
      writeFileSync(LESSON_FILE, JSON.stringify(lessonData));
      return { success: `Lesson title has been changed to <b>${title}</b>.` };
    }
  }
  data.lessons.push({id, title, edited});
  writeFileSync(TOPIC_FILE, JSON.stringify(data));
  const lesson = {id, title, notes: [], graphs: [], params:{}, pages:[{id: makeId(4), notes:[]}]};
  writeFileSync(LESSON_FILE, JSON.stringify(lesson));
  return { success: `New lesson "<b>${title}</b>" created.` };
};
  
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=//
//================== [ lesson ] ==================//
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=//
type lessonPayload = BlockContent | Array<Graph> | { [key: string]: Param };

export function updateLesson(id: string, payload: lessonPayload): ResponseMessage {
  const LESSON_FILE = LESSON_DRAFT_DIR + id + ".json";
  const rawdata = readFileSync(LESSON_FILE, "utf8");
  let data: Lesson = JSON.parse(rawdata);
  const title = data.title;
  const keys = Object.keys(payload);
  for (let i = 0; i < keys.length; i++) {
    data[keys[i]] = payload[keys[i]];
  }
  writeFileSync(LESSON_FILE, JSON.stringify(data));
  // TODO update date in topic file
  return { success: `Updated ${keys.toString()} for lesson "<b>${title}</b>".` };
};

export function publishLesson(id: string, topicId: string) {
  const TOPIC_FILE = TOPIC_DIR + topicId + ".json";
  const rawtopic = readFileSync(TOPIC_FILE, "utf8");
  let topic: Topic = JSON.parse(rawtopic);
  const LESSON_FILE = LESSON_DRAFT_DIR + id + ".json";
  const PUB_FILE = LESSON_PUB_DIR + id + ".json"
  let title:string;

  for (let i = topic.lessons.length - 1; i > -1; i--) {
    if (topic.lessons[i].id === id) {
      topic.lessons[i].edited = now();
      if (topic.lessons[i].pub === 0) { // Prepare PUB_FILE
        topic.lessons[i].pub = now();
        const rawLesson = readFileSync(LESSON_FILE, "utf8");
        let lessonData: Lesson = JSON.parse(rawLesson);
        title = lessonData.title;
        let pubLesson: Lesson = {...lessonData};
        // Delete markdown and function strings from...
        //... Notes in pages
        for (let i = 0; i < pubLesson.pages.length; i++) {
          if (pubLesson.pages[i].hasOwnProperty("notes")) {
            for (let j = 0; j < pubLesson.pages[i].notes.length; j++) {
              if (pubLesson.pages[i].notes[j].hasOwnProperty("md"))
                delete pubLesson.pages[i].notes[j].md;
            }
          }
        }
        //... Params in lesson
        const pKeys = Object.keys(pubLesson.params);
        for (let i = 0; i < pKeys.length; i++) {
          delete pubLesson.params[pKeys[i]].tMd;
        }
        //... Graphs in lesson
        const gKeys = Object.keys(pubLesson.graphs);
        for (let i = 0; i < gKeys.length; i++) {
          //... Axes in graph
          const axKeys = Object.keys(pubLesson.graphs[gKeys[i]].axes);
          for (let j = 0; j < axKeys.length; j++) {
            delete pubLesson.graphs[gKeys[i]].axes[axKeys[j]].lMd;
          }
          //... Curves in graph
          const cKeys = Object.keys(pubLesson.graphs[gKeys[i]].curves);
          for (let j = 0; j < cKeys.length; j++) {
            delete pubLesson.graphs[gKeys[i]].curves[cKeys[j]].fStr;
            delete pubLesson.graphs[gKeys[i]].curves[cKeys[j]].dStr;
          }
          //... Tangents in graph
          const tKeys = Object.keys(pubLesson.graphs[gKeys[i]].tangents);
          for (let j = 0; j < tKeys.length; j++) {
            delete pubLesson.graphs[gKeys[i]].tangents[tKeys[j]].fStr;
            delete pubLesson.graphs[gKeys[i]].tangents[tKeys[j]].fpStr;
            delete pubLesson.graphs[gKeys[i]].tangents[tKeys[j]].ptStr;
          }
          //... Points in graph
          const ptKeys = Object.keys(pubLesson.graphs[gKeys[i]].points);
          for (let j = 0; j < ptKeys.length; j++) {
            delete pubLesson.graphs[gKeys[i]].points[ptKeys[j]].xLMd;
            delete pubLesson.graphs[gKeys[i]].points[ptKeys[j]].yLMd;
            delete pubLesson.graphs[gKeys[i]].points[ptKeys[j]].xStr;
            delete pubLesson.graphs[gKeys[i]].points[ptKeys[j]].yStr;
          }
          //... Verts & Edges in Areas in graph
          const arKeys = Object.keys(pubLesson.graphs[gKeys[i]].areas);
          for (let j = 0; j < arKeys.length; j++) {
            for (let k = 0; k < pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts.length; k++) {
              if (pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts[k].hasOwnProperty("xStr")) {
                delete pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts[k].xStr;
                delete pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts[k].yStr;
              } else {
                delete pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts[k].fStr;
                delete pubLesson.graphs[gKeys[i]].areas[arKeys[j]].verts[k].dStr;
              }
            }
          }
        }
        // WRITE TO LESSON_FILE
        writeFileSync(PUB_FILE, JSON.stringify(pubLesson));
        writeFileSync(TOPIC_FILE, JSON.stringify(topic));
        return { success: `Lesson title has been changed to <b>${title}</b>.` };
      } else { // Delete PUB_FILE
        topic.lessons[i].pub = 0;
        writeFileSync(TOPIC_FILE, JSON.stringify(topic));
        if (existsSync(PUB_FILE)) unlinkSync(PUB_FILE);
        return { success: "Unpublished lesson." };
      }
    }
  }
  return { error: "Could not find Lesson" };
};
