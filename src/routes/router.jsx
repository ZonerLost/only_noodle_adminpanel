import React, { Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "../shell/Header.jsx";
import LeftSidebar from "../shell/LeftSidebar.jsx";
import NotificationsPanel from "../shell/NotificationsPanel.jsx";
import Breadcrumbs from "../shell/Breadcrumbs.jsx";
import { PATHS } from "./paths";

// Pages
import Login from "../auth/Login.jsx";
import Dashboard from "../modules/dashboard";
import { UsersList, DriversList, RolesPage } from "../modules/identity-access";
import { OrdersBoard, OrdersHistory } from "../modules/orders-ops";
import { ZonesEditor, Fees, ZoneRules } from "../modules/zones-fees";
import { CategoriesList, ProductsList } from "../modules/menu-catalog";
import ReviewsList from "../modules/reviews-feedback/reviews/List.jsx";
import Profile from "../modules/system-settings/profile/Profile.jsx";

function ShellLayout() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs className="py-3" />
            <Suspense
              fallback={
                <div className="page">
                  <div className="w-full px-4">
                    <div className="card p-4">Loading...</div>
                  </div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <NotificationsPanel />
    </div>
  );
}

export default function Router() {
  return (
    <Routes>
      <Route path={PATHS.login} element={<Login />} />

      <Route element={<ShellLayout />}>
        <Route index element={<Navigate to={PATHS.dashboard} replace />} />
        <Route path={PATHS.dashboard} element={<Dashboard />} />

        {/* Identity & Access */}
        <Route path={PATHS.users} element={<UsersList />} />
        <Route path={PATHS.drivers} element={<DriversList />} />
        <Route path={PATHS.roles} element={<RolesPage />} />

        {/* Orders */}
        <Route path={PATHS.ordersBoard} element={<OrdersBoard />} />
        <Route path={PATHS.ordersHistory} element={<OrdersHistory />} />

        {/* Zones & Fees */}
        <Route path={PATHS.zones} element={<ZonesEditor />} />
        <Route path={PATHS.fees} element={<Fees />} />
        <Route path={PATHS.rules} element={<ZoneRules />} />

        {/* Catalog */}
        <Route path={PATHS.products} element={<ProductsList />} />
        <Route path={PATHS.categories} element={<CategoriesList />} />

        {/* Reviews */}
        <Route path={PATHS.reviews} element={<ReviewsList />} />

        {/* Settings */}
        <Route path={PATHS.settingsProfile} element={<Profile />} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to={PATHS.dashboard} replace />} />
        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Route>
    </Routes>
  );
}
