-- user_repertoires に sub_parts カラムを追加
ALTER TABLE user_repertoires ADD COLUMN sub_parts text[] NOT NULL DEFAULT '{}';
