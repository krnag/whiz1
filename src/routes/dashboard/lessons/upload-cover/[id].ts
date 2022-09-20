import sharp from "sharp";

const WEBP_Q = {quality: 75};

export async function post({ params, request }) {
  const data = JSON.parse((await request.body.read()).toString())['image'];
  const imgBuf = Buffer.from(data, 'base64');
  try {
    await sharp(imgBuf).resize({width: 300, height: 300}).webp(WEBP_Q)
      .toFile(`static/images/topics/${params.id}.webp`);
  } catch (error) {
  }
  return {
    status: 200,
    success: "Update Successful"
  }
};

