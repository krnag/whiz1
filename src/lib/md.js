import { marked } from "marked";
import katex from "katex";

const ICON = {a: '<span class="i fsn tol">a</span>',
  o: '<span class="i fsn">o</span>',
  c:'<span class="ib licon"></span>',
  t:'<span class="ib licon"></span>',
  i:'I',
  w:'!'
}

const refregex = /[\w-]+/;
function graphRefs(text) {
  return text.replace(/::.{3}-\w-.{2,7}:.+?:/g, (t) => {
    const type = t.slice(6,7);
    const [data, label] = t.match(/[\w-]+/g);
    //const [graphId, type, elemId] = [0].split("-");
    //console.log(data, label)
    //console.log(t.match(refregex)[0].split("-"))
    return `<b data-ref="${data}" class="ref">${ICON[type]}${label}</b>`;
  });
}
function paramRefs(text) {
  return text.replace(/\%\[\w\].+?\%/g, (t) => `<b data-key="${t.slice(2,3)}" class="param"><span class="i fsn">p</span>${t.slice(4,-1)}</b>`)
}

function box(text) {
  const type = text.charAt(2);
  return text.replace(/^!![iw]\s.+/gm, (t) => `<div class="${type}-box"><span class="i">${ICON[type]}</span> ${t.slice(4)}</div>`)
}

function latex(text) {
  return text.replace(/\$\$.+?\$\$/g,
    (t) => katex.renderToString(t.slice(2,-2)), {throwOnError: false});
}

let renderer = {
  blockquote(quote) {
    let arr = quote.split("<br>:-")
    if (arr.length === 1) return `<blockquote>\n${quote}</blockquote>\n`;
    return `<figure><blockquote>\n${arr[0]}</p></blockquote><figcaption>${arr[1].slice(0,arr[1].indexOf("</p>"))}</figcaption></figure>\n`;
  },
  paragraph(text) {
    return '<p>' + latex(paramRefs(graphRefs(box(text)))) + '</p>\n';
  }
}
marked.setOptions({
  pedantic: false,
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: true
})

marked.use({ renderer });
export default function markup(string) {
  return marked.parse(string);
}
