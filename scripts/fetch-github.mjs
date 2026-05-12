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
    Accept: 'application/vnd.github.mercy-preview+json'
  } : {
    Accept: 'application/vnd.github.mercy-preview+json'
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
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        updatedAt: repo.updated_at
      }));

    // 2. Update main.json with discovered projects
    const mainPath = path.join(__dirname, '../src/content/portfolio/main.json');
    if (fs.existsSync(mainPath)) {
      const mainData = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
      
      mainData.projects = portfolioRepos.map(repo => {
        const description = typeof repo.description === 'string' && repo.description.trim().length > 0
          ? repo.description
          : null;

        return {
          name: repo.name,
          description,
          url: repo.html_url,
          topics: Array.isArray(repo.topics) ? repo.topics : [],
          language: repo.language,
          tech: [repo.language].filter(Boolean),
          stargazers_count: repo.stargazers_count,
          metrics: `${repo.stargazers_count} stars`
        };
      });

      // Clear manual spans to stabilize grid
      mainData.grid_config.project_spans = {};
      
      fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2));
      console.log(`Successfully updated ${mainData.projects.length} projects in main.json`);
    }

    // 3. Fetch recent commits across all repos (not just portfolio-tagged)
    console.log('--- Fetching Recent Commits (Direct Repo Access) ---');
    
    // Fetch 5 most recently pushed repos to find where activity is
    const reposByPushedResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5`, { headers });
    const activeRepos = await reposByPushedResponse.json();

    let allRecentCommits = [];

    if (Array.isArray(activeRepos)) {
      const commitPromises = activeRepos.map(async (repo) => {
        try {
          const commitsResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=5`, { headers });
          const commits = await commitsResponse.json();
          
          if (Array.isArray(commits)) {
            return commits.map(c => ({
              repo: repo.full_name,
              sha: c.sha.substring(0, 7),
              message: c.commit.message,
              url: c.html_url,
              timestamp: c.commit.author.date
            }));
          }
        } catch (err) {
          console.error(`Error fetching commits for ${repo.name}:`, err);
        }
        return [];
      });

      const results = await Promise.all(commitPromises);
      allRecentCommits = results.flat();
      
      // Sort by timestamp descending
      allRecentCommits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Take the 10 most recent across all repos to ensure enough data for filters
      allRecentCommits = allRecentCommits.slice(0, 10);
    }

    const latestStatus = {
      lastUpdate: new Date().toISOString(),
      pinnedRepos,
      recentActivity: allRecentCommits
    };

    const outputDir = path.join(__dirname, '../src/content/status');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'github-data.json'),
      JSON.stringify(latestStatus, null, 2)
    );

    console.log(`Successfully updated GitHub data with ${allRecentCommits.length} recent commits.`);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // Ensure the build doesn't fail, but log the error
  }
}

fetchGitHubData();
