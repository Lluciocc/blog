import { Link, useParams } from "react-router-dom";
import Image from "@/components/ui/image";
import ArticleContent from "@/components/blog/ArticleContent";
import ArticleExtra from "@/components/article-extra";
import { Seo } from "@/components/seo";
import { siteConfig } from "@/config/site";
import { getPostBySlug } from "@/lib/blogs";
import { FadeInImage } from "@/utils/components";
import { isYouTubeLink, truncate } from "@/utils/functions";
import type { BlogPost } from "@/types/content";

function YoutubeEmbed({ url }: { url: string }) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1];
  if (!videoId) return null;
  return <iframe width="768" height="432" className="mt-4 mb-10" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video" allowFullScreen />;
}

function Authors({ post }: { post: BlogPost }) {
  const authors = post.authors.length
    ? post.authors.filter((author, index, list) => list.findIndex(item => item.name === author.name) === index)
    : [{ name: siteConfig.author, logo: "/profile.png" }];

  return (
    <div className="flex items-center justify-center w-full py-3 border-y blog__meta border-accent-800/50">
      <div className="flex mr-4 -space-x-2 shrink-0">
        {authors.map(author => author.logo
          ? <Image key={author.name} src={author.logo} width={32} height={32} alt={author.name} className="w-8 h-8 border rounded-full border-accent-600" />
          : <span key={author.name} role="img" aria-label={author.name} title={author.name} className="grid w-8 h-8 text-xs font-bold uppercase border rounded-full place-items-center bg-accent-800 text-accent-100 border-accent-600">
            {author.name.slice(0, 2)}
          </span>)}
      </div>
      <div className="text-accent-300">
        <span className="mr-1">Published by {authors.map((author, index) => <span key={author.name}>
          {index > 0 && (index === authors.length - 1 ? " & " : ", ")}
          <span className="text-accent-50">{author.name}</span>
        </span>)}
        </span>
        <span className="mx-1"><span className="whitespace-pre opacity-50"> • </span>{post.readingTime}</span>
        <span className="ml-1"><span className="whitespace-pre opacity-50"> • </span>{post.date}</span>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <section className="py-20 text-center"><h1 className="mb-4 text-3xl">Post not found</h1><Link className="underline text-accent-400" to="/">Back to posts</Link></section>;
  const path = `/blog/${post.slug}`;
  return (
    <>
      <Seo title={`${post.title} — ${siteConfig.name}`} description={truncate(post.description, 160)} path={path} image={post.banner} type="article" publishedTime={post.publishedAt} />
      <article className="blog">
        <div className="grid place-items-center"><h1 className="!mb-2 !mt-6 text-center">{post.title}</h1><Authors post={post} /></div>
        {isYouTubeLink(post.banner) ? <YoutubeEmbed url={post.banner} /> : <FadeInImage src={post.banner} alt={post.title} height={900} width={1600} className="mt-4 mb-10 rounded-lg" />}
        <ArticleContent post={post} />
      </article>
      <ArticleExtra id={post.slug} />
    </>
  );
}
