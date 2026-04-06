INSERT INTO songs (title, has_vocal, main_instrument, tempo, original_key) VALUES
-- トラディショナル / スタンダード
('Foggy Mountain Breakdown', false, 'banjo', 'fast', 'G'),
('Blue Moon of Kentucky', true, 'mandolin', 'medium', 'B'),
('Rocky Top', true, 'fiddle', 'fast', 'A'),
('Man of Constant Sorrow', true, 'guitar', 'medium', 'D'),
('Will the Circle Be Unbroken', true, 'guitar', 'medium', 'A'),
('Orange Blossom Special', false, 'fiddle', 'fast', 'E'),
('Roll in My Sweet Baby''s Arms', true, 'banjo', 'medium', 'G'),
('Nine Pound Hammer', true, 'guitar', 'medium', 'G'),
('Cripple Creek', false, 'banjo', 'fast', 'A'),
('Old Joe Clark', true, 'fiddle', 'fast', 'A'),
('Blackberry Blossom', false, 'fiddle', 'fast', 'G'),
('Soldier''s Joy', false, 'fiddle', 'fast', 'D'),
('Wagon Wheel', true, 'guitar', 'medium', 'G'),
('I Am a Man of Constant Sorrow', true, 'guitar', 'medium', 'D'),
('Long Journey Home', true, 'banjo', 'medium', 'G'),
('Big Mon', false, 'mandolin', 'fast', 'G'),
('Salt Creek', false, 'mandolin', 'fast', 'A'),
('Gold Rush', false, 'banjo', 'fast', 'G'),
('Turkey in the Straw', false, 'fiddle', 'fast', 'G'),
('Bile Them Cabbage Down', true, 'banjo', 'medium', 'G'),
('John Henry', true, 'banjo', 'medium', 'E'),
('I''ll Fly Away', true, 'guitar', 'medium', 'G'),
('Amazing Grace', true, 'guitar', 'slow', 'G'),
('Angel Band', true, 'guitar', 'slow', 'G'),
('Wayfaring Stranger', true, 'guitar', 'slow', 'Am'),
('Down the Road', true, 'guitar', 'fast', 'G'),
('Sitting on Top of the World', true, 'guitar', 'medium', 'A'),
('Little Maggie', true, 'banjo', 'fast', 'G'),
('Shady Grove', true, 'mandolin', 'medium', 'Am'),
('Red Haired Boy', false, 'fiddle', 'fast', 'A'),
('Whiskey Before Breakfast', false, 'fiddle', 'fast', 'D'),
('Dark Hollow', true, 'guitar', 'medium', 'G'),
('Footprints in the Snow', true, 'guitar', 'medium', 'G'),
('Blue Ridge Cabin Home', true, 'mandolin', 'medium', 'B'),
('Molly and Tenbrooks', true, 'mandolin', 'fast', 'A'),
('Uncle Pen', true, 'mandolin', 'fast', 'A'),
('Kentucky Waltz', true, 'fiddle', 'slow', 'G'),
('If I Needed You', true, 'guitar', 'slow', 'G'),
('High on a Mountain Top', true, 'guitar', 'medium', 'A'),
('Hot Corn Cold Corn', true, 'banjo', 'fast', 'G'),
('Ground Speed', false, 'mandolin', 'fast', 'A'),
('Jerusalem Ridge', false, 'mandolin', 'fast', 'Am'),
('Fisher''s Hornpipe', false, 'fiddle', 'fast', 'D'),
('Beaumont Rag', false, 'fiddle', 'fast', 'G'),
('Fireball Mail', false, 'guitar', 'fast', 'G'),
('Wildwood Flower', true, 'guitar', 'medium', 'C'),
('Keep on the Sunny Side', true, 'guitar', 'medium', 'G'),
('Rank Stranger', true, 'guitar', 'slow', 'G'),
('How Mountain Girls Can Love', true, 'banjo', 'fast', 'A'),
('Bury Me Beneath the Willow', true, 'guitar', 'slow', 'G')
ON CONFLICT (title) DO NOTHING;

-- テストユーザー（Auth APIで作成後、profilesに登録）
-- email: test.user@gmail.com / password: testpass
-- Auth側のユーザー作成は supabase/seed-auth.sh で実行
INSERT INTO profiles (id, display_name, main_part)
SELECT id, 'テストユーザー', 'guitar'
FROM auth.users WHERE email = 'test.user@gmail.com'
ON CONFLICT (id) DO NOTHING;
