import ThemeSwitcher from "@/components/theme-switcher";
import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

const _NavLink = ({ title, href }: { title: string; href: string }) => {
  const { pathname } = useLocation();
  const isActive = useMemo(() => pathname === href, [pathname, href]);

  return (
    <Link
      to={href}
      className={`text-base tracking-normal transition-colors hover:text-accent-100/80 ${
        isActive ? "text-accent-100/100" : "text-accent-100/50"
      }`}
    >
      {title}
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className="left-0 z-10 flex items-center justify-between w-full py-8 mx-auto my-0 h-fit sm:px-0">
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold tracking-tight text-accent-400">
        Lluciocc
      </Link>

      <div className="flex items-center gap-4">
        <_NavLink title="Blog" href="/blog" />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
