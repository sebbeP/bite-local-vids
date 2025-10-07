--==============================================================
-- Bite DB Setup (Partitioned by CreatedDate) – Users & Place
--==============================================================

--=====================
-- Schemas
--=====================
CREATE SCHEMA IF NOT EXISTS Users;
CREATE SCHEMA IF NOT EXISTS Place;
CREATE SCHEMA IF NOT EXISTS Logs;

--=====================
-- Parent tables (partitioned)
--=====================

-- Logs.LogData
CREATE TABLE IF NOT EXISTS Logs.LogData (
    ID SERIAL,
    LID TEXT,
    UID TEXT,
    PID TEXT,
    LogInfo TEXT,
    Message TEXT,
    LogLevel INT,
    LogDate DATE,
    LogTime TIME,
    Year TEXT,
    PRIMARY KEY (ID, LogDate)
) PARTITION BY RANGE (LogDate);

-- Users.User
CREATE TABLE IF NOT EXISTS Users.User (
    ID SERIAL,
    UID TEXT,
    FName TEXT,
    LName TEXT,
    Email TEXT,
    Lang TEXT,
    LogoPath TEXT,
    WatchList BOOL,
    Phone TEXT,
    WrongPasswordCount INT,
    LogInTimes INT,
    LogInArray TEXT,
    Terms JSONB,
    EmailConfirmed JSONB,
    CreatedDate DATE,
    Log JSONB,
    PostArray JSONB,
    LikedPost JSONB,
    PostInteraction JSONB,
    CommentsMade JSONB,
    CurrentLogedInData JSONB,
    Suspended BOOL,
    SuspensionData JSONB,
    SavedPosts JSONB,
    Followers JSONB,
    Following JSONB,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Users.Token
CREATE TABLE IF NOT EXISTS Users.Token (
    ID SERIAL,
    UID TEXT NOT NULL,
    Token TEXT,
    CreatedDate DATE,
    CreatedTime TIME,
    LastUsedDateTime TIMESTAMP,
    Active BOOL,
    OneTime BOOL,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Users.LogIn
CREATE TABLE IF NOT EXISTS Users.LogIn (
    ID SERIAL,
    UID TEXT NOT NULL,
    Email TEXT,
    UserNr TEXT,
    PasswordHash TEXT,
    CreatedDate DATE,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Users.UEK
CREATE TABLE IF NOT EXISTS Users.UEK (
    ID SERIAL,
    UID TEXT NOT NULL,
    Uek TEXT,
    CreatedDate DATE,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Place.Post
CREATE TABLE IF NOT EXISTS Place.Post (
    ID SERIAL,
    UID TEXT,
    PlaceID TEXT,
    PID TEXT,
    CreatedDate DATE,
    PostoUrl TEXT,
    AvrageAmountWatched TEXT,
    SusPost BOOL,
    CommentArray JSONB,
    AmountSaved INT,
    AmountWatched INT,
    Public BOOL,
    Private BOOL,
    FriendsOnly BOOL,
    Likes INT,
    Saved INT,
    Views INT,
    PostType TEXT,
    TextContent TEXT,
    HeaderContent TEXT,
    SoundId TEXT,
    Tags JSONB,
    SystemPostData JSONB,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Place.AudioMedia
CREATE TABLE IF NOT EXISTS Place.AudioMedia (
    ID SERIAL,
    MediaID TEXT,
    SoundName TEXT,
    SoundPath TEXT,
    CreatedDate DATE,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

-- Place.Profile
CREATE TABLE IF NOT EXISTS Place.Profile(
    ID SERIAL,
    PlaceID TEXT,
    CompanyOwnerID TEXT,
    IsApi BOOL,
    PostArray JSONB,
    Visitors JSONB,
    Followers JSONB,
    Reviews JSONB,
    Ratings JSONB,
    Name TEXT,
    LogoPath TEXT,
    Header TEXT,
    Description TEXT,
    ContactInfo JSONB,
    SocialMedia JSONB,
    Location JSONB,
    Tags JSONB,
    SystemData JSONB,
    CreatedDate DATE,
    PRIMARY KEY (ID, CreatedDate)
) PARTITION BY RANGE (CreatedDate);

--=====================
-- Yearly partitions (2025)
--=====================

-- Logs
CREATE TABLE IF NOT EXISTS Logs.LogData_2025
PARTITION OF Logs.LogData
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Users
CREATE TABLE IF NOT EXISTS Users.User_2025
PARTITION OF Users.User
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS Users.Token_2025
PARTITION OF Users.Token
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS Users.LogIn_2025
PARTITION OF Users.LogIn
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS Users.UEK_2025
PARTITION OF Users.UEK
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Place
CREATE TABLE IF NOT EXISTS Place.Post_2025
PARTITION OF Place.Post
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS Place.AudioMedia_2025
PARTITION OF Place.AudioMedia
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS Place.Profile_2025
PARTITION OF Place.Profile
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

--=====================
-- Grants on schemas
--=====================
GRANT ALL ON SCHEMA Users TO postgres;
GRANT ALL ON SCHEMA Place TO postgres;
GRANT ALL ON SCHEMA Logs TO postgres;

--=====================
-- Explicit table-level grants
--=====================

-- Logs
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Logs.LogData TO postgres;

-- Users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Users.User TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Users.Token TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Users.LogIn TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Users.UEK TO postgres;

-- Place
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Place.Post TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Place.AudioMedia TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Place.Profile TO postgres;

--=====================
-- Sequence grants
--=====================
GRANT ALL ON SEQUENCE 
    Logs.LogData_id_seq,
    Users.User_id_seq,
    Users.Token_id_seq,
    Users.LogIn_id_seq,
    Users.UEK_id_seq,
    Place.Post_id_seq,
    Place.AudioMedia_id_seq,
    Place.Profile_id_seq
TO postgres;

--=====================
-- Default privileges for future partitions
--=====================
ALTER DEFAULT PRIVILEGES IN SCHEMA Users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA Place
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA Logs
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgres;

--=====================
-- Utility function for logging
--=====================
CREATE OR REPLACE FUNCTION public.log_event(
    p_uid TEXT,
    p_pid TEXT,
    p_log_info TEXT,
    p_message TEXT,
    p_log_level INT DEFAULT 1
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_lid TEXT;
    v_log_date DATE;
BEGIN
    v_log_date := CURRENT_DATE;
    v_lid := gen_random_uuid()::TEXT;
    
    INSERT INTO Logs.LogData (
        LID, UID, PID, LogInfo, Message, LogLevel, LogDate, LogTime, Year
    ) VALUES (
        v_lid, p_uid, p_pid, p_log_info, p_message, p_log_level, 
        v_log_date, CURRENT_TIME, EXTRACT(YEAR FROM v_log_date)::TEXT
    );
    
    RETURN v_lid;
END;
$$;

--=====================
-- Enable Row Level Security
--=====================
ALTER TABLE Logs.LogData ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users.User ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users.Token ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users.LogIn ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users.UEK ENABLE ROW LEVEL SECURITY;
ALTER TABLE Place.Post ENABLE ROW LEVEL SECURITY;
ALTER TABLE Place.AudioMedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE Place.Profile ENABLE ROW LEVEL SECURITY;

--=====================
-- Drop existing policies if they exist
--=====================
DROP POLICY IF EXISTS "Service role can access logs" ON Logs.LogData;
DROP POLICY IF EXISTS "Users can view own data" ON Users.User;
DROP POLICY IF EXISTS "Users can update own data" ON Users.User;
DROP POLICY IF EXISTS "Users can view own tokens" ON Users.Token;
DROP POLICY IF EXISTS "Public posts are viewable by all" ON Place.Post;
DROP POLICY IF EXISTS "Users can view own posts" ON Place.Post;
DROP POLICY IF EXISTS "Users can insert own posts" ON Place.Post;
DROP POLICY IF EXISTS "Users can update own posts" ON Place.Post;
DROP POLICY IF EXISTS "Users can delete own posts" ON Place.Post;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON Place.Profile;
DROP POLICY IF EXISTS "Owner can update profile" ON Place.Profile;
DROP POLICY IF EXISTS "Audio media is publicly viewable" ON Place.AudioMedia;

--=====================
-- Basic RLS Policies
--=====================

-- Logs: Only service role can access
CREATE POLICY "Service role can access logs"
ON Logs.LogData
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Users can view their own data
CREATE POLICY "Users can view own data"
ON Users.User
FOR SELECT
USING (auth.uid()::TEXT = UID);

CREATE POLICY "Users can update own data"
ON Users.User
FOR UPDATE
USING (auth.uid()::TEXT = UID);

-- Token policies
CREATE POLICY "Users can view own tokens"
ON Users.Token
FOR SELECT
USING (auth.uid()::TEXT = UID);

-- Posts can be viewed based on visibility settings
CREATE POLICY "Public posts are viewable by all"
ON Place.Post
FOR SELECT
USING (Public = true);

CREATE POLICY "Users can view own posts"
ON Place.Post
FOR SELECT
USING (auth.uid()::TEXT = UID);

CREATE POLICY "Users can insert own posts"
ON Place.Post
FOR INSERT
WITH CHECK (auth.uid()::TEXT = UID);

CREATE POLICY "Users can update own posts"
ON Place.Post
FOR UPDATE
USING (auth.uid()::TEXT = UID);

CREATE POLICY "Users can delete own posts"
ON Place.Post
FOR DELETE
USING (auth.uid()::TEXT = UID);

-- Profiles are publicly viewable
CREATE POLICY "Profiles are publicly viewable"
ON Place.Profile
FOR SELECT
USING (true);

CREATE POLICY "Owner can update profile"
ON Place.Profile
FOR UPDATE
USING (auth.uid()::TEXT = CompanyOwnerID);

-- AudioMedia is publicly viewable
CREATE POLICY "Audio media is publicly viewable"
ON Place.AudioMedia
FOR SELECT
USING (true);