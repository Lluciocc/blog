import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";
import type { SeoConfig } from "@/types/seo";

export function Seo({ title, description, path = "/", image = "/profile.png", type = "website", publishedTime }: SeoConfig) {
  const canonical = new URL(path, siteConfig.url).toString();
  const imageUrl = new URL(image, siteConfig.url).toString();
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && <meta property="article:author" content={siteConfig.author} />}
      {type === "article" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            image: [imageUrl],
            author: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
            publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
            mainEntityOfPage: canonical,
            datePublished: publishedTime,
          })}
        </script>
      )}
    </Helmet>
  );
}
