import { existsSync, mkdirSync, unlinkSync } from "fs";
import sharp from "sharp";

const WEBP_Q = {quality: 65};

export async function post({ params, request }) {
  const data = JSON.parse((await request.body.read()).toString())['image'];
  const imgBuf = Buffer.from(data, 'base64');

  const DIR = `static/images/lessons/${params.id}`
  if (!existsSync(DIR.slice(0,-4))) mkdirSync(DIR.slice(0,-4));

  try {
      sharp(imgBuf).resize({width: 360}).webp(WEBP_Q).toFile(DIR + "-s.webp");
      sharp(imgBuf).resize({width: 428}).webp(WEBP_Q).toFile(DIR + "-m.webp");
      await sharp(imgBuf).resize({width: 1200}).webp(WEBP_Q).toFile(DIR + "-l.webp");
  } catch (error) {}
  return {
    status: 200,
    success: "Update Successful"
  }
};

export async function del({ locals, params }) {
  if (locals.role === "admin") {
    const DIR = `static/images/lessons/${params.id}`
    try {
      unlinkSync(DIR + "-s.webp");
      unlinkSync(DIR + "-m.webp");
      unlinkSync(DIR + "-l.webp");
    } catch (error) {}
  }
}
