import React, { useState, useMemo } from "react";
import { UICtx } from "./ui-context";

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const value = useMemo(
    () => ({
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen((v) => !v),
      notifOpen,
      openNotifications: () => setNotifOpen(true),
      closeNotifications: () => setNotifOpen(false),
      modal,
      openModal: setModal,
      closeModal: () => setModal(null),
    }),
    [sidebarOpen, notifOpen, modal]
  );

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI() {
  const context = React.useContext(UICtx);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
