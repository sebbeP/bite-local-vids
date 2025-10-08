-- Create schemas
CREATE SCHEMA IF NOT EXISTS "Users";
CREATE SCHEMA IF NOT EXISTS "Place";
CREATE SCHEMA IF NOT EXISTS "Logs";

-- Users.User table
CREATE TABLE "Users"."User" (
  uid UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  fname TEXT,
  lname TEXT,
  logopath TEXT,
  lang TEXT DEFAULT 'en',
  createddate DATE NOT NULL DEFAULT CURRENT_DATE,
  suspended BOOLEAN DEFAULT FALSE,
  wrongpasswordcount INTEGER DEFAULT 0,
  logintimes INTEGER DEFAULT 0
);

-- Users.LogIn table
CREATE TABLE "Users"."LogIn" (
  uid UUID PRIMARY KEY REFERENCES "Users"."User"(uid) ON DELETE CASCADE,
  email TEXT NOT NULL,
  createddate DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Place.Profile table
CREATE TABLE "Place"."Profile" (
  placeid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid UUID REFERENCES "Users"."User"(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  website TEXT,
  logo TEXT,
  coverimage TEXT,
  cuisine TEXT[],
  pricerange TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  totalreviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  createdat TIMESTAMPTZ DEFAULT NOW(),
  updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- Place.Post table
CREATE TABLE "Place"."Post" (
  pid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placeid UUID REFERENCES "Place"."Profile"(placeid) ON DELETE CASCADE,
  uid UUID REFERENCES "Users"."User"(uid) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  mediaurl TEXT[],
  mediatype TEXT,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  createdat TIMESTAMPTZ DEFAULT NOW(),
  updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- Logs.LogData table
CREATE TABLE "Logs"."LogData" (
  "LID" TEXT PRIMARY KEY,
  "UID" TEXT,
  "PID" TEXT,
  "LogInfo" TEXT,
  "Message" TEXT,
  "LogLevel" INTEGER DEFAULT 1,
  "LogDate" DATE,
  "LogTime" TIME,
  "Year" TEXT
);

-- Enable RLS on all tables
ALTER TABLE "Users"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Users"."LogIn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Place"."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Place"."Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Logs"."LogData" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users.User
CREATE POLICY "Users can read their own data"
  ON "Users"."User"
  FOR SELECT
  USING (auth.uid() = uid);

CREATE POLICY "Users can update their own data"
  ON "Users"."User"
  FOR UPDATE
  USING (auth.uid() = uid);

CREATE POLICY "Anyone can insert during signup"
  ON "Users"."User"
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for Users.LogIn
CREATE POLICY "Users can read their own login"
  ON "Users"."LogIn"
  FOR SELECT
  USING (auth.uid() = uid);

CREATE POLICY "Anyone can insert login during signup"
  ON "Users"."LogIn"
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for Place.Profile
CREATE POLICY "Anyone can view profiles"
  ON "Place"."Profile"
  FOR SELECT
  USING (true);

CREATE POLICY "Profile owners can update"
  ON "Place"."Profile"
  FOR UPDATE
  USING (auth.uid() = uid);

CREATE POLICY "Authenticated users can create profiles"
  ON "Place"."Profile"
  FOR INSERT
  WITH CHECK (auth.uid() = uid);

-- RLS Policies for Place.Post
CREATE POLICY "Anyone can view posts"
  ON "Place"."Post"
  FOR SELECT
  USING (true);

CREATE POLICY "Post owners can update"
  ON "Place"."Post"
  FOR UPDATE
  USING (auth.uid() = uid);

CREATE POLICY "Post owners can delete"
  ON "Place"."Post"
  FOR DELETE
  USING (auth.uid() = uid);

CREATE POLICY "Authenticated users can create posts"
  ON "Place"."Post"
  FOR INSERT
  WITH CHECK (auth.uid() = uid);

-- RLS Policies for Logs
CREATE POLICY "Users can read their own logs"
  ON "Logs"."LogData"
  FOR SELECT
  USING (auth.uid()::text = "UID");

CREATE POLICY "Service can insert logs"
  ON "Logs"."LogData"
  FOR INSERT
  WITH CHECK (true);