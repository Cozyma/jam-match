import csv

file_path = '/home/deploy/jam-match/supabase/data/chord-review/antigravity-results.csv'

categories = {}
suspected_gospel = []
suspected_vocal_but_instr = []

gospel_keywords = ['God', 'Lord', 'Jesus', 'Bible', 'Heaven', 'Angel', 'Pray', 'Cross', 'Church', 'Saint', 'Spirit', 'Grace', 'Building', 'Shore', 'Land', 'Sky']
instr_keywords = ['Rag', 'Hornpipe', 'Reel', 'Breakdown', 'Stomp', 'Shuffle', 'Special', 'Tune', 'Step', 'Hop', 'Polka', 'Waltz']

with open(file_path, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        cat = row['category']
        title = row['title']
        
        categories[cat] = categories.get(cat, 0) + 1
        
        if cat == 'Vocal':
            if any(k.lower() in title.lower() for k in gospel_keywords):
                suspected_gospel.append(title)
            if any(k.lower() in title.lower() for k in instr_keywords):
                suspected_vocal_but_instr.append(title)

print("Current Categories counts:")
for cat, count in categories.items():
    print(f"{cat}: {count}")

print("\n--- Suspected Gospel (Currently Vocal) ---")
for title in suspected_gospel:
    print(title)

print("\n--- Suspected Instrumental (Currently Vocal) ---")
for title in suspected_vocal_but_instr:
    print(title)
