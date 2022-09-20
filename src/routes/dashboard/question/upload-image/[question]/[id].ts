import { existsSync, mkdirSync, unlinkSync } from "fs";
import sharp from "sharp";

const WEBP_Q = {quality: 65};

export async function post({ locals, params, request }) {
  if (locals.role === "admin") {
    const data = JSON.parse((await request.body.read()).toString())['image'];
    const imgBuf = Buffer.from(data, 'base64');

    const DIR = `static/images/quiz/${params.question}`
    if (!existsSync(DIR)) mkdirSync(DIR);

    try {
      if (params.id === "cover") {
        await sharp(imgBuf).resize({width: 300}).webp(WEBP_Q).toFile(DIR+'/cover.webp');
      } else await sharp(imgBuf).webp(WEBP_Q).toFile(DIR + `/${params.id}.webp`);
    } catch (error) {}
    return {
      status: 200,
      success: "Update Successful"
    }
  }
};

export async function del({ locals, params }) {
  if (locals.role === "admin") {
    try {
      unlinkSync(`static/images/quiz/${params.question}/${params.id}.webp`);
    } catch (error) {}
  }
}
