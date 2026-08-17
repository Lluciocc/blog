---
title: "Markdown showcase"
slug: "markdown-showcase"
date: "2026-08-17"
description: "A showcase of the complete Markdown support available on this blog."
banner: "/profile.png"
labels: ["Markdown", "Test"]
authors: ["Lluciocc", "Boro700"]
---

This acticle showcases the Markdown features supported by the blog, from basic text formatting to code, diagrams, mathematics, alerts, and native HTML.

# Heading level 1

## Heading level 2

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

## Text and links

Regular text, **bold**, *italic*, ***bold italic***, ~~strikethrough~~, `inline code`, and an [external link](https://commonmark.org).

This line uses a soft break.
It must remain visible as a line break.

## Lists and tasks

- Unordered item
  - Nested item
    1. Ordered item
    2. Second ordered item
- Another item

- [x] Complete Markdown pipeline
- [ ] Publish this test page

## Table

| Feature | Syntax | Status |
| :--- | :---: | ---: |
| Tables | GFM | Complete |
| Tasks | GFM | Complete |

## Quotes and alerts

> A regular blockquote can contain **formatted text**.

> [!NOTE]
> GitHub-style notes are supported.

> [!WARNING]
> Alerts can contain several lines and **rich Markdown**.

## Code

```typescript
type Markdown = {
  complete: boolean;
  diagrams: "mermaid";
};
```

## Mermaid diagram

```mermaid
flowchart LR
  A[Markdown] --> B[Unified]
  B --> C[HTML]
  C --> D[React]
  D --> E[Blog post]
```

## Mathematics

Inline mathematics: $E = mc^2$.

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Footnotes

Markdown can include explanatory notes without interrupting the text.[^note]

[^note]: This is a footnote with **formatting** and a return link.

## Native HTML

<details>
  <summary>Open the details</summary>
  <p>Raw HTML remains available for trusted local articles, including <kbd>Ctrl</kbd> + <kbd>K</kbd> and <mark>highlighted text</mark>.</p>
</details>

---

End of the Markdown showcase.
