import csv

input_file = '/home/deploy/jam-match/supabase/data/chord-review/standardized-songs-v2.csv'
output_file = '/home/deploy/jam-match/supabase/data/chord-review/standardized-songs-v3.csv'

# New Dobro songs to add
new_songs = [
    {
        'title': 'Great Speckled Bird',
        'main_instrument': 'Dobro',
        'category': 'Instrumental',
        'tempo': 'Slow/Medium',
        'original_key': 'G',
        'chords': 'G G C G G G D D7 G G C G G D7 G G'
    },
    {
        'title': "Maiden's Prayer",
        'main_instrument': 'Dobro/Fiddle',
        'category': 'Instrumental',
        'tempo': 'Slow/Medium',
        'original_key': 'A',
        'chords': 'A A D D A A E7 E7 A A D D A E7 A A'
    },
    {
        'title': 'Panhandle Rag',
        'main_instrument': 'Dobro/Guitar',
        'category': 'Instrumental',
        'tempo': 'Fast',
        'original_key': 'G',
        'chords': 'G G G G C C G G D7 D7 G G G G D7 D7 G G'
    }
]

rows = []
with open(input_file, mode='r', encoding='utf-8') as f_in:
    reader = csv.DictReader(f_in)
    fieldnames = reader.fieldnames
    for row in reader:
        # Fix Fireball Mail
        if row['title'] == 'Fireball Mail':
            row['main_instrument'] = 'Dobro'
            row['category'] = 'Instrumental'
        rows.append(row)

# Append new songs
for song in new_songs:
    # Ensure all columns exist
    new_row = {field: song.get(field, '') for field in fieldnames}
    rows.append(new_row)

with open(output_file, mode='w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Update complete. Added Dobro songs and fixed Fireball Mail.")
print(f"Total songs: {len(rows)}")
print(f"Saved to {output_file}")
