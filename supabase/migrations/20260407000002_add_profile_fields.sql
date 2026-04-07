-- profiles に活動エリアとバンド名を追加
ALTER TABLE profiles ADD COLUMN area text;
ALTER TABLE profiles ADD COLUMN band_name text;
