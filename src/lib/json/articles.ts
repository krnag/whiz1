import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import type { Article, ResponseMessage } from "../../types";

const ARTICLES_DIR = "./static/articles/";

export function writeArticle(article: Article) {
  writeFileSync(ARTICLES_DIR + article.slug + ".json", JSON.stringify(article));
};

export function getArticle(slug: string): Article | ResponseMessage {
  if (existsSync(ARTICLES_DIR)) {
    const rawdata = readFileSync(ARTICLES_DIR + slug + ".json", "utf8");
    if (rawdata) return JSON.parse(rawdata);
    else return { error: "Something went wrong. Could not retrieve article." };
  } else return { error: "Could not find article" };
};

export function deleteArticle(slug: string) {
  try {
    unlinkSync(ARTICLES_DIR + slug + ".json");
  } catch (error) {
    // TODO: setup some error writing file
  }
};

