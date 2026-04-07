-- 曲マスター
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

-- テストユーザー（auth.users + profiles を一括作成）
-- user1: test.user@gmail.com / testpass (Guitar)
-- user2: tanaka@example.com / testpass (Banjo)
-- user3: suzuki@example.com / testpass (Fiddle)

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'test.user@gmail.com',
    crypt('testpass', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"テストユーザー"}',
    false
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tanaka@example.com',
    crypt('testpass', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"田中太郎"}',
    false
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'suzuki@example.com',
    crypt('testpass', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"鈴木花子"}',
    false
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'test.user@gmail.com', 'email', '{"sub":"a1111111-1111-1111-1111-111111111111","email":"test.user@gmail.com"}', now(), now(), now()),
  ('a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'tanaka@example.com', 'email', '{"sub":"a2222222-2222-2222-2222-222222222222","email":"tanaka@example.com"}', now(), now(), now()),
  ('a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'suzuki@example.com', 'email', '{"sub":"a3333333-3333-3333-3333-333333333333","email":"suzuki@example.com"}', now(), now(), now())
;

INSERT INTO profiles (id, display_name, main_part) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'テストユーザー', 'guitar'),
  ('a2222222-2222-2222-2222-222222222222', '田中太郎', 'banjo'),
  ('a3333333-3333-3333-3333-333333333333', '鈴木花子', 'fiddle')
ON CONFLICT (id) DO NOTHING;

-- テスト用レパートリー
INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a1111111-1111-1111-1111-111111111111', id, 'guitar', 'lead', 'ready', true
FROM songs WHERE title IN ('Foggy Mountain Breakdown', 'Rocky Top', 'Will the Circle Be Unbroken', 'Wagon Wheel', 'I''ll Fly Away')
ON CONFLICT (user_id, song_id) DO NOTHING;

INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a1111111-1111-1111-1111-111111111111', id, 'guitar', 'none', 'with_practice', false
FROM songs WHERE title IN ('Cripple Creek', 'Old Joe Clark', 'Amazing Grace')
ON CONFLICT (user_id, song_id) DO NOTHING;

INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a2222222-2222-2222-2222-222222222222', id, 'banjo', 'none', 'ready', true
FROM songs WHERE title IN ('Foggy Mountain Breakdown', 'Cripple Creek', 'Rocky Top', 'Gold Rush')
ON CONFLICT (user_id, song_id) DO NOTHING;

INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a2222222-2222-2222-2222-222222222222', id, 'banjo', 'harmony_high', 'with_practice', false
FROM songs WHERE title IN ('Will the Circle Be Unbroken', 'Wagon Wheel')
ON CONFLICT (user_id, song_id) DO NOTHING;

INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a3333333-3333-3333-3333-333333333333', id, 'fiddle', 'none', 'ready', false
FROM songs WHERE title IN ('Foggy Mountain Breakdown', 'Rocky Top', 'Orange Blossom Special', 'Old Joe Clark')
ON CONFLICT (user_id, song_id) DO NOTHING;

INSERT INTO user_repertoires (user_id, song_id, part, vocal, proficiency, is_favorite)
SELECT 'a3333333-3333-3333-3333-333333333333', id, 'fiddle', 'harmony_low', 'learning', false
FROM songs WHERE title IN ('Will the Circle Be Unbroken', 'Amazing Grace')
ON CONFLICT (user_id, song_id) DO NOTHING;
