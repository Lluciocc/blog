export const siteConfig = {
  name: "Lluciocc",
  url: import.meta.env.VITE_SITE_URL || "https://lluciocc.fr",
  title: "Lluciocc — Personal journal",
  description: "Notes, ideas, and experiments by Lluciocc.",
  author: "Lluciocc",
  locale: "en-US",
  social: {
    github: "https://github.com/lluciocc",
    x: "https://x.com/lluciocc",
    linkedin: "https://www.linkedin.com/in/lluciocc",
    email: "mailto:bonjour@lluciocc.fr",
  },
} as const;
