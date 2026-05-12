import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'Raditya0902';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubData() {
  console.log('--- Fetching GitHub Data ---');
  
  const headers = GITHUB_TOKEN ? { 
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  } : {
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    // 1. Fetch all repos to filter by topic
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });
    const allRepos = await reposResponse.json();

    if (!Array.isArray(allRepos)) {
      throw new Error('Failed to fetch repositories');
    }

    const portfolioRepos = allRepos.filter(repo => repo.topics?.includes('portfolio'));
    console.log(`Discovered ${portfolioRepos.length} projects with 'portfolio' topic.`);

    const pinnedRepos = portfolioRepos
      .slice(0, 6)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at
      }));

    // 2. Update main.json with discovered projects
    const mainPath = path.join(__dirname, '../src/content/portfolio/main.json');
    if (fs.existsSync(mainPath)) {
      const mainData = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
      
      mainData.projects = portfolioRepos.map(repo => ({
        name: repo.name,
        description: repo.description || "Project documentation pending",
        url: repo.html_url,
        tech: [repo.language].filter(Boolean),
        metrics: `${repo.stargazers_count} stars`
      }));

      // Clear manual spans to stabilize grid
      mainData.grid_config.project_spans = {};
      
      fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2));
      console.log(`Successfully updated ${mainData.projects.length} projects in main.json`);
    }

    // 3. Fetch recent contributions (commits) for the status card
    // The events API can be unreliable for commit messages, so we'll use a search or specific repo fetch if needed.
    // For now, let's try to get the most recent commits from the user's public activity.
    const searchResponse = await fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&sort=author-date&order=desc&per_page=5`, { 
      headers: {
        ...headers,
        'Accept': 'application/vnd.github.v3+json'
      } 
    });
    const searchData = await searchResponse.json();
    
    let recentActivity = [];
    if (searchData.items && Array.isArray(searchData.items)) {
      recentActivity = searchData.items.map(item => ({
        repo: item.repository.full_name,
        message: item.commit.message,
        url: item.html_url,
        timestamp: item.commit.author.date
      }));
    } else {
      console.warn('Commit search failed, falling back to events API:', searchData);
      const eventsEndpoint = GITHUB_TOKEN 
        ? `https://api.github.com/users/${GITHUB_USERNAME}/events`
        : `https://api.github.com/users/${GITHUB_USERNAME}/events/public`;
      
      const eventsResponse = await fetch(eventsEndpoint, { headers });
      const events = await eventsResponse.json();
      
      if (Array.isArray(events)) {
        const pushEvents = events.filter(e => e.type === 'PushEvent').slice(0, 5);
        recentActivity = pushEvents.map(event => ({
          repo: event.repo.name,
          message: event.payload.commits?.[0]?.message || 'Pushed commits',
          url: event.payload.commits?.[0] 
            ? `https://github.com/${event.repo.name}/commit/${event.payload.commits[0].sha}`
            : `https://github.com/${event.repo.name}/commits/${event.payload.ref.split('/').pop()}`,
          timestamp: event.created_at
        }));
      }
    }

    const latestStatus = {
      lastUpdate: new Date().toISOString(),
      pinnedRepos,
      recentActivity
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