-- songs テーブルにコード・歌詞・PDフラグを追加
ALTER TABLE songs ADD COLUMN chords text;
ALTER TABLE songs ADD COLUMN lyrics text;
ALTER TABLE songs ADD COLUMN is_public_domain boolean DEFAULT false;

-- profiles テーブルに role カラムを追加
ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator'));

-- songs の INSERT/UPDATE をモデレーターのみに制限
CREATE POLICY "songs_insert_moderator" ON songs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
  );

CREATE POLICY "songs_update_moderator" ON songs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
  );
