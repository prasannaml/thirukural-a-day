import fs from 'fs';
import path from 'path';
import { v2 as Translate } from '@googlecloud/translate';

const CREDENTIALS_PATH = 'path/to/your/google-credentials.json'; // Update this
const JSON_PATH = path.join(__dirname, '../src/data/thirukkural.json');
const TARGET_LANGUAGE = 'en'; // Change as needed

// Initialize Google Translate client
const translate = new Translate.Translate({
  keyFilename: CREDENTIALS_PATH,
});

async function main() {
  // Load JSON
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  // Collect all "mv" fields
  const texts = data.map((item: any) => item.mv);

  // Batch translate (Google API allows up to 128 items per request)
  const BATCH_SIZE = 100;
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const [translations] = await translate.translate(batch, TARGET_LANGUAGE);

    // Update "explanation" field
    for (let j = 0; j < batch.length; j++) {
      data[i + j].explanation = Array.isArray(translations)
        ? translations[j]
        : translations;
    }
    console.log(`Translated batch ${i / BATCH_SIZE + 1}`);
  }

  // Save updated JSON
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated thirukkural.json with new explanations.');
}

main().catch(console.error);
