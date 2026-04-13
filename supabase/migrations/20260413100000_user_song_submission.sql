-- B層（ユーザー追加曲）対応
-- is_official: A層=true, B層=false
-- created_by: 曲の作成者（B層の編集・削除権限判定用）

ALTER TABLE songs ADD COLUMN is_official boolean NOT NULL DEFAULT false;
ALTER TABLE songs ADD COLUMN created_by uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 既存曲はすべてA層（公式）に設定
UPDATE songs SET is_official = true WHERE is_official = false;

-- 既存のモデレーター限定ポリシーを削除して新ポリシーに置き換え
DROP POLICY IF EXISTS "songs_insert_moderator" ON songs;
DROP POLICY IF EXISTS "songs_update_moderator" ON songs;

-- INSERT: 認証ユーザー誰でも追加可（ただしis_official=falseのみ）
-- モデレーターはis_official=trueも追加可
CREATE POLICY "songs_insert" ON songs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      is_official = false
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    )
  );

-- UPDATE: 作成者本人 or モデレーター
CREATE POLICY "songs_update" ON songs
  FOR UPDATE USING (
    auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
  );

-- DELETE: 作成者本人 or モデレーター（B層のみ。A層は削除不可）
CREATE POLICY "songs_delete" ON songs
  FOR DELETE USING (
    is_official = false
    AND (
      auth.uid() = created_by
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    )
  );
