#!/usr/bin/env python3
"""
Script to merge gemini_translation.json and thirukkural.json
Creates a new JSON with english_mk_translation field
"""

import json
import os

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Read the files
    thirukkural_path = os.path.join(project_root, 'src/data/thirukkural.json')
    gemini_path = os.path.join(project_root, 'src/data/gemini_translation.json')
    output_path = os.path.join(project_root, 'src/data/thirukural_with_mk.json')
    
    print(f"Reading {thirukkural_path}...")
    with open(thirukkural_path, 'r', encoding='utf-8') as f:
        thirukkural_data = json.load(f)
    
    print(f"Reading {gemini_path}...")
    with open(gemini_path, 'r', encoding='utf-8') as f:
        gemini_data = json.load(f)
    
    # Parse the gemini response which contains a JSON string
    gemini_response_str = gemini_data.get('response', '[]')
    gemini_translations = json.loads(gemini_response_str)
    
    # Create a lookup map: kural_number -> english_mk_translation
    mk_translation_map = {}
    for item in gemini_translations:
        kural_num = item.get('kural number')
        translation = item.get('english mk translation')
        if kural_num and translation:
            mk_translation_map[kural_num] = translation
    
    print(f"Loaded {len(mk_translation_map)} MK translations")
    
    # thirukkural.json has a structure with 'kural' key containing list of kurals
    kurals_list = thirukkural_data.get('kural', [])
    merged_kurals = []
    
    for kural in kurals_list:
        kural_number = kural.get('Number')
        if kural_number in mk_translation_map:
            kural['english_mk_translation'] = mk_translation_map[kural_number]
        else:
            print(f"Warning: No MK translation found for kural #{kural_number}")
        
        merged_kurals.append(kural)
    
    # Preserve the original structure
    merged_data = {
        'kural': merged_kurals,
        'repo': thirukkural_data.get('repo', '')
    }
    
    # Write the merged file
    print(f"Writing merged data to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Merged JSON created successfully with {len(merged_data)} kurals")
    
    # Verify some entries
    print("\nSample entries:")
    for i in range(min(5, len(merged_kurals))):
        kural = merged_kurals[i]
        mk_translation = kural.get('english_mk_translation', 'NO TRANSLATION')
        kural_num = kural.get('Number', 'N/A')
        print(f"  Kural #{kural_num}: {mk_translation[:80]}...")

if __name__ == '__main__':
    main()
