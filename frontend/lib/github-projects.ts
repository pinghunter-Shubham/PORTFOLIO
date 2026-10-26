import type { Project } from '@/lib/data'

interface GitHubRepository {
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  topics?: string[]
  fork: boolean
  archived: boolean
  size: number
}

function categoryFor(topics: string[], language: string | null): Project['category'] {
  if (topics.some((topic) => ['computer-vision', 'opencv', 'image-processing'].includes(topic))) return 'Computer Vision'
  if (topics.some((topic) => ['research', 'nlp', 'legal-tech'].includes(topic))) return 'Research'
  if (topics.some((topic) => ['iot', 'embedded', 'hardware'].includes(topic))) return 'IoT / Embedded'
  if (topics.some((topic) => ['machine-learning', 'deep-learning', 'artificial-intelligence', 'ai', 'llm'].includes(topic))) return 'ML / AI'
  if (language?.toLowerCase() === 'python') return 'Python'
  return 'Software'
}

function titleFromRepository(name: string): string {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Show substantive public repositories automatically. The one-hour cache lets
 * newly created or updated repositories appear without a site redeploy.
 */
export async function getAutoProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      'https://api.github.com/users/pinghunter-Shubham/repos?type=owner&sort=updated&per_page=100',
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) return []

    const repositories = (await response.json()) as GitHubRepository[]

    return repositories
      .filter((repo) =>
        !repo.fork &&
        !repo.archived &&
        repo.size > 0 &&
        !['PORTFOLIO', 'pinghunter-Shubham'].includes(repo.name),
      )
      .map((repo) => {
        const topics = repo.topics ?? []
        const homepage = repo.homepage ?? ''
        const demo = /^https?:\/\//.test(homepage) ? homepage : '#'
        const title = titleFromRepository(repo.name)

        return {
          id: repo.full_name,
          title,
          category: categoryFor(topics, repo.language),
          description: repo.description?.trim() || `Explore the source code and implementation for ${title} in this repository.`,
          tech: [...new Set([repo.language, ...topics].filter((value): value is string => Boolean(value)))].slice(0, 5),
          hasDemo: demo !== '#',
          github: repo.html_url,
          demo,
        }
      })
  } catch {
    return []
  }
}
