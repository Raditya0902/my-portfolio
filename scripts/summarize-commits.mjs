import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USERNAME = 'Raditya0902';

async function summarize() {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found. Skipping summarization.");
    return;
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // 1. Fetch recent commit messages
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
    const data = await response.json();
    
    const messages = data
      .filter(event => event.type === 'PushEvent')
      .slice(0, 10)
      .flatMap(event => event.payload.commits.map(c => c.message))
      .join('\n');

    if (!messages) {
      console.log("No recent commits found to summarize.");
      return;
    }

    // 2. Summarize with Gemini
    const prompt = `Based on these recent GitHub commit messages, write a one-sentence "Current Focus" for a portfolio website. It should be professional, technical, and start with an active verb. \n\nCommits:\n${messages}`;
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    // 3. Save to src/content/status/summary.json
    const outputDir = path.join(__dirname, '../src/content/status');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'summary.json'),
      JSON.stringify({ focus: summary, lastUpdated: new Date().toISOString() }, null, 2)
    );

    console.log('Successfully generated AI summary:', summary);
  } catch (error) {
    console.error('Error during summarization:', error);
  }
}

summarize();