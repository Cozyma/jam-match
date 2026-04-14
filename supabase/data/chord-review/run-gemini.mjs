import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, appendFileSync } from "fs";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: node run-gemini.mjs <API_KEY>");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Read prompts file and split into batches
const raw = readFileSync("supabase/data/chord-review/prompts.txt", "utf-8");
const batches = raw.split(/^=== Batch \d+.*===$/m).filter((b) => b.trim());

console.log(`Total batches: ${batches.length}`);

const outFile = "supabase/data/chord-review/gemini-results.csv";
writeFileSync(outFile, "title,main_instrument,tempo,original_key,chords\n");

for (let i = 0; i < batches.length; i++) {
  const prompt = batches[i].trim();
  if (!prompt) continue;

  console.log(`\n--- Batch ${i + 1}/${batches.length} ---`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    // Extract CSV lines (skip empty lines and lines that don't look like CSV data)
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("title,") && !l.startsWith("```") && l.includes(","));

    for (const line of lines) {
      console.log(line);
      appendFileSync(outFile, line + "\n");
    }

    // Rate limit: wait 4 seconds between requests (free tier: 15 RPM)
    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 4000));
    }
  } catch (err) {
    console.error(`Batch ${i + 1} failed:`, err.message);
    appendFileSync(outFile, `# ERROR batch ${i + 1}: ${err.message}\n`);
    // Wait longer on error (might be rate limited)
    await new Promise((r) => setTimeout(r, 10000));
  }
}

console.log(`\nDone. Results saved to ${outFile}`);
