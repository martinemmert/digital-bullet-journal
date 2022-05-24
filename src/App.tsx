import type { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";
import { AuthPage } from "./pages/auth-page";
import { BulletsPage } from "./pages/bullets-page";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" element={<BulletsPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default App;
