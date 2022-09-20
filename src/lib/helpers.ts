export const URL = "http://localhost:3000/"

export function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function getCookie(cookieString: string, key="") {
  const cookies = cookieString.split(";")
  let i = cookies.length;
  while (i--) {
    const [k, v] = cookies[i].trim().split("=");
    if (k === key) return v;
  }
}

export function makeId(n=10): string {
  return Math.random().toString(36).substring(2, 2+n);
}

export function isEmail(text: string) {
  return /^[A-z0-9\-\._]+@[A-z0-9\-\.]+\.[A-z0-9]+$/.test(text) && text.length > 7;
}

export function getDate(epoch: number = null) {
  if (isNaN(epoch)) return "Just Now"
  if (epoch < 200) return "Never";
  return (new Date(epoch*1000)).toLocaleString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
  
}

export function now() {
  return Math.round(Date.now()/1000);
}

export const secret = '452VlLU8Me6UOVGCHlT3at2cdQ7vQh7Y7zFJyFyxnVAWbC8jIv0bpPy2fpxntPNGOmaVAhGSqYrmVPJD404OlDl8652VLRdsdePpSdVFlZJp3t0FsflbsObdGJntCP6a';
