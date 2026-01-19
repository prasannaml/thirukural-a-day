import json
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH = os.path.join(BASE_DIR, '../src/data/thirukkural.json')
OUTPUT_PATH = os.path.join(BASE_DIR, '../src/data/thirukkural_number_mk.json')

def main():
    with open(INPUT_PATH, 'r', encoding='utf-8') as infile:
        data = json.load(infile)
    # data["kural"] is the array
    filtered = [
        {'Number': item['Number'], 'mk': item['mk']}
        for item in data.get('kural', [])
        if 'Number' in item and 'mk' in item
    ]
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as outfile:
        json.dump(filtered, outfile, ensure_ascii=False, indent=2)
    print('Created thirukkural_number_mk.json with Number and mk fields.')

if __name__ == '__main__':
    main()