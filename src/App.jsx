import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";

// Placeholder pages
const CalendarPage = () => (
  <div className="p-4 text-center text-gray-500 mt-10">
    Tính năng Lịch đang phát triển
  </div>
);
const ProfilePage = () => (
  <div className="p-4 text-center text-gray-500 mt-10">
    Tính năng Hồ sơ đang phát triển
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
