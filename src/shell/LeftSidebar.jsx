import React from "react";
import { NavLink } from "react-router-dom";
import { useUI } from "../shared/context/UIContext.jsx";
import { PATHS } from "../routes/paths";
import {
  Home,
  User,
  Truck,
  FileText,
  MapPin,
  Tag,
  Star,
  Settings,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", to: PATHS.dashboard, icon: Home },
  { label: "Users", to: PATHS.users, icon: User },
  { label: "Drivers", to: PATHS.drivers, icon: Truck },
  { label: "Orders", to: PATHS.ordersBoard, icon: FileText },
  { label: "Zones", to: PATHS.zones, icon: MapPin },
  { label: "Products", to: PATHS.products, icon: Tag },
  { label: "Reviews", to: PATHS.reviews, icon: Star },
  { label: "Branding", to: PATHS.settingsBrand, icon: Settings },
];

export default function LeftSidebar() {
  const { sidebarOpen, toggleSidebar } = useUI();

  function handleNavClick() {
    // if on small screens (below md) and sidebar is open, close it after navigation
    try {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop && sidebarOpen) toggleSidebar();
    } catch {
      // ignore matchMedia errors in unusual environments
      if (sidebarOpen) toggleSidebar();
    }
  }
  return (
    <aside
      className={`left-sidebar w-64 border-r border-slate-200 dark:border-slate-700 transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } fixed md:static top-16 left-0 bottom-0 overflow-y-auto bg-white dark:bg-slate-800`}
      aria-label="Main navigation"
    >
      <nav className="p-3 space-y-1">
        {NAV.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-600 dark:text-blue-400"
                  : ""
              }`
            }
          >
            <span className="text-slate-500 dark:text-slate-300">
              {React.createElement(i.icon, { size: 18 })}
            </span>
            <span>{i.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
