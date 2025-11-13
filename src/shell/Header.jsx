import React from "react";
import { useUI } from "../shared/context/UIContext.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";
import UserMenu from "./UserMenu.jsx";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const { openNotifications, toggleSidebar } = useUI();
  const { theme, toggle } = useTheme();

  return (
    <header className="app-header sticky top-0 z-30">
      {/* Logo + mobile menu positioned at far left corner */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
        {/* hamburger visible on mobile to toggle sidebar */}
        <button
          className="btn-ghost md:hidden text-slate-600 dark:text-slate-300"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-3">
          <img
            src={theme === "dark" ? "/logo2.png" : "/logo2.png"}
            alt="Only Noodle"
            className="h-8 w-8 md:h-14 md:w-14 object-contain"
          />
        </Link>
      </div>

      {/* Controls positioned at far right corner */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
        {/* small-screen search button */}
        <button
          className="btn-ghost md:hidden text-slate-600 dark:text-slate-300"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button
          className="btn-ghost hidden sm:inline-flex text-slate-600 dark:text-slate-300"
          onClick={openNotifications}
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          className="btn-ghost hidden sm:inline-flex text-slate-600 dark:text-slate-300"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <UserMenu />
      </div>

      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <input
            className="input w-full max-w-[1100px]"
            placeholder="Search anything…"
          />
        </div>
        {/* controls moved to right-corner absolute container */}
      </div>
    </header>
  );
}
