import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import LabResultsPage from "./pages/LabResultsPage";
import CalendarPage from "./pages/CalendarPage";
import HistoryPage from "./pages/HistoryPage";
import { Bot } from "lucide-react";
import ChatModal from "./components/ChatModal";

const ProfilePage = () => (
  <div className="p-4 text-center text-gray-500 mt-10">
    Tính năng Hồ sơ đang phát triển
  </div>
);

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener("open-chat-modal", handleOpenChat);
    return () => window.removeEventListener("open-chat-modal", handleOpenChat);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="lab-results" element={<LabResultsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>

      {/* Global Chat Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div className="w-full max-w-md relative h-screen">
          <button
            onClick={() => setIsChatOpen(true)}
            className="absolute bottom-24 right-4 bg-zalo-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors pointer-events-auto"
          >
            <Bot size={24} />
          </button>
        </div>
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
