CREATE TABLE song_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE song_corrections ENABLE ROW LEVEL SECURITY;

-- ログインユーザーは自分の修正提案を投稿できる
CREATE POLICY "Users can insert own corrections"
  ON song_corrections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の投稿を閲覧できる
CREATE POLICY "Users can view own corrections"
  ON song_corrections FOR SELECT
  USING (auth.uid() = user_id);

-- モデレーターは全件閲覧できる
CREATE POLICY "Moderators can view all corrections"
  ON song_corrections FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator'));

-- モデレーターは対応済みリクエストを削除できる
CREATE POLICY "Moderators can delete corrections"
  ON song_corrections FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator'));
