import { Outlet } from "react-router-dom";
import Footer from "@/components/footer";
import Navbar from "@/components/nav";

export default function MainLayout() {
  return (
    <main className="relative max-w-3xl px-4 mx-auto sm:px-0">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
