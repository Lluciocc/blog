import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { format } from "date-fns";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { codeToHast } from "shiki";
import { unified } from "unified";

const root = process.cwd();
const contentDir = path.join(root, "src/content/blog");
const outputFile = path.join(root, "src/generated/blog-posts.ts");

const parseList = value => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  return value.split(",").map(item => item.trim()).filter(Boolean);
};

const parseAuthors = value => {
  const authors = Array.isArray(value) ? value : parseList(value);

  return authors
    .map(author => {
      if (author && typeof author === "object") {
        return {
          name: String(author.name || "").trim(),
          logo: String(author.logo || "").trim(),
        };
      }

      const name = String(author).trim();
      return {
        name,
        logo: name.toLowerCase() === "lluciocc" ? "/profile.png" : "",
      };
    })
    .filter(author => author.name);
};

const parseImageCompare = source => {
  const components = [];
  const body = source.replace(/<ImageCompare\s+([\s\S]*?)\s*\/?>/g, (_, attributes) => {
    const props = {};
    for (const match of attributes.matchAll(/(before|after|beforeAlt|afterAlt|beforeLabel|afterLabel)=["']([^"']*)["']/g)) {
      props[match[1]] = match[2];
    }
    components.push({ type: "image-compare", props });
    return `\n\n__LLUCIOCC_IMAGE_COMPARE_${components.length - 1}__\n\n`;
  });
  return { body, components };
};

const textContent = node => {
  if (node.type === "text") return node.value;
  return (node.children || []).map(textContent).join("");
};

const classNames = node => {
  const value = node?.properties?.className;
  return Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(" ") : [];
};

const highlightCode = () => async tree => {
  const visit = async node => {
    if (!node.children) return;

    for (let index = 0; index < node.children.length; index += 1) {
      const child = node.children[index];
      const code = child.type === "element" && child.tagName === "pre" ? child.children?.[0] : null;
      const language = classNames(code)
        .find(value => value.startsWith("language-"))
        ?.replace("language-", "");

      if (code?.tagName === "code" && language && language !== "mermaid") {
        try {
          const highlighted = await codeToHast(textContent(code), {
            lang: language,
            theme: "github-dark",
          });
          highlighted.children[0].properties.dataLanguage = language;
          node.children[index] = highlighted.children[0];
          continue;
        } catch {
          // Keep the original code block when Shiki does not know the language.
        }
      }

      await visit(child);
    }
  };

  await visit(tree);
};

const enhanceHtml = () => tree => {
  const visit = node => {
    if (!node.children) return;

    node.children = node.children.map(child => {
      if (child.type !== "element") return child;

      if (child.tagName === "a" && typeof child.properties?.href === "string") {
        const href = child.properties.href;
        if (/^https?:\/\//i.test(href)) {
          child.properties.target = "_blank";
          child.properties.rel = ["noopener", "noreferrer"];
        }
      }

      if (child.tagName === "table") {
        visit(child);
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"], role: "region", tabIndex: 0 },
          children: [child],
        };
      }

      if (child.tagName === "pre") {
        const code = child.children?.find(item => item.type === "element" && item.tagName === "code");
        const language =
          (typeof child.properties?.dataLanguage === "string" ? child.properties.dataLanguage : undefined) ||
          classNames(code)
            .find(value => value.startsWith("language-"))
            ?.replace("language-", "");

        if (language === "mermaid") {
          return {
            type: "element",
            tagName: "div",
            properties: {
              className: ["mermaid-diagram"],
              role: "img",
              ariaLabel: "Mermaid diagram",
            },
            children: [{ type: "text", value: textContent(code).trim() }],
          };
        }

        return {
          type: "element",
          tagName: "div",
          properties: { className: ["code-block"] },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: { className: ["code-block-toolbar"] },
              children: [
                { type: "element", tagName: "span", properties: {}, children: [{ type: "text", value: language || "text" }] },
                {
                  type: "element",
                  tagName: "button",
                  properties: { type: "button", className: ["code-copy"], ariaLabel: "Copy code" },
                  children: [{ type: "text", value: "Copy" }],
                },
              ],
            },
            child,
          ],
        };
      }

      visit(child);
      return child;
    });
  };

  visit(tree);
};

const parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkBreaks)
  .use(remarkAlert)
  .use(remarkRehype, {
    allowDangerousHtml: true,
    footnoteLabel: "Footnotes",
    footnoteBackLabel: "Back to content",
  })
  .use(rehypeRaw)
  .use(highlightCode)
  .use(rehypeKatex)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "prepend",
    properties: { className: ["heading-anchor"], ariaLabel: "Link to this section" },
    content: { type: "text", value: "#" },
  })
  .use(enhanceHtml)
  .use(rehypeStringify);

const files = (await fs.readdir(contentDir)).filter(file => /\.mdx?$/.test(file));
const posts = [];

for (const file of files) {
  const source = await fs.readFile(path.join(contentDir, file), "utf8");
  const { data, content } = matter(source);
  const slug = String(data.slug || file.replace(/\.mdx?$/, ""));
  const parsed = parseImageCompare(content);
  const processed = await parser.process(parsed.body);
  const html = String(processed);
  const authors = parseAuthors(data.authors);

  posts.push({
    title: String(data.title || slug),
    description: String(data.description || ""),
    date: new Date(data.date || Date.now()).toISOString(),
    formattedDate: format(new Date(data.date || Date.now()), "LLL dd, yyyy"),
    slug,
    banner: String(data.banner || "/profile.png"),
    labels: parseList(data.labels),
    authors: authors.length ? authors : [{ name: "Lluciocc", logo: "/profile.png" }],
    draft: data.draft === true || data.draft === "true",
    readingTime: readingTime(content).text,
    html: html.replace(/<p>(?:<strong>)?_*LLUCIOCC_IMAGE_COMPARE_(\d+)_*(?:<\/strong>)?<\/p>/g, '<div data-image-compare="$1"></div>'),
    components: parsed.components,
  });
}

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(
  outputFile,
  `/* Generated by scripts/generate-content.mjs. Do not edit manually. */\nexport const blogPosts = ${JSON.stringify(posts, null, 2)} as const;\n`,
);
console.log(`Generated ${posts.length} blog posts.`);
