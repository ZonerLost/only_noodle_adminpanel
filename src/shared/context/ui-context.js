import { createContext } from "react";

export const UICtx = createContext({
  sidebarOpen: true,
  toggleSidebar: () => {},
  notificationsOpen: false,
  toggleNotifications: () => {},
});
