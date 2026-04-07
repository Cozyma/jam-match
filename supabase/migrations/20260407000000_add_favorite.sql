-- user_repertoires に favorite カラムを追加
ALTER TABLE user_repertoires ADD COLUMN is_favorite boolean NOT NULL DEFAULT false;

-- ソート用インデックス
CREATE INDEX idx_user_repertoires_favorite ON user_repertoires(user_id, is_favorite DESC);
