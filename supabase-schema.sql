-- Supabase SQL Schema for GFG Pixel Clone
-- Run this in the Supabase SQL Editor

-- If tables exist, drop them to start fresh:
DROP TABLE IF EXISTS users, events, blogs, resources, leaderboard, messages, practice, lessons CASCADE;

-- 1. Users Table
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "regNo" TEXT UNIQUE NOT NULL,
  phone TEXT,
  sem TEXT,
  role TEXT DEFAULT 'member',
  approved BOOLEAN DEFAULT true,
  "createdAt" TEXT,
  salt TEXT,
  "passwordHash" TEXT,
  "idCardPhoto" TEXT
);

-- 2. Events Table
CREATE TABLE events (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  type TEXT,
  status TEXT DEFAULT 'upcoming',
  description TEXT,
  image TEXT
);

-- 3. Blogs Table
CREATE TABLE blogs (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  date TEXT,
  category TEXT,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  tags JSONB
);

-- 4. Resources Table
CREATE TABLE resources (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  type TEXT,
  link TEXT,
  description TEXT
);

-- 5. Leaderboard Table
CREATE TABLE leaderboard (
  id BIGINT PRIMARY KEY,
  rank INT UNIQUE,
  name TEXT NOT NULL,
  "regNo" TEXT,
  points INT DEFAULT 0,
  avatar TEXT
);

-- 6. Messages Table (Contact Form)
CREATE TABLE messages (
  id BIGINT PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  "createdAt" TEXT
);

-- 7. Practice / Lessons Tables
CREATE TABLE practice (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT,
  tags JSONB,
  description TEXT,
  link TEXT
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT
);

-- Disable Row Level Security (RLS) since the Express server handles access natively
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE practice DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
