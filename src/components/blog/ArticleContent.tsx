import { useEffect, useRef } from "react";
import { ImageCompare } from "@/components/image-compare";
import { useTheme } from "@/providers/theme";
import type { BlogPost, ContentComponent } from "@/types/content";
import { LIGHT_THEMES } from "@/utils/constants";

let mermaidRenderId = 0;

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy is not available");
}

function renderPart(html: string, key: string) {
  return <div key={key} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ArticleContent({ post }: { post: BlogPost }) {
  const rootRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const html = post.html || "";
  const marker = /<div data-image-compare="(\d+)"><\/div>/g;
  const blocks: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = marker.exec(html))) {
    if (match.index > lastIndex) blocks.push(renderPart(html.slice(lastIndex, match.index), `html-${lastIndex}`));
    const component = post.components?.[Number(match[1])] as ContentComponent | undefined;
    if (component?.type === "image-compare") {
      blocks.push(<ImageCompare key={`compare-${match[1]}`} {...component.props} />);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) blocks.push(renderPart(html.slice(lastIndex), `html-${lastIndex}`));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>(".code-copy") : null;
      if (!target || !root.contains(target)) return;

      const code = target.closest(".code-block")?.querySelector("pre code")?.textContent;
      if (!code) return;

      const originalLabel = target.textContent || "Copy";
      try {
        await copyText(code);
        target.textContent = "Copied!";
        target.classList.add("is-copied");
      } catch {
        target.textContent = "Copy failed";
      }

      window.setTimeout(() => {
        target.textContent = originalLabel;
        target.classList.remove("is-copied");
      }, 1800);
    };

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, [html]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const diagrams = Array.from(root.querySelectorAll<HTMLElement>(".mermaid-diagram"));
    if (diagrams.length === 0) return;
    let cancelled = false;

    const renderDiagrams = async () => {
      const { default: mermaid } = await import("mermaid");
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        suppressErrorRendering: true,
        theme: LIGHT_THEMES.includes(theme) ? "neutral" : "dark",
        fontFamily: '"ABC Diatype Rounded", system-ui, sans-serif',
      });

      for (const diagram of diagrams) {
        const source = diagram.dataset.mermaidSource || diagram.textContent?.trim() || "";
        diagram.dataset.mermaidSource = source;
        diagram.classList.remove("mermaid-error");

        try {
          const id = `mermaid-${post.slug}-${mermaidRenderId++}`;
          const { svg, bindFunctions } = await mermaid.render(id, source);
          if (cancelled) return;
          diagram.innerHTML = svg;
          bindFunctions?.(diagram);
        } catch (error) {
          if (cancelled) return;
          const code = document.createElement("pre");
          const message = document.createElement("p");
          code.textContent = source;
          message.textContent = error instanceof Error ? `Invalid Mermaid diagram: ${error.message}` : "Invalid Mermaid diagram";
          diagram.replaceChildren(code, message);
          diagram.classList.add("mermaid-error");
        }
      }
    };

    void renderDiagrams();
    return () => {
      cancelled = true;
    };
  }, [html, post.slug, theme]);

  return (
    <main ref={rootRef} className="article-content text-lg leading-relaxed">
      {blocks}
    </main>
  );
}
