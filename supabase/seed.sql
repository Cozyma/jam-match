-- 曲マスター（既存50曲 + 新規PD曲）
INSERT INTO songs (title, has_vocal, main_instrument, tempo, original_key, chords, lyrics, is_public_domain) VALUES
-- === トラディショナル / PD曲（歌詞あり） ===
('Man of Constant Sorrow', true, 'guitar', 'medium', 'D', 'Verse: Dm - Dm - C - Dm | Dm - Dm - C - Dm', E'I am a man of constant sorrow\nI''ve seen trouble all my days\nI bid farewell to old Kentucky\nThe place where I was born and raised', true),
('Will the Circle Be Unbroken', true, 'guitar', 'medium', 'A', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - G - C - G | G - G - D - G', E'Will the circle be unbroken\nBy and by Lord by and by\nThere''s a better home a-waiting\nIn the sky Lord in the sky', true),
('Roll in My Sweet Baby''s Arms', true, 'banjo', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - C - G - D - G', E'Roll in my sweet baby''s arms\nRoll in my sweet baby''s arms\nGonna lay around the shack\nTill the mail train comes back\nAnd roll in my sweet baby''s arms', true),
('Nine Pound Hammer', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'This nine pound hammer is a little too heavy\nFor my size honey for my size\nRoll on buddy don''t you roll so slow\nBaby how can I roll when the wheels won''t go', true),
('Old Joe Clark', true, 'fiddle', 'fast', 'A', 'Verse: A - G - A - G | A - G - A - A | Chorus: A - G - A - G | A - G - A - A', E'Old Joe Clark the preacher''s son\nPreached all over the plain\nThe only text he ever knew\nWas high low jack and the game\n\nChorus:\nFare thee well Old Joe Clark\nFare thee well I say\nFare thee well Old Joe Clark\nI ain''t got long to stay', true),
('I''ll Fly Away', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - G - C - G | G - G - D - G', E'Some glad morning when this life is o''er\nI''ll fly away\nTo a home on God''s celestial shore\nI''ll fly away\n\nChorus:\nI''ll fly away oh glory\nI''ll fly away in the morning\nWhen I die hallelujah by and by\nI''ll fly away', true),
('Amazing Grace', true, 'guitar', 'slow', 'G', 'Verse: G - G - C - G | G - G - D - G', E'Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost but now am found\nWas blind but now I see', true),
('Angel Band', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'My latest sun is sinking fast\nMy race is nearly run\nMy strongest trials now are past\nMy triumph has begun\n\nChorus:\nOh come angel band come and around me stand\nOh bear me away on your snowy wings\nTo my immortal home', true),
('Wayfaring Stranger', true, 'guitar', 'slow', 'Am', 'Verse: Am - Am - F - Am | Am - Am - E - Am', E'I am a poor wayfaring stranger\nTraveling through this world of woe\nYet there''s no sickness toil nor danger\nIn that bright land to which I go\n\nChorus:\nI''m going there to see my father\nI''m going there no more to roam\nI''m only going over Jordan\nI''m only going over home', true),
('Down the Road', true, 'guitar', 'fast', 'G', 'Verse: G - C - G - D | G - C - D - G', E'Down the road about a mile or two\nLives a little girl named Pearly Blue\nAbout so high and her hair is brown\nThe prettiest thing boys in this town', true),
('Little Maggie', true, 'banjo', 'fast', 'G', 'Verse: G - G - F - G | G - G - F - G', E'Over yonder stands Little Maggie\nWith a dram glass in her hand\nShe''s drinking away her troubles\nShe''s courting another man', true),
('Shady Grove', true, 'mandolin', 'medium', 'Am', 'Verse: Am - Am - G - Am | Am - Am - G - Am', E'Shady Grove my little love\nShady Grove I say\nShady Grove my little love\nI''m bound to go away\n\nCheeks as red as a blooming rose\nEyes are the prettiest brown\nShe''s the darling of my heart\nSweetest girl in town', true),
('John Henry', true, 'banjo', 'medium', 'E', 'Verse: G - G - C - G | G - G - D - G', E'John Henry was a little baby boy\nSitting on his daddy''s knee\nHe picked up a hammer and a little piece of steel\nSaid this hammer''s gonna be the death of me Lord Lord\nThis hammer''s gonna be the death of me', true),
('Bile Them Cabbage Down', true, 'banjo', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'Bile them cabbage down\nBake them hoecakes brown\nThe only song that I can sing\nIs bile them cabbage down', true),
('Long Journey Home', true, 'banjo', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'Black smoke a-rising and it surely is a train\nSurely is a train boys surely is a train\nBlack smoke a-rising and it surely is a train\nI''m on my long journey home', true),
('Wildwood Flower', true, 'guitar', 'medium', 'C', 'Verse: C - C - F - C | C - C - G - C', E'Oh I''ll twine with my mingles and waving black hair\nWith the roses so red and the lilies so fair\nAnd the myrtle so bright with the emerald dew\nThe pale and the leader and eyes look like blue', true),
('Keep on the Sunny Side', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | G - C - D - G', E'There''s a dark and a troubled side of life\nThere''s a bright and a sunny side too\nThough we meet with the darkness and strife\nThe sunny side we also may view\n\nChorus:\nKeep on the sunny side always on the sunny side\nKeep on the sunny side of life\nIt will help us every day it will brighten all the way\nIf we keep on the sunny side of life', true),
('Bury Me Beneath the Willow', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'Oh bury me beneath the willow\nUnder the weeping willow tree\nSo she may know where I am sleeping\nAnd perhaps she''ll weep for me', true),
('Hot Corn Cold Corn', true, 'banjo', 'fast', 'G', 'Verse: A - A - D - A | A - A - E - A', E'Hot corn cold corn bring along the demijohn\nHot corn cold corn bring along the demijohn\nHot corn cold corn bring along the demijohn\nFare you well Uncle Bill see you in the morning yes sir', true),
('Pretty Polly', true, 'banjo', 'slow', 'Dm', 'Verse: Dm - Dm - C - Dm | Dm - Dm - C - Dm', E'Oh Polly, Pretty Polly, come go along with me\nPolly, Pretty Polly, come go along with me\nBefore we get married\nSome pleasures to see', true),
('Banks of the Ohio', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - G - C - G | G - D - G - G', E'I asked my love to take a walk\nTo take a walk, just a little walk\nDown beside where the waters flow\nDown by the banks of the Ohio\n\nChorus:\nAnd only say that you''ll be mine\nIn no others arms entwine\nDown beside where the waters flow\nDown by the banks of the Ohio', true),
('East Virginia', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'I was born in East Virginia\nNorth Carolina I did go\nThere I met a fair young maiden\nAnd her name I did not know', true),
('Handsome Molly', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | G - C - D - G', E'I wish I was in London\nOr some other seaport town\nI''d set my foot on a steamboat\nAnd sail the ocean round', true),
('Little Birdie', true, 'banjo', 'medium', 'Am', 'Verse: Am - Am - G - Am | Am - Am - G - Am', E'Little birdie, little birdie\nCome and sing me your song\nI''ve a short while to be here\nAnd a long time to be gone', true),
('Darlin'' Corey', true, 'banjo', 'medium', 'Em', 'Verse: Em - Em - D - Em | Em - Em - D - Em', E'Wake up, wake up, darlin'' Corey\nWhat makes you sleep so sound\nThe revenue officers are coming\nGonna tear your still house down', true),
('Cindy', true, 'banjo', 'fast', 'G', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - G - C - G | G - G - D - G', E'I wish I was an apple\nA-hangin'' on a tree\nAnd every time my sweetheart passed\nShe''d take a bite of me\n\nChorus:\nGet along home, Cindy, Cindy\nGet along home, Cindy, Cindy\nGet along home, Cindy, Cindy\nI''ll marry you some day', true),
('Cumberland Gap', true, 'banjo', 'fast', 'A', 'Verse: A - A - G - A | A - A - G - A', E'Lay down boys and take a little nap\nLay down boys and take a little nap\nLay down boys and take a little nap\nForty-one miles to Cumberland Gap', true),
('Down in the Valley', true, 'guitar', 'slow', 'G', 'Verse: G - G - D - D | D - D - G - G', E'Down in the valley, the valley so low\nHang your head over, hear the wind blow\nHear the wind blow, dear, hear the wind blow\nHang your head over, hear the wind blow', true),
('Red River Valley', true, 'guitar', 'slow', 'G', 'Verse: G - G - C - G | G - C - D7 - G', E'From this valley they say you are going\nWe will miss your bright eyes and sweet smile\nFor they say you are taking the sunshine\nThat has brightened our path for a while', true),
('Little Sadie', true, 'guitar', 'fast', 'Am', 'Verse: Am - Am - G - Am | Am - Am - G - Am', E'Went out last night for to take a little round\nI met Little Sadie and I shot her down\nWent back home and I got in bed\nForty-four smokeless under my head', true),
('Rye Whiskey', true, 'guitar', 'medium', 'D', 'Verse: D - D - G - D | D - D - A - D', E'Rye whiskey, rye whiskey, rye whiskey I cry\nIf you don''t give me rye whiskey I surely will die\nIf the ocean was whiskey and I was a duck\nI''d dive to the bottom and never come up', true),
('Ground Hog', true, 'banjo', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'Shoulder up your gun and whistle up your dog\nShoulder up your gun and whistle up your dog\nWe''re off to the woods for to catch a ground hog\nGround hog!', true),
('Tom Dooley', true, 'guitar', 'medium', 'G', 'Verse: G - G - D - D | D - D - G - G', E'Hang down your head Tom Dooley\nHang down your head and cry\nHang down your head Tom Dooley\nPoor boy you''re bound to die', true),
('John Hardy', true, 'banjo', 'fast', 'Em', 'Verse: Em - Em - D - Em | Em - Em - D - Em', E'John Hardy was a desperate little man\nHe carried two guns every day\nHe shot a man on the West Virginia line\nAnd you ought to see John Hardy gettin'' away', true),
('Worried Man Blues', true, 'guitar', 'medium', 'G', 'Chorus: G - G - C - C | G - G - D7 - G', E'It takes a worried man to sing a worried song\nIt takes a worried man to sing a worried song\nIt takes a worried man to sing a worried song\nI''m worried now but I won''t be worried long', true),
('Old Smoky', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'On top of Old Smoky, all covered with snow\nI lost my true lover, from courting too slow\nA-courting is pleasure, a-flirting is grief\nA false-hearted lover is worse than a thief', true),
('Swing Low Sweet Chariot', true, 'guitar', 'slow', 'D', 'Chorus: D - G - D - A | D - G - A - D', E'Swing low, sweet chariot\nComin'' for to carry me home\nSwing low, sweet chariot\nComin'' for to carry me home\n\nI looked over Jordan and what did I see\nComin'' for to carry me home\nA band of angels comin'' after me\nComin'' for to carry me home', true),
('Leaning on the Everlasting Arms', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | Chorus: G - C - G - D - G', E'What a fellowship, what a joy divine\nLeaning on the everlasting arms\nWhat a blessedness, what a peace is mine\nLeaning on the everlasting arms\n\nChorus:\nLeaning, leaning\nSafe and secure from all alarms\nLeaning, leaning\nLeaning on the everlasting arms', true),
('In the Sweet By and By', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | Chorus: G - C - G - D - G', E'There''s a land that is fairer than day\nAnd by faith we can see it afar\nFor the Father waits over the way\nTo prepare us a dwelling place there\n\nChorus:\nIn the sweet by and by\nWe shall meet on that beautiful shore\nIn the sweet by and by\nWe shall meet on that beautiful shore', true),
('Just a Closer Walk with Thee', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'I am weak but thou art strong\nJesus keep me from all wrong\nI''ll be satisfied as long\nAs I walk, let me walk close to thee\n\nChorus:\nJust a closer walk with thee\nGrant it Jesus is my plea\nDaily walking close to thee\nLet it be, dear Lord, let it be', true),
('Shall We Gather at the River', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'Shall we gather at the river\nWhere bright angel feet have trod\nWith its crystal tide forever\nFlowing by the throne of God\n\nChorus:\nYes we''ll gather at the river\nThe beautiful, the beautiful river\nGather with the saints at the river\nThat flows by the throne of God', true),
('What a Friend We Have in Jesus', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'What a friend we have in Jesus\nAll our sins and griefs to bear\nWhat a privilege to carry\nEverything to God in prayer', true),
('The Old Rugged Cross', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | Chorus: G - C - G - D - G', E'On a hill far away stood an old rugged cross\nThe emblem of suffering and shame\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain\n\nChorus:\nSo I''ll cherish the old rugged cross\nTill my trophies at last I lay down\nI will cling to the old rugged cross\nAnd exchange it some day for a crown', true),
('When the Saints Go Marching In', true, 'guitar', 'medium', 'G', 'Verse: G - G - G - G | C - C - G - G | G - E7 - Am - D7 | G - C - G - G', E'Oh when the saints go marching in\nOh when the saints go marching in\nLord how I want to be in that number\nWhen the saints go marching in', true),
('Precious Memories', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | Chorus: G - C - G - D - G', E'Precious memories unseen angels\nSent from somewhere to my soul\nHow they linger ever near me\nAnd the sacred past unfold\n\nChorus:\nPrecious memories how they linger\nHow they ever flood my soul\nIn the stillness of the midnight\nPrecious sacred scenes unfold', true),
('Lonesome Valley', true, 'guitar', 'slow', 'G', 'Verse: G - G - C - G | G - G - D - G', E'You gotta walk that lonesome valley\nYou gotta walk it by yourself\nAin''t nobody here can walk it for you\nYou gotta walk it by yourself', true),
('The Crawdad Song', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'You get a line and I''ll get a pole, honey\nYou get a line and I''ll get a pole, babe\nYou get a line and I''ll get a pole\nWe''ll go down to the crawdad hole\nHoney, sugar baby mine', true),
('Wabash Cannonball', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - C | G - G - D - G', E'From the great Atlantic ocean to the wide Pacific shore\nFrom the queen of flowing mountains to the south bells by the shore\nShe''s mighty tall and handsome and known quite well by all\nShe''s the combination on the Wabash Cannonball', true),
('This Train Is Bound for Glory', true, 'guitar', 'medium', 'G', 'Verse: G - G - C - G | G - G - D - G', E'This train is bound for glory this train\nThis train is bound for glory this train\nThis train is bound for glory\nDon''t carry nothing but the righteous and the holy\nThis train is bound for glory this train', true),
('Buffalo Gals', true, 'banjo', 'fast', 'G', 'Verse: G - G - D - D | D - D - G - G | Chorus: G - G - D - D | D - D - G - G', E'As I was walking down the street\nDown the street, down the street\nA pretty little gal I chanced to meet\nOh she was fair to view\n\nChorus:\nBuffalo gals won''t you come out tonight\nCome out tonight, come out tonight\nBuffalo gals won''t you come out tonight\nAnd dance by the light of the moon', true),
('The Cuckoo', true, 'banjo', 'medium', 'Am', 'Verse: Am - Am - G - Am | Am - Am - G - Am', E'Oh the cuckoo she''s a pretty bird\nShe warbles as she flies\nShe never says cuckoo\nTill the fourth day of July', true),
('Barbara Allen', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', E'In Scarlet Town where I was born\nThere was a fair maid dwelling\nMade every youth cry well-a-day\nHer name was Barbara Allen', true),
('Old Dan Tucker', true, 'banjo', 'fast', 'G', 'Verse: G - G - C - G | G - G - D - G | Chorus: G - G - C - G | G - G - D - G', E'Old Dan Tucker was a fine old man\nWashed his face in a frying pan\nCombed his hair with a wagon wheel\nDied with a toothache in his heel\n\nChorus:\nGet out the way Old Dan Tucker\nYou''re too late to get your supper\nSupper''s over and dinner''s cooking\nOld Dan Tucker just stand there looking', true),
('Jesse James', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | G - C - D - G | Chorus: G - C - G - D - G', E'Jesse James was a lad who killed many a man\nHe robbed the Glendale train\nHe stole from the rich and he gave to the poor\nHe''d a hand and a heart and a brain\n\nChorus:\nPoor Jesse had a wife to mourn for his life\nThree children they were brave\nBut that dirty little coward that shot Mister Howard\nHas laid poor Jesse in his grave', true),
('My Old Kentucky Home', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G | Chorus: G - C - G - D - G', E'The sun shines bright in the old Kentucky home\nTis summer the people are gay\nThe corn-top''s ripe and the meadow''s in the bloom\nWhile the birds make music all the day\n\nChorus:\nWeep no more my lady\nOh weep no more today\nWe will sing one song for the old Kentucky home\nFor the old Kentucky home far away', true),
('Camptown Races', true, 'banjo', 'fast', 'G', 'Verse: G - G - D - G | Chorus: G - C - G - D - G', E'The Camptown ladies sing this song\nDoo-dah doo-dah\nThe Camptown racetrack five miles long\nOh doo-dah day\n\nChorus:\nGoing to run all night\nGoing to run all day\nI''ll bet my money on a bobtail nag\nSomebody bet on the bay', true),
('Oh Susanna', true, 'banjo', 'fast', 'G', 'Verse: G - G - D - G | Chorus: C - C - G - D - G', E'I come from Alabama with a banjo on my knee\nI''m going to Louisiana my true love for to see\nIt rained all night the day I left the weather it was dry\nThe sun so hot I froze to death Susanna don''t you cry\n\nChorus:\nOh Susanna oh don''t you cry for me\nFor I come from Alabama\nWith a banjo on my knee', true),
('Omie Wise', true, 'guitar', 'slow', 'Em', 'Verse: Em - D - Em - Em | Em - D - Em - Em', E'Oh listen to my story I''ll tell you no lies\nHow John Lewis did murder poor little Omie Wise\nHe told her to meet him at Adams'' springs\nHe''d bring her some money and other fine things', true),
('Black Jack Davey', true, 'guitar', 'medium', 'Am', 'Verse: Am - G - Am - Am | Am - G - Am - Am', E'Black Jack Davey come a-ridin'' through the woods\nSinging so loud and merry\nHe charmed the heart of a lady fair\nThe wife of a wealthy squire', true),
-- === トラディショナル フィドルチューン（インスト） ===
('Cripple Creek', false, 'banjo', 'fast', 'A', 'A: A - D - A - E | A - D - E - A | B: A - D - A - E | A - D - E - A', NULL, true),
('Blackberry Blossom', false, 'fiddle', 'fast', 'G', 'A: Em - D - Em - D | Em - D - Em - Em | B: Em - D - Em - D | Em - D - Em - Em', NULL, true),
('Soldier''s Joy', false, 'fiddle', 'fast', 'D', 'A: D - D - A - D | D - D - A - D | B: D - G - D - A | D - G - A - D', NULL, true),
('Turkey in the Straw', false, 'fiddle', 'fast', 'G', 'Verse: G - G - C - G | G - G - D - G', E'As I was a-going on down the road\nWith a tired team and a heavy load\nI cracked my whip and the leader sprung\nI says day-day to the wagon tongue\n\nChorus:\nTurkey in the straw, turkey in the hay\nRoll ''em up and twist ''em up a high tuckahaw\nAnd twist ''em up a tune called Turkey in the Straw', true),
('Salt Creek', false, 'mandolin', 'fast', 'A', 'A: A - A - D - A | A - A - E - A | B: A - D - A - E | A - D - E - A', NULL, true),
('Red Haired Boy', false, 'fiddle', 'fast', 'A', 'A: A - G - A - G | A - G - A - E | B: A - G - A - G | A - G - E - A', NULL, true),
('Whiskey Before Breakfast', false, 'fiddle', 'fast', 'D', 'A: D - G - D - A | D - G - A - D | B: D - G - D - A | D - G - A - D', NULL, true),
('Fisher''s Hornpipe', false, 'fiddle', 'fast', 'D', 'A: D - G - D - A | D - G - A - D | B: D - G - D - A | D - G - A - D', NULL, true),
('Beaumont Rag', false, 'fiddle', 'fast', 'G', 'A: G - C - G - D | G - C - D - G | B: C - F - C - G | C - F - G - C', NULL, true),
('Sally Goodin', false, 'fiddle', 'fast', 'A', 'A - A - A - E | A - A - E - A', NULL, true),
('Arkansas Traveler', false, 'fiddle', 'medium', 'D', 'D - G - D - A7 | D - G - A7 - D', NULL, true),
('Devil''s Dream', false, 'fiddle', 'fast', 'A', 'A - D - A - E | A - D - E - A', NULL, true),
('Cotton-Eyed Joe', false, 'fiddle', 'fast', 'A', 'A - A - A - E | A - A - E - A', NULL, true),
('Ragtime Annie', false, 'fiddle', 'medium', 'D', 'D - G - D - A | D - G - A - D', NULL, true),
('Leather Britches', false, 'fiddle', 'fast', 'G', 'G - G - C - G | G - G - D - G', NULL, true),
('Cluck Old Hen', false, 'fiddle', 'medium', 'Am', 'Am - G - Am - Am | Am - G - Am - Am', NULL, true),
('Temperance Reel', false, 'fiddle', 'fast', 'G', 'G - C - G - D | G - C - D - G', NULL, true),
('Angeline the Baker', false, 'fiddle', 'medium', 'D', 'D - D - G - D | D - D - A - D', NULL, true),
('Sourwood Mountain', false, 'fiddle', 'medium', 'D', 'D - G - D - A | D - G - A - D', NULL, true),
('Liberty', false, 'fiddle', 'fast', 'D', 'D - G - D - A7 | D - G - A7 - D', NULL, true),
('Billy in the Lowground', false, 'fiddle', 'fast', 'C', 'C - Am - C - G | C - Am - G - C', NULL, true),
('June Apple', false, 'fiddle', 'medium', 'A', 'A - G - A - G | A - G - A - A', NULL, true),
('St. Anne''s Reel', false, 'fiddle', 'fast', 'D', 'D - G - D - A | D - G - A - D', NULL, true),
('Spotted Pony', false, 'fiddle', 'fast', 'Am', 'Am - G - Am - Em | Am - G - Em - Am', NULL, true),
('Fire on the Mountain', false, 'fiddle', 'fast', 'A', 'A - D - A - E | A - D - E - A', NULL, true),
('Cherokee Shuffle', false, 'fiddle', 'medium', 'A', 'A - D - A - E | A - D - E - A', NULL, true),
('Bonaparte''s Retreat', false, 'fiddle', 'medium', 'D', 'D - G - D - A | D - G - A - D', NULL, true),
('Dill Pickle Rag', false, 'guitar', 'fast', 'G', 'A: G - C - G - D7 | G - C - D7 - G | B: C - F - C - G7 | C - F - G7 - C', NULL, true),
-- === 著作権あり曲（コード進行のみ） ===
('Foggy Mountain Breakdown', false, 'banjo', 'fast', 'G', 'G - Em - G - D | G - Em - D - G', NULL, false),
('Blue Moon of Kentucky', true, 'mandolin', 'medium', 'B', 'Verse: B - E - B - F# | B - E - F# - B', NULL, false),
('Rocky Top', true, 'fiddle', 'fast', 'A', 'Verse: A - D - A - E | Chorus: A - D - A - E - A', NULL, false),
('Orange Blossom Special', false, 'fiddle', 'fast', 'E', 'E - A - E - B7 | E - A - B7 - E', NULL, false),
('Wagon Wheel', true, 'guitar', 'medium', 'G', 'Verse: G - D - Em - C | Chorus: G - D - C - C', NULL, false),
('I Am a Man of Constant Sorrow', true, 'guitar', 'medium', 'D', 'Verse: Dm - Dm - C - Dm | Dm - Dm - C - Dm', NULL, false),
('Big Mon', false, 'mandolin', 'fast', 'G', 'A: G - C - G - D | G - C - D - G', NULL, false),
('Gold Rush', false, 'banjo', 'fast', 'G', 'A: G - C - G - D | G - C - D - G | B: Em - C - Em - D', NULL, false),
('Sitting on Top of the World', true, 'guitar', 'medium', 'A', 'Verse: A - D - A - E | A - D - E - A', NULL, false),
('Dark Hollow', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | G - C - D - G', NULL, false),
('Footprints in the Snow', true, 'guitar', 'medium', 'G', 'Verse: G - C - G - D | Chorus: G - C - G - D - G', NULL, false),
('Blue Ridge Cabin Home', true, 'mandolin', 'medium', 'B', 'Verse: B - E - B - F# | B - E - F# - B', NULL, false),
('Molly and Tenbrooks', true, 'mandolin', 'fast', 'A', 'Verse: A - D - A - E | A - D - E - A', NULL, false),
('Uncle Pen', true, 'mandolin', 'fast', 'A', 'Verse: A - D - A - E | Chorus: A - D - A - E - A', NULL, false),
('Kentucky Waltz', true, 'fiddle', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', NULL, false),
('If I Needed You', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', NULL, false),
('High on a Mountain Top', true, 'guitar', 'medium', 'A', 'Verse: A - D - A - E | A - D - E - A', NULL, false),
('Ground Speed', false, 'mandolin', 'fast', 'A', 'A: A - D - A - E | A - D - E - A', NULL, false),
('Jerusalem Ridge', false, 'mandolin', 'fast', 'Am', 'A: Am - G - Am - E | Am - G - E - Am', NULL, false),
('Fireball Mail', false, 'guitar', 'fast', 'G', 'G - C - G - D | G - C - D - G', NULL, false),
('Rank Stranger', true, 'guitar', 'slow', 'G', 'Verse: G - C - G - D | G - C - D - G', NULL, false),
('How Mountain Girls Can Love', true, 'banjo', 'fast', 'A', 'Verse: A - D - A - E | Chorus: A - D - A - E - A', NULL, false)
ON CONFLICT (title) DO UPDATE SET
  chords = EXCLUDED.chords,
  lyrics = EXCLUDED.lyrics,
  is_public_domain = EXCLUDED.is_public_domain;

-- テストユーザー（auth.users + profiles を一括作成）
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin,
  confirmation_token, recovery_token, email_change_token_new, email_change_token_current,
  email_change, phone_change, phone_change_token, reauthentication_token
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
    false, '', '', '', '', '', '', '', ''
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
    false, '', '', '', '', '', '', '', ''
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
    false, '', '', '', '', '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'test.user@gmail.com', 'email', '{"sub":"a1111111-1111-1111-1111-111111111111","email":"test.user@gmail.com"}', now(), now(), now()),
  ('a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'tanaka@example.com', 'email', '{"sub":"a2222222-2222-2222-2222-222222222222","email":"tanaka@example.com"}', now(), now(), now()),
  ('a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'suzuki@example.com', 'email', '{"sub":"a3333333-3333-3333-3333-333333333333","email":"suzuki@example.com"}', now(), now(), now())
;

INSERT INTO profiles (id, display_name, main_part, role) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'テストユーザー', 'guitar', 'moderator'),
  ('a2222222-2222-2222-2222-222222222222', '田中太郎', 'banjo', 'user'),
  ('a3333333-3333-3333-3333-333333333333', '鈴木花子', 'fiddle', 'user')
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
