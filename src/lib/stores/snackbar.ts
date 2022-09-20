import { writable } from "svelte/store";
import { makeId } from "$lib/helpers";
import type { Writable } from "svelte/store";
import type { ResponseMessage } from "src/types";

type Snack = { id: string, format: string, text: string};
export const snacks: Writable<Snack[]> = writable([]);

//TODO: Create and add Achievement to msg type
export function transmit(msg: ResponseMessage) {
  snacks.update(s => {
    const [[format, text]] = Object.entries(msg);
    s.push({id: makeId(3), format, text});
    return s;
  });
};

export function clear(id:string) {
  snacks.update(s => {
    const idx = s.findIndex(m => m.id === id);
    s.splice(idx, 1);
    return s;
  });
};
