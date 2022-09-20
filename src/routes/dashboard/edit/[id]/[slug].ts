import db from '$lib/db';
import { makeId, slugify } from '$lib/helpers';
import { getArticle, writeArticle, deleteArticle } from '$lib/json/articles';
import type { Article, ResponseMessage } from 'src/types';

export async function get({ locals, params }) {
  if (locals.role === "admin" || locals.role === "staff") {
    //const res = await fetch(`/articles/${params.slug}.json`);
    //const article = await res.json();
    let article: Article | ResponseMessage;
    if (params.id.length < 5) {
      article = {
        id: makeId(), title:"", slug: "", subtitle:"", content: [],
        tags: [], created: Math.round(Date.now()/1000), lastEdit: 0
      };
    } else article = getArticle(params.slug);
    return {
      body: { article }
    };
  }
  return {status: 404};
}

export async function post({ locals, params, request }) {
  if (locals.role === "admin" || locals.role === "staff") {
    let article = await request.json();
    if (!article.slug) article.slug = slugify(article.title);
    if (article.lastEdit) { // update existing article
      db.prepare("UPDATE articles SET title = ?, slug = ?, subtitle = ? WHERE id = ?;")
        .run(article.title, article.slug, article.subtitle, article.id);
    } else { // create new article
      db.prepare('INSERT INTO articles (id, title, slug, subtitle, created ) VALUES(?, ?, ?, ?, ?);')
        .run(article.id, article.title, article.slug, article.subtitle, article.created);
    }
    writeArticle(article);
    if (params.slug !== "-" && params.slug !== article.slug) { // delete old file
      deleteArticle(params.slug);
    }
    return {
      status: 303,
      headers: {
        location: "/blog/" + article.slug
      }
    };
  }
  return {
    status: 303,
    headers: {
      location: "/blog/"// + params.slug
    }
  };
};

export async function patch({ locals, params, request }) {
  if (locals.role === "admin") {
    let body = await request.json();
    if (body[0] === "publish") {
      db.prepare("UPDATE articles SET published = ? WHERE id = ?;").run(body[1], params.id)
    }
    return { status: 200 }
  }
}
