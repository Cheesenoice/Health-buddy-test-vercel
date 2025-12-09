import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeminiService } from "../services/gemini";
import { useApp } from "../context/AppContext";
import {
  ScanLine,
  Loader2,
  FileText,
  Database,
  ChevronDown,
  ArrowLeft,
  Camera,
} from "lucide-react";
import demoScenarios from "../data/demo_scenarios.json";

const ScanPage = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const { savePrescription } = useApp();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const data = await GeminiService.parsePrescription(text);
      savePrescription(data);
      navigate("/");
    } catch (error) {
      alert("Có lỗi xảy ra khi phân tích đơn thuốc. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadScenario = (scenario) => {
    // Prettify JSON for display
    setText(JSON.stringify(scenario.data, null, 2));
    setShowDemoMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-md aspect-[3/4] border-2 border-white/30 rounded-3xl relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan"></div>
        <Camera size={48} className="text-white/50" />
        <p className="absolute bottom-10 text-white font-medium text-center w-full">
          Di chuyển camera vào vùng mã QR
          <br />
          hoặc đơn thuốc
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-white text-black font-bold rounded-full">
          Chụp ảnh
        </button>
        <button className="px-6 py-3 bg-white/20 text-white font-bold rounded-full backdrop-blur-sm">
          Tải ảnh lên
        </button>
      </div>

      <div className="space-y-3 mt-6 w-full max-w-2xl">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Nội dung (Text/JSON)
          </label>

          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="text-xs text-zalo-primary hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 font-medium"
            >
              <Database size={12} /> Dữ liệu mẫu <ChevronDown size={12} />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                <div className="p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500">
                  CHỌN KỊCH BẢN DEMO
                </div>
                {demoScenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadScenario(s)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="font-bold text-gray-800">{s.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {s.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zalo-primary focus:border-transparent h-60 font-mono text-xs"
          placeholder="Dán nội dung đơn thuốc hoặc JSON vào đây..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className="w-full bg-zalo-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" /> Đang xử lý...
          </>
        ) : (
          "Phân tích & Tạo lịch"
        )}
      </button>

      <div className="mt-8 w-full max-w-2xl mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Quét đơn / Scan</h1>
        <p className="text-sm text-gray-600">
          Tại đây bạn có thể tải ảnh hoặc quét đơn thuốc. Tính năng đang phát
          triển.
        </p>
      </div>
    </div>
  );
};

export default ScanPage;
