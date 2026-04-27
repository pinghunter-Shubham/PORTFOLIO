import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import type { ReactNode } from 'react'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Read and compile a single MDX blog post by slug.
 * Returns the rendered React node.
 */
export async function getBlogPost(slug: string): Promise<ReactNode> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')

  const { content } = await compileMDX({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark-dimmed',
              keepBackground: true,
            },
          ],
        ],
      },
    },
  })

  return content
}
