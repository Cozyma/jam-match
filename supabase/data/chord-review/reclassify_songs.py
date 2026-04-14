import csv

input_file = '/home/deploy/jam-match/supabase/data/chord-review/antigravity-results.csv'
output_file = '/home/deploy/jam-match/supabase/data/chord-review/reclassified-results.csv'

# Mapping adjustments
# { "Title": ("Category", "Main Instrument") }
adjustments = {
    # Gospel re-classification
    "Amazing Grace": ("Gospel", "Vocal"),
    "Angel Band": ("Gospel", "Vocal"),
    "Cryin' Holy Unto the Lord": ("Gospel", "Vocal"),
    "Drifting Too Far from the Shore": ("Gospel", "Vocal"),
    "Dust on the Bible": ("Gospel", "Vocal"),
    "Farther Along": ("Gospel", "Vocal"),
    "Gone Home": ("Gospel", "Vocal"),
    "I'll Fly Away": ("Gospel", "Vocal"),
    "In the Sweet By and By": ("Gospel", "Vocal"),
    "Just a Closer Walk with Thee": ("Gospel", "Vocal"),
    "Leaning on the Everlasting Arms": ("Gospel", "Vocal"),
    "Lonesome Valley": ("Gospel", "Vocal"),
    "Prayer Bells of Heaven": ("Gospel", "Vocal"),
    "Precious Memories": ("Gospel", "Vocal"),
    "River of Jordan": ("Gospel", "Vocal"),
    "Shall We Gather at the River": ("Gospel", "Vocal"),
    "Swing Low Sweet Chariot": ("Gospel", "Vocal"),
    "The Darkest Hour Is Just Before Dawn": ("Gospel", "Vocal"),
    "The Old Rugged Cross": ("Gospel", "Vocal"),
    "This Train Is Bound for Glory": ("Gospel", "Vocal"),
    "Turn Your Radio On": ("Gospel", "Vocal"),
    "What a Friend We Have in Jesus": ("Gospel", "Vocal"),
    "When the Saints Go Marching In": ("Gospel", "Vocal"),
    "Where the Soul Never Dies": ("Gospel", "Vocal"),
    "Wicked Path of Sin": ("Gospel", "Vocal"),
    "Will the Circle Be Unbroken": ("Gospel", "Vocal"),
    "White Dove": ("Gospel", "Vocal"),
    "Working on a Building": ("Gospel", "Vocal"),
    "The Old Crossroads": ("Gospel", "Vocal"),
    
    # Showcase re-classification
    "Duelin' Banjos": ("Showcase", "Banjo"),
    "Orange Blossom Special": ("Showcase", "Fiddle"),
    "Rawhide": ("Showcase", "Mandolin"),
    
    # Instrumental re-classification and Main Instrument fixes
    "Salt Creek": ("Instrumental", "Fiddle/Guitar"),
    "Red Haired Boy": ("Instrumental", "Fiddle/Guitar"),
    "Blackberry Blossom": ("Instrumental", "Fiddle"),
    "Gold Rush": ("Instrumental", "Fiddle"),
    "Bill Cheatham": ("Instrumental", "Fiddle"),
    "Arkansas Traveler": ("Instrumental", "Fiddle"),
    "Turkey in the Straw": ("Instrumental", "Fiddle"),
    "Old Joe Clark": ("Instrumental", "Fiddle"),
    "Soldier's Joy": ("Instrumental", "Fiddle"),
    "Whiskey Before Breakfast": ("Instrumental", "Fiddle"),
    "St. Anne's Reel": ("Instrumental", "Fiddle"),
    "Angeline the Baker": ("Instrumental", "Fiddle"),
    "Liberty": ("Instrumental", "Fiddle"),
    "Sally Goodin": ("Instrumental", "Fiddle"),
    "Cripple Creek": ("Instrumental", "Banjo"),
    "Clinch Mountain Backstep": ("Instrumental", "Banjo"),
    "Foggy Mountain Breakdown": ("Instrumental", "Banjo"),
    "Earl's Breakdown": ("Instrumental", "Banjo"),
    "Flint Hill Special": ("Instrumental", "Banjo"),
    "Randy Lynn Rag": ("Instrumental", "Banjo"),
    "Bluegrass Breakdown": ("Instrumental", "Mandolin/Banjo"),
    "Big Mon": ("Instrumental", "Mandolin/Fiddle"),
    "Jerusalem Ridge": ("Instrumental", "Fiddle/Mandolin"),
    "Manzanita": ("Instrumental", "Guitar"),
    "Church Street Blues": ("Vocal Standard", "Guitar"),
    "Wildwood Flower": ("Instrumental", "Guitar"),
    "Dill Pickle Rag": ("Instrumental", "Guitar"),
    "Beaumont Rag": ("Instrumental", "Guitar"),
    
    # Vocal Standard adjustments (Key starting instruments)
    "Cabin in Caroline": ("Vocal Standard", "Banjo"),
    "Blue Moon of Kentucky": ("Vocal Standard", "Mandolin/Fiddle"),
    "Roll in My Sweet Baby's Arms": ("Vocal Standard", "Banjo"),
    "Nine Pound Hammer": ("Vocal Standard", "Guitar/Banjo"),
    "Old Home Place": ("Vocal Standard", "Banjo"),
    "Rocky Top": ("Vocal Standard", "Banjo"),
    "Blue Ridge Cabin Home": ("Vocal Standard", "Banjo"),
    "Little Maggie": ("Vocal Standard", "Banjo"),
    "Darlin' Corey": ("Vocal Standard", "Banjo"),
    "Fox on the Run": ("Vocal Standard", "Mandolin/Vocals"),
    "Uncle Pen": ("Vocal Standard", "Fiddle"),
    "Kentucky Waltz": ("Vocal Standard", "Fiddle/Mandolin"),
}

def get_reclassification(title, current_cat, current_instr):
    if title in adjustments:
        return adjustments[title]
    
    # Default rules
    new_cat = current_cat
    if current_cat == 'Vocal':
        new_cat = 'Vocal Standard'
    
    # Handle Gospel keyword fallback if not in explicit list
    gospel_keywords = ['God', 'Lord', 'Jesus', 'Bible', 'Heaven', 'Angel', 'Pray', 'Cross', 'Church', 'Saint', 'Spirit', 'Grace', 'Building', 'Shore', 'Land', 'Sky']
    if any(k.lower() in title.lower() for k in gospel_keywords) and new_cat == 'Vocal Standard':
        new_cat = 'Gospel'

    return (new_cat, current_instr)

with open(input_file, mode='r', encoding='utf-8') as f_in:
    reader = csv.DictReader(f_in)
    fieldnames = reader.fieldnames
    
    rows = []
    for row in reader:
        new_cat, new_instr = get_reclassification(row['title'], row['category'], row['main_instrument'])
        row['category'] = new_cat
        row['main_instrument'] = new_instr
        rows.append(row)

with open(output_file, mode='w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Reclassification complete. Saved to {output_file}")
