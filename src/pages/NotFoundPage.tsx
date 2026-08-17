import { Link } from "react-router-dom";
import { Seo } from "@/components/seo";
import { siteConfig } from "@/config/site";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <Seo title={`Page not found — ${siteConfig.name}`} description="This page does not exist." />
      <p className="text-6xl font-bold text-accent-400">404</p>
      <h1 className="text-2xl">This page does not exist.</h1>
      <Link className="text-accent-400 underline" to="/">Back to home</Link>
    </section>
  );
}
