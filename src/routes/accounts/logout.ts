export async function post() {
  return {
    headers: {
      "Set-Cookie": "token=X; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
    },
  }
}

