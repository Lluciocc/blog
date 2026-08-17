export const siteConfig = {
  name: "Lluciocc",
  url: import.meta.env.VITE_SITE_URL || "https://blog.lluciocc.fr",
  title: "Lluciocc - Blog",
  description: "Notes, ideas, and experiments by Lluciocc.",
  author: "Lluciocc",
  locale: "en-US",
  social: {
    github: "https://github.com/lluciocc",
    x: "https://x.com/lluciocc",
    linkedin: "https://www.linkedin.com/in/lluciocc",
    email: "mailto:lucas.cialdella57@gmail.com",
  },
} as const;
