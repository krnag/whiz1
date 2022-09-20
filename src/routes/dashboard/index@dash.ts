export async function get({locals}) {
  if (locals.role === "admin") return {status: 200 }
  return {status: 404 };
}
