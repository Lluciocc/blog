import { blogPosts } from "@/generated/blog-posts";
import type { BlogCard, BlogPost } from "@/types/content";

const visiblePosts = (): BlogPost[] =>
  blogPosts
    .filter(post => !post.draft || import.meta.env.DEV)
    .map(post => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.formattedDate,
      publishedAt: post.date,
      banner: post.banner,
      labels: [...post.labels],
      authors: post.authors.map(author => ({ ...author })),
      draft: post.draft,
      readingTime: post.readingTime,
      html: post.html,
      components: post.components.map(component => ({ ...component, props: { ...component.props } })),
    }));

export function getAllPosts(): BlogPost[] {
  return visiblePosts();
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return visiblePosts().find(post => post.slug === slug);
}

export function getAllBlogs(): BlogCard[] {
  return getAllPosts().map((post, index) => ({
    id: index + 1,
    title: post.title,
    description: post.description,
    image: post.banner,
    link: `/blog/${post.slug}`,
    labels: post.labels,
  }));
}
