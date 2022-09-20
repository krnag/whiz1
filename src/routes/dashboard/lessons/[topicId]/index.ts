export async function get({ locals }) {
  if (locals.role === "admin" || locals.role === "staff") {
    return {status: 200};
  }
  return {status: 404};
}
