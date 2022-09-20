import db from "$lib/db";
import { now } from "$lib/helpers";

export function get({ locals, params }) {
  if (!locals.hasToken) { // isnt logged in
    const created = db.prepare("SELECT created FROM reset_pw WHERE code = ?").get(params.code);
    if (created) {
      if (now()-created < 604800) {
        return {
          body: { code: params.code }
        };
      } else {
        db.prepare("DELETE FROM reset_pw WHERE code = ?").get(params.code);
      }
    }
  }
  return { status: 302, headers: {location: "/accounts/login"} }
};

