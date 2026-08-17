# Lluciocc

Lluciocc’s personal site, available at [https://lluciocc.fr](https://lluciocc.fr). The project uses Vite, React, TypeScript, React Router, and Tailwind CSS.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` starts the Vite server.
- `npm run build` generates Markdown/MDX content, the sitemap, and the production build.
- `npm run preview` previews the build.
- `npm run typecheck` checks TypeScript.
- `npm run lint` runs Biome.

## Adding a post

Add a `.md` or `.mdx` file to `src/content/blog/` with similar frontmatter:

```yaml
---
title: "My new post"
slug: "my-new-post"
date: "2026-08-13"
description: "A short SEO description."
banner: "https://images.unsplash.com/..."
labels: ["Notes"]
authors: ["Lluciocc"]
draft: false
---
```

The file is converted statically during `npm run build`. Posts with `draft: true` are hidden in production. A complete private rendering reference is available in development at `/blog/markdown-showcase`.

### Supported Markdown

- CommonMark and GitHub Flavored Markdown: headings `#` through `######`, emphasis, links, images, blockquotes, nested lists, task lists, tables, autolinks, strikethrough, footnotes, and horizontal rules.
- Fenced code blocks with Shiki syntax highlighting and a copy button.
- Mermaid diagrams through a fenced `mermaid` block.
- KaTeX mathematics with `$...$` inline and `$$...$$` on a separate block.
- GitHub alerts such as `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]`.
- Trusted raw HTML, including `details`, `summary`, `kbd`, `mark`, audio, video, and iframes.
- The `ImageCompare` MDX component remains available in `.mdx` files.

Mermaid is loaded only on pages that contain a diagram. Raw HTML is intended only for repository-owned content; never pass untrusted user input to the content generator.

## Supabase

Likes and signatures use only the public Supabase key in the browser. Configure these variables in `.env`:

```bash
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

The `service_role` key must never be added to this project. The `increment_likes` and `decrement_likes` RPC functions, along with the `likes` and `signs` tables, must exist in the Supabase project. Without Supabase configuration, the site remains browsable but dynamic interactions are disabled.

## Deployment

The `dist/` directory can be deployed to Vercel, Netlify, Cloudflare Pages, or any static host. Configure the SPA fallback so `/blog/my-post` also serves `index.html` after a direct refresh. To change the canonical URL, set `VITE_SITE_URL`; the default is `https://lluciocc.fr`.
