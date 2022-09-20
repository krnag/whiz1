export function get({ locals }) {
  return {
    body: { hasToken: locals.hasToken }
  }
}
