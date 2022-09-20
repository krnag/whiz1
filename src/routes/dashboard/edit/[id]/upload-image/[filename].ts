import sharp from "sharp";
import { existsSync, mkdirSync, unlinkSync } from "fs";

const WEBP_Q = {quality: 65};

export async function post({ locals, params, request }) {
  if (locals.role === "admin") {
    const data = JSON.parse((await request.body.read()).toString())['image'];
    const DIR = `static/articles/images/${params.id}`;
    if (!existsSync(DIR)) {
      mkdirSync(DIR);
    }
    const imgBuf = Buffer.from(data, 'base64');
    try {
      if (params.filename === "cover") {
        sharp(imgBuf).resize({width: 1366}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-s.webp`);
        sharp(imgBuf).resize({width: 1536}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-m.webp`);
        await sharp(imgBuf).resize({width: 1920}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-l.webp`);
      } else if (params.filename === "mcover") {
        sharp(imgBuf).resize({width: 360, height: 360}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-s.webp`);
        await sharp(imgBuf).resize({width: 428, height: 428}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-l.webp`);
      } else if (params.filename === "thumb") {
        await sharp(imgBuf).resize({width: 200, height: 200}).webp(WEBP_Q).toFile(DIR+"/thumb.webp");
      } else {
        sharp(imgBuf).resize({width: 360}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-s.webp`);
        sharp(imgBuf).resize({width: 428}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-m.webp`);
        await sharp(imgBuf).resize({width: 1200}).webp(WEBP_Q).toFile(DIR+`/${params.filename}-l.webp`);
      }
    } catch (error) {}
    //writeFileSync(dir+`/${params.filename}.jpg`, data, 'base64')
    return {
      status: 200,
      success: "Update Successful"
    }
  }
};

export async function del({ locals, params }) {
  if (locals.role === "admin") {
  const DIR = `static/articles/images/${params.id}/${params.filename}-`;
    try {
      unlinkSync(DIR + "s.webp");
      unlinkSync(DIR + "m.webp");
      unlinkSync(DIR + "l.webp");
    } catch (error) {}
  }
}
