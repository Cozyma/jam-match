-- ルーム内で演奏済みの曲を記録
CREATE TABLE room_played_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  marked_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now(),
  UNIQUE (room_id, song_id)
);

ALTER TABLE room_played_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "played_select" ON room_played_songs FOR SELECT USING (true);
CREATE POLICY "played_insert" ON room_played_songs FOR INSERT WITH CHECK (auth.uid() = marked_by);
CREATE POLICY "played_delete" ON room_played_songs FOR DELETE USING (auth.uid() = marked_by);

CREATE INDEX idx_room_played_songs_room ON room_played_songs(room_id);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE room_played_songs;
