-- 曲タグ
CREATE TABLE song_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  tag_name text NOT NULL,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (song_id, tag_name)
);

ALTER TABLE song_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "song_tags_select" ON song_tags FOR SELECT USING (true);
CREATE POLICY "song_tags_insert" ON song_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "song_tags_delete" ON song_tags FOR DELETE USING (
  auth.uid() = created_by
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
);

CREATE INDEX idx_song_tags_song ON song_tags(song_id);
CREATE INDEX idx_song_tags_tag ON song_tags(tag_name);

-- ユーザータグ
CREATE TABLE user_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tag_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, tag_name)
);

ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tags_select" ON user_tags FOR SELECT USING (true);
CREATE POLICY "user_tags_insert" ON user_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tags_delete" ON user_tags FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_tags_user ON user_tags(user_id);
CREATE INDEX idx_user_tags_tag ON user_tags(tag_name);
