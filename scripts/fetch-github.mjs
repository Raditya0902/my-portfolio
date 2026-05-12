import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'Raditya0902';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubData() {
  console.log('--- Fetching GitHub Data ---');
  
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

  try {
    // 1. Fetch Pinned Repos (simulated by fetching top 6 starred/recent repos if no GraphQL token)
    // For a real production app, use GraphQL for pinned repos.
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`, { headers });
    const repos = await reposResponse.json();

    if (!Array.isArray(repos)) {
      throw new Error('Failed to fetch repositories');
    }

    const pinnedRepos = repos
      .filter(repo => !repo.fork)
      .slice(0, 6)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at
      }));

    // 2. Fetch recent contributions (commits) for the status card
    const eventsResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`, { headers });
    const events = await eventsResponse.json();
    
    const pushEvents = Array.isArray(events) 
      ? events.filter(e => e.type === 'PushEvent' && e.payload.commits && e.payload.commits.length > 0).slice(0, 5)
      : [];

    const latestStatus = {
      lastUpdate: new Date().toISOString(),
      pinnedRepos,
      recentActivity: pushEvents.map(event => ({
        repo: event.repo.name,
        message: event.payload.commits[0].message,
        url: `https://github.com/${event.repo.name}/commit/${event.payload.commits[0].sha}`,
        timestamp: event.created_at
      }))
    };

    const outputDir = path.join(__dirname, '../src/content/status');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'github-data.json'),
      JSON.stringify(latestStatus, null, 2)
    );

    console.log('Successfully updated GitHub data at src/content/status/github-data.json');
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // Ensure the build doesn't fail, but log the error
  }
}

fetchGitHubData();