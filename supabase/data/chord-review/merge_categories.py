import csv

input_file = '/home/deploy/jam-match/supabase/data/chord-review/reclassified-results.csv'
output_file = '/home/deploy/jam-match/supabase/data/chord-review/standardized-songs-v2.csv'

# New categories: Vocal or Instrumental
def merge_category(cat):
    if cat in ['Vocal Standard', 'Gospel']:
        return 'Vocal'
    if cat in ['Instrumental', 'Showcase']:
        return 'Instrumental'
    return cat

rows = []
with open(input_file, mode='r', encoding='utf-8') as f_in:
    reader = csv.DictReader(f_in)
    fieldnames = reader.fieldnames
    for row in reader:
        row['category'] = merge_category(row['category'])
        rows.append(row)

with open(output_file, mode='w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Integration complete. Categories merged into Vocal/Instrumental.")
print(f"Saved to {output_file}")
