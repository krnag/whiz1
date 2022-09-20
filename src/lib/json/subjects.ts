import { existsSync, readFileSync, rm, unlinkSync, writeFileSync } from "fs";
import { now } from "../helpers";
import type { Subjects, Topic, ResponseMessage } from "../../types";

//const DIR = "./static/courses/";
const SUBJECT = "./static/courses/subjects.json";
const TOPIC_DIR = "./static/courses/topics/";
const IMG_DIR = "./static/images/topics/";

export function updateDiscipline(id: string, name: string, remove=false) {
  const rawdata = readFileSync(SUBJECT, "utf8");
  let data: Subjects = JSON.parse(rawdata)
  const i = data.disciplines.findIndex(d => d.id === id);
  if (remove) {
    data.disciplines.splice(i, 1);
    writeFileSync(SUBJECT, JSON.stringify(data));
    return { success: `${name} has been <b>deleted</b>` };
  } else {
    for (let i = data.disciplines.length -1; i > -1; i--) {
      if (data.disciplines[i].id === id) {
        data.disciplines[i].name = name;
        writeFileSync(SUBJECT, JSON.stringify(data));
        return { success: "Discipline has been <b>renamed</b> to " + name };
      }
    }
    data.disciplines.push({id, name});
    writeFileSync(SUBJECT, JSON.stringify(data));
    return { success: `New discipline "<b>${name}</b>" created` };
  }

};

export function updateSubject(disc:string, id: string, name: string, remove=false, position=0): ResponseMessage {
  const rawdata = readFileSync(SUBJECT, "utf8");
  let data: Subjects = JSON.parse(rawdata)
  if (remove) {
    for (let i = data.subjects.length -1; i > -1; i--) {
      if (data.subjects[i].id === id) {
        for (let j = data.subjects[i].topics.length -1; j > -1; j--) {
          updateTopic(id, data.subjects[i].topics[j].id, null, true);
        }
        data.subjects.splice(i, 1);
        writeFileSync(SUBJECT, JSON.stringify(data));
        return { success: `${name} has been <b>deleted</b>` };
      }
    }
  } else if (position) {
    const from = data.subjects.findIndex(s => s.id === id);
    data.subjects.splice(from+position, 0, data.subjects.splice(from, 1)[0])
    writeFileSync(SUBJECT, JSON.stringify(data));
    return { success: `Subject ${name} has been <b>moved</b>` };
  } else {
    for (let i = data.subjects.length -1; i > -1; i--) {
      if (data.subjects[i].id === id) {
        data.subjects[i].name = name;
        data.subjects[i].disc = disc;
        data.subjects[i].edited = now();
        writeFileSync(SUBJECT, JSON.stringify(data));

        return { success: "Subject has been <b>renamed</b> to " + name };
      }
    }
    data.subjects.push({id, disc, name, topics:[], created: now(), edited:0});
    writeFileSync(SUBJECT, JSON.stringify(data));
    return { success: `New subject "<b>${name}</b>" created` };
  }
};

//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=//
//================== [ topics ] ==================//
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=//

export function updateTopic(subject: string, id: string, name: string, remove=false, position=0) {
  const rawdata = readFileSync(SUBJECT, "utf8");
  let data: Subjects = JSON.parse(rawdata);
  if (remove) {
    for (let i = data.subjects.length -1; i > -1; i--) {
      if (data.subjects[i].id === subject) {
        for (let j = data.subjects[i].topics.length -1; j > -1; j--) {
          if (data.subjects[i].topics[j].id === id) {
            const ADDR = TOPIC_DIR + id + ".json";
// delete all lessons and their image dirs
            const rawTopic = readFileSync(ADDR, "utf8");
            const topic: Topic = JSON.parse(rawTopic);
            for (let k = topic.lessons.length -1; k > -1; k--) {
              const ID = topic.lessons[k].id;
              const LESSON_FILE_DR = "./static/courses/lessons/drafts/" + ID + ".json";
              const LESSON_FILE_PUB = "./static/courses/lessons/published/" + ID + ".json";
              if (existsSync(LESSON_FILE_DR)) unlinkSync(LESSON_FILE_DR);
              if (existsSync(LESSON_FILE_PUB)) unlinkSync(LESSON_FILE_PUB);
              const LESSON_IMG_DIR = "./static/images/lessons/" + ID;
              if (existsSync(LESSON_IMG_DIR)) rm(LESSON_IMG_DIR, { recursive: true }, (err) => {
                if (err) console.log(err);
              });
            };

            if (existsSync(ADDR)) unlinkSync(ADDR);
            const TOPIC_IMG = IMG_DIR + id + ".webp";
            if (existsSync(TOPIC_IMG))unlinkSync(TOPIC_IMG);
            data.subjects[i].topics.splice(j, 1);
            writeFileSync(SUBJECT, JSON.stringify(data));
            return { success: `Topic ${name} has been <b>deleted</b>` };
          }
        }
      }
    }
  } else if (position) {
    const sI = data.subjects.findIndex(s => s.id === subject);
    const from = data.subjects[sI].topics.findIndex(t => t.id === id);
    data.subjects[sI].topics.splice(from+position, 0, data.subjects[sI].topics.splice(from, 1)[0]);
    writeFileSync(SUBJECT, JSON.stringify(data));
    return { success: `Topic ${name} has been <b>moved</b>` };
  } else {
    const ADDR = TOPIC_DIR + id + ".json";
    for (let i = data.subjects.length -1; i > -1; i--) {
      if (data.subjects[i].id === subject) {
        for (let j = data.subjects[i].topics.length -1; j > -1; j--) {
          if (data.subjects[i].topics[j].id === id) {
            data.subjects[i].topics[j].name = name;
            data.subjects[i].topics[j].edited = now();
            writeFileSync(SUBJECT, JSON.stringify(data));
            // write to topic file
            const rawTopic = readFileSync(ADDR, "utf8");
            let topic: Topic = JSON.parse(rawTopic);
            topic.name = name;
            writeFileSync(ADDR, JSON.stringify(topic));
            return { success: "Topic has been <b>renamed</b> to " + name };
          }
        }
      }
    }
    const idx = data.subjects.findIndex(s => s.id === subject);
    data.subjects[idx].topics.push({id, name, created: now(), edited:0});
    writeFileSync(SUBJECT, JSON.stringify(data));
    const topic: Topic = {id, name, lessons: [], subjectId: subject};
    writeFileSync(ADDR, JSON.stringify(topic));

    return { success: `New topic "<b>${name}</b>" created` };
  }
};
