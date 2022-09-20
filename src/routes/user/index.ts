export function get({ locals }) {
  return {
    body: { username: locals.username }
  }
}
