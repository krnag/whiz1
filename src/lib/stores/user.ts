import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { browser } from "$app/env";

type User = { username: string, avatar: number, role?: string, progress:any, id:string };

const storedUser: User = JSON.parse(browser ? localStorage.getItem("user") : null)

export const user: Writable<User> = writable(storedUser);
user.subscribe(value => browser && (localStorage.user = JSON.stringify(value)));
