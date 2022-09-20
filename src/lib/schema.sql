CREATE TABLE IF NOT EXISTS users
(
  id          TEXT UNIQUE NOT NULL,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  created     INTEGER NOT NULL,
  last_login  INTEGER,
  has_avatar  BOOLEAN DEFAULT 0,
  is_admin    BOOLEAN DEFAULT 0,
  is_staff    BOOLEAN DEFAULT 0,
  is_active   BOOLEAN DEFAULT 1
);


CREATE TABLE IF NOT EXISTS articles
(
  id        TEXT PRIMARY KEY,
  title     TEXT NOT NULL,
  slug      TEXT NOT NULL,
  subtitle  TEXT,
  thumb     TEXT,
  created   INTEGER NOT NULL,
  published INTEGER DEFAULT 0,
  views     INTEGER DEFAULT 0,
  tags      TEXT
);

CREATE TABLE IF NOT EXISTS tags
(
  id    INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tags
(
  id          TEXT PRIMARY KEY,
  article_id  TEXT NOT NULL,
  tag_id      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topic_progress
(
  id        TEXT PRIMARY KEY,
  user_id   TEXT NOT NULL,
  topic_id  TEXT NOT NULL,
  progress  INTEGER NOT NULL DEFAULT 0,
  score     INTEGER DEFAULT 0,
  started   INTEGER NOT NULL,
  last_view INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress
(
  id        TEXT PRIMARY KEY,
  user_id   TEXT NOT NULL,
  topic_id  TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  score     INTEGER DEFAULT 0,
  progress  TEXT
);

CREATE TABLE IF NOT EXISTS questions
(
  id          TEXT PRIMARY KEY NOT NULL,
  subject_id  TEXT NOT NULL,
  topic_id    TEXT,
  lesson_id   TEXT,
  page_id     TEXT,
  question    TEXT NOT NULL,
  choices     TEXT NOT NULL,
  explanation TEXT,
  cover       BOOLEAN DEFAULT 0,
  has_images  BOOLEAN DEFAULT 0,
  difficulty  INTEGER NOT NULL,
  edited      INTEGER,
  published   BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS question_md
(
  id   TEXT PRIMARY KEY NOT NULL,
  q_md TEXT,
  c_md TEXT,
  e_md
);

CREATE TABLE IF NOT EXISTS reset_pw
(
  id      TEXT PRIMARY KEY NOT NULL,
  email   TEXT NOT NULL,
  created INTEGER NOT NULL
);
