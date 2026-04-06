-- profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  main_part text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- songs
CREATE TABLE songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  has_vocal boolean DEFAULT true,
  main_instrument text,
  tempo text CHECK (tempo IN ('slow', 'medium', 'fast')),
  original_key text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "songs_select" ON songs FOR SELECT USING (true);

-- user_repertoires
CREATE TABLE user_repertoires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  part text NOT NULL CHECK (part IN ('guitar', 'banjo', 'mandolin', 'fiddle', 'bass', 'dobro', 'other')),
  vocal text DEFAULT 'none' CHECK (vocal IN ('lead', 'harmony_high', 'harmony_low', 'none')),
  preferred_keys text[] DEFAULT '{}',
  proficiency text NOT NULL CHECK (proficiency IN ('ready', 'with_practice', 'learning')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, song_id)
);

ALTER TABLE user_repertoires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "repertoires_select" ON user_repertoires FOR SELECT USING (true);
CREATE POLICY "repertoires_insert" ON user_repertoires FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "repertoires_update" ON user_repertoires FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "repertoires_delete" ON user_repertoires FOR DELETE USING (auth.uid() = user_id);

-- rooms
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  room_type text NOT NULL DEFAULT 'ephemeral' CHECK (room_type IN ('ephemeral', 'persistent')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms_select" ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert" ON rooms FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- room_members
CREATE TABLE room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_select" ON room_members FOR SELECT USING (true);
CREATE POLICY "members_insert" ON room_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_delete" ON room_members FOR DELETE USING (auth.uid() = user_id);

-- indexes
CREATE INDEX idx_user_repertoires_user ON user_repertoires(user_id);
CREATE INDEX idx_user_repertoires_song ON user_repertoires(song_id);
CREATE INDEX idx_room_members_room ON room_members(room_id);
CREATE INDEX idx_rooms_code ON rooms(code);

-- Enable realtime for room_members
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
