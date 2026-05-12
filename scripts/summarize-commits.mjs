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
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  try {
    // 1. Fetch recent commit messages using Search API (more reliable for messages)
    const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
    const response = await fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&sort=author-date&order=desc&per_page=15`, {
      headers: {
        ...headers,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    
    let messages = '';
    if (data.items && Array.isArray(data.items)) {
      messages = data.items.map(item => item.commit.message).join('\n');
    } else {
      // Fallback to events API
      const eventsResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`, { headers });
      const events = await eventsResponse.json();
      if (Array.isArray(events)) {
        messages = events
          .filter(event => event.type === 'PushEvent')
          .slice(0, 10)
          .flatMap(event => (event.payload.commits || []).map(c => c.message))
          .join('\n');
      }
    }

    if (!messages) {
      console.log("No recent commits found to summarize.");
      return;
    }

    // 2. Summarize with Gemini
    const prompt = `Based on these recent GitHub commit messages, write a one-sentence "Current Focus" for a portfolio website. It should be professional, technical, and start with an active verb. \n\nCommits:\n${messages}`;
    
    let summary;
    try {
      const result = await model.generateContent(prompt);
      summary = result.response.text().trim();
    } catch (aiError) {
      console.error('AI summarization failed, using fallback:', aiError.message);
      summary = "Developing advanced AI systems and distributed infrastructure.";
    }

    // 3. Save to src/content/status/summary.json
    const outputDir = path.join(__dirname, '../src/content/status');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'summary.json'),
      JSON.stringify({ focus: summary, lastUpdated: new Date().toISOString() }, null, 2)
    );

    console.log('Successfully updated AI summary:', summary);
  } catch (error) {
    console.error('Error during summarization:', error);
  }
}

summarize();