-- ============================================================
-- Matematici Speciale – Database Schema
-- Run this once against your Neon/PostgreSQL database
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role        VARCHAR(50)   NOT NULL DEFAULT 'student',  -- 'student' | 'admin'
  tries       INTEGER       NOT NULL DEFAULT 3,
  force_password_reset BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(500)  NOT NULL,
  body        TEXT          NOT NULL,
  pinned      BOOLEAN       NOT NULL DEFAULT FALSE,
  author      VARCHAR(255),
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(500)  NOT NULL,
  link        TEXT          NOT NULL,
  category    VARCHAR(50)   NOT NULL,  -- 'curs' | 'seminar' | 'tutoriat'
  type        VARCHAR(50)   NOT NULL DEFAULT 'PDF',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mock_subjects_theory (
  id          SERIAL PRIMARY KEY,
  title       TEXT          NOT NULL,
  link        TEXT          NOT NULL DEFAULT '#',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mock_subjects_exercise (
  id          SERIAL PRIMARY KEY,
  title       TEXT          NOT NULL,
  link        TEXT          NOT NULL DEFAULT '#',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mock_results (
  id                      SERIAL PRIMARY KEY,
  user_id                 INTEGER REFERENCES users(id) ON DELETE CASCADE,
  theory_subject          TEXT,
  exercise_subject        TEXT,
  upload_url              TEXT,
  admin_grade             NUMERIC(4, 2),
  admin_comment           TEXT,
  finished_early_theory   BOOLEAN DEFAULT FALSE,
  finished_early_exercise BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW()
);
