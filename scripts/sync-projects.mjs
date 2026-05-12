import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'Raditya0902';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-flash-latest" }) : null;

async function fetchAllRepos() {
  console.log('--- Phase 1: Discovering Repositories ---');
  const headers = GITHUB_TOKEN ? { 
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  } : {
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers });
    const allRepos = await reposResponse.json();

    if (!Array.isArray(allRepos)) {
      throw new Error(`Failed to fetch repos: ${JSON.stringify(allRepos)}`);
    }

    const filteredRepos = allRepos.filter(repo => {
      const isFork = repo.fork;
      const hasPortfolioTopic = repo.topics?.includes('portfolio');
      const isMetaRepo = repo.name === 'my-portfolio' || repo.name === GITHUB_USERNAME;
      return !isFork && !isMetaRepo && hasPortfolioTopic;
    });

    console.log(`Found ${filteredRepos.length} candidate projects.`);
    return filteredRepos;
  } catch (error) {
    console.error('Discovery Error:', error);
    return [];
  }
}

async function getProjectMetadata(repo, headers) {
  console.log(`--- Phase 2: AI Analysis for ${repo.name} ---`);
  
  let readme = 'Project documentation pending';
  try {
    const readmeResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`, { headers });
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      readme = Buffer.from(readmeData.content, 'base64').toString('utf8').substring(0, 3000);
    }
  } catch (e) {
    console.warn(`No README for ${repo.name}`);
  }

  const fallbackMeta = {
    name: repo.name,
    description: repo.description || "Project documentation pending",
    url: repo.html_url,
    tech: [repo.language].filter(Boolean),
    metrics: `${repo.stargazers_count} stars`
  };

  if (!model) return fallbackMeta;

  const prompt = `
    Analyze this GitHub repository for a "Systems Architect" portfolio:
    Name: ${repo.name}
    Description: ${repo.description}
    Language: ${repo.language}
    README Snippet: ${readme}

    Generate a JSON object with:
    - description: One-sentence, high-density, technical impact statement starting with an active verb.
    - tech: Array of 3-5 detected languages/frameworks.
    - metrics: A high-signal metric (e.g. "95% accuracy", "Latency < 200ms", or "Stars: ${repo.stargazers_count}").

    Return ONLY the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const meta = JSON.parse(cleaned);

    return {
      name: repo.name,
      description: meta.description || fallbackMeta.description,
      url: repo.html_url,
      tech: meta.tech || fallbackMeta.tech,
      metrics: meta.metrics || fallbackMeta.metrics
    };
  } catch (error) {
    console.error(`AI Analysis failed for ${repo.name}, using fallback:`, error.message);
    return fallbackMeta;
  }
}

async function runAutomation() {
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
  const repos = await fetchAllRepos();
  
  const projects = [];
  for (const repo of repos) {
    const meta = await getProjectMetadata(repo, headers);
    projects.push(meta);
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const mainPath = path.join(__dirname, '../src/content/portfolio/main.json');
  const mainData = JSON.parse(fs.readFileSync(mainPath, 'utf8'));

  const primaryProjectNames = [
    "Multi-Agent Production Incident Response System",
    "RAG RBAC Chatbot",
    "Real-Time Graph Analytics Pipeline"
  ];

  const primaryProjects = mainData.projects.filter(p => primaryProjectNames.includes(p.name));
  const newDiscovered = projects.filter(p => !primaryProjectNames.includes(p.name));
mainData.projects = [...primaryProjects, ...newDiscovered];

// Prune and Update Grid Spans
const activeProjectNames = mainData.projects.map(p => p.name);
const newSpans = {};

// Preserve spans for active projects, add defaults for new ones
activeProjectNames.forEach(name => {
  newSpans[name] = mainData.grid_config.project_spans[name] || "col-span-1 row-span-1";
});

mainData.grid_config.project_spans = newSpans;

fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2));
  console.log(`--- Automation Complete: ${mainData.projects.length} projects synced ---`);
}

runAutomation();