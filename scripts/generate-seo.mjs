import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = process.env.VITE_SITE_URL || "https://lluciocc.fr";
const generated = await fs.readFile(path.join(root, "src/generated/blog-posts.ts"), "utf8");
const posts = JSON.parse(generated.match(/= (\[[\s\S]*\]) as const;/)?.[1] || "[]");
const urls = ["/", "/blog", ...posts.filter(post => !post.draft).map(post => `/blog/${post.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${siteUrl}${url}</loc></url>`).join("")}</urlset>`;
await fs.writeFile(path.join(root, "public/sitemap.xml"), sitemap);
await fs.writeFile(path.join(root, "public/robots.txt"), `User-agent: *\nAllow: /\n\nHost: ${siteUrl}\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`Generated SEO files for ${urls.length} URLs.`);
