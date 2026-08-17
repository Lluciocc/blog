import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<HomePage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
