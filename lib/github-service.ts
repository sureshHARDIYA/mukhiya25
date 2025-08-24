// GitHub API service to fetch repository information
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  homepage: string | null;
  archived: boolean;
  disabled: boolean;
  visibility: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface ProcessedProject {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  homepage?: string;
  topics: string[];
}

class GitHubService {
  private readonly baseUrl = "https://api.github.com";
  private readonly username: string;

  constructor(username: string) {
    this.username = username;
  }

  /**
   * Fetch all public repositories for the user
   */
  async fetchRepositories(): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${this.username}/repos?type=public&sort=updated&per_page=100`
      );

      if (!response.ok) {
        if (response.status === 403) {
          console.warn("GitHub API rate limit exceeded, using fallback data");
          return [];
        }
        console.warn(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const repos: GitHubRepo[] = await response.json();

      // Filter out archived and disabled repos, sort by stars and recent activity
      return repos
        .filter((repo) => !repo.archived && !repo.disabled)
        .sort((a, b) => {
          // Sort by stars first, then by last push date
          if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count;
          }
          return (
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
          );
        });
    } catch (error) {
      console.error("Error fetching repositories:", error);
      return [];
    }
  }

  /**
   * Fetch languages used in a specific repository
   */
  async fetchRepoLanguages(repo: GitHubRepo): Promise<string[]> {
    try {
      const response = await fetch(repo.languages_url);

      if (!response.ok) {
        return repo.language ? [repo.language] : [];
      }

      const languages: GitHubLanguages = await response.json();

      // Sort languages by usage (bytes of code) and return top languages
      return Object.keys(languages)
        .sort((a, b) => languages[b] - languages[a])
        .slice(0, 5); // Top 5 languages
    } catch (error) {
      console.error("Error fetching repo languages:", error);
      return repo.language ? [repo.language] : [];
    }
  }

  /**
   * Process repositories into project format
   */
  async processRepositories(
    repos: GitHubRepo[],
    limit: number = 10
  ): Promise<ProcessedProject[]> {
    const processedProjects: ProcessedProject[] = [];

    // Process repos in batches to avoid rate limiting
    for (let i = 0; i < Math.min(repos.length, limit); i++) {
      const repo = repos[i];

      try {
        // Get languages for this repo
        const technologies = await this.fetchRepoLanguages(repo);

        // Add topics as additional technologies
        const allTechnologies = [...new Set([...technologies, ...repo.topics])];

        const project: ProcessedProject = {
          name: repo.name,
          description: repo.description || "No description available",
          technologies: allTechnologies,
          link: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Unknown",
          lastUpdated: repo.pushed_at,
          homepage: repo.homepage || undefined,
          topics: repo.topics,
        };

        processedProjects.push(project);

        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing repo ${repo.name}:`, error);
      }
    }

    return processedProjects;
  }

  /**
   * Get featured projects (top starred, recently updated, or specific repos)
   */
  async getFeaturedProjects(
    featuredRepoNames?: string[]
  ): Promise<ProcessedProject[]> {
    const allRepos = await this.fetchRepositories();

    // If GitHub API failed (rate limit or other error), return fallback data
    if (allRepos.length === 0) {
      return this.getFallbackProjects();
    }

    if (featuredRepoNames && featuredRepoNames.length > 0) {
      // Filter for specific featured repositories
      const featuredRepos = allRepos.filter((repo) =>
        featuredRepoNames.includes(repo.name)
      );
      return this.processRepositories(featuredRepos);
    }

    // Return top repositories based on stars and activity
    const topRepos = allRepos.slice(0, 6);
    return this.processRepositories(topRepos);
  }

  /**
   * Fallback projects when GitHub API is unavailable
   */
  private getFallbackProjects(): ProcessedProject[] {
    return [
      {
        name: "mukhiya25",
        description: "Personal portfolio website built with Next.js and TypeScript, featuring an AI-powered chatbot for interactive portfolio exploration.",
        technologies: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Supabase"],
        link: "https://github.com/sureshHARDIYA/mukhiya25",
        stars: 0,
        forks: 0,
        language: "TypeScript",
        lastUpdated: "2025-01-24",
        topics: ["portfolio", "nextjs", "chatbot", "ai"]
      },
      {
        name: "idpt",
        description: "Intelligent Digital Platform for healthcare research and data management, focusing on digital health solutions.",
        technologies: ["Python", "Django", "PostgreSQL", "Docker"],
        link: "https://github.com/sureshHARDIYA/idpt",
        stars: 0,
        forks: 0,
        language: "Python",
        lastUpdated: "2024-12-15",
        topics: ["healthcare", "research", "data-management"]
      },
      {
        name: "phd-resources",
        description: "Comprehensive collection of resources, tools, and templates for PhD students in Computer Science and Digital Health.",
        technologies: ["Markdown", "LaTeX", "Python", "R"],
        link: "https://github.com/sureshHARDIYA/phd-resources",
        stars: 0,
        forks: 0,
        language: "Python",
        lastUpdated: "2024-11-20",
        topics: ["phd", "research", "academia", "resources"]
      },
      {
        name: "web-components",
        description: "Modern, reusable web components library built with Web Standards and TypeScript for cross-framework compatibility.",
        technologies: ["TypeScript", "Web Components", "CSS", "JavaScript"],
        link: "https://github.com/sureshHARDIYA/web-components",
        stars: 0,
        forks: 0,
        language: "TypeScript",
        lastUpdated: "2024-10-30",
        topics: ["web-components", "typescript", "frontend"]
      }
    ];
  }
}

// Export a configured instance
export const githubService = new GitHubService("sureshHARDIYA"); // Replace with actual GitHub username

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to get technology colors
export function getTechColor(tech: string): string {
  const colors: { [key: string]: string } = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Python: "#3776AB",
    React: "#61DAFB",
    "Next.js": "#000000",
    "Node.js": "#339933",
    "Vue.js": "#4FC08D",
    Angular: "#DD0031",
    Go: "#00ADD8",
    Rust: "#000000",
    Java: "#ED8B00",
    "C++": "#00599C",
    "C#": "#239120",
    PHP: "#777BB4",
    Ruby: "#CC342D",
    Swift: "#FA7343",
    Kotlin: "#0095D5",
    Dart: "#0175C2",
    HTML: "#E34F26",
    CSS: "#1572B6",
    SCSS: "#CF649A",
    Docker: "#2496ED",
    Kubernetes: "#326CE5",
    AWS: "#FF9900",
    Firebase: "#FFCA28",
    MongoDB: "#47A248",
    PostgreSQL: "#336791",
    MySQL: "#4479A1",
    Redis: "#DC382D",
    GraphQL: "#E10098",
    REST: "#FF6B6B",
    API: "#4ECDC4",
  };

  return colors[tech] || "#6B7280"; // Default gray color
}
