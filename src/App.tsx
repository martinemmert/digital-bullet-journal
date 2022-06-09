import type { Component } from "solid-js";
import { createEffect } from "solid-js";
import { Route, Routes } from "solid-app-router";
import { AuthPage } from "./pages/auth-page";
import { JournalPage } from "./pages/journal-page";
import { session } from "./lib/supabase-client";
import {
  subscribeToBulletUpdates,
  unsubscribeFromBulletUpdates,
} from "./store/bullet-collection";

const App: Component = () => {
  createEffect(async () => {
    if (session()) {
      await subscribeToBulletUpdates();
      return;
    }
    if (!session()) {
      await unsubscribeFromBulletUpdates();
      return;
    }
  });

  return (
    <Routes>
      <Route path="/" element={<JournalPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default App;
