import sharp from "sharp";
import { existsSync } from "fs";
import db from '$lib/db';

export async function post({ params, request }) {
  const data = JSON.parse((await request.body.read()).toString());
  //const file = data['image'];
  const imgBuf = Buffer.from(data['image'], 'base64');
  const filename = `static/images/user/avatar/${params.username}.webp`;
  if (!existsSync(filename)) {
    db.prepare("UPDATE users SET has_avatar = 1 WHERE username = ?;").run(params.username);
  }
  await sharp(imgBuf).resize({width: 120, height: 120}).webp({quality:65}).toFile(filename);
  //writeFileSync(filename, file, 'base64')
  return {
    status: 200,
    success: "Update Successful"
  }
};
