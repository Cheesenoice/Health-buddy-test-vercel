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
    <div className="p-4 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-zalo-primary">
          <ScanLine size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Quét đơn thuốc</h2>
        <p className="text-gray-500 text-sm">
          Chụp ảnh hoặc dán nội dung đơn thuốc để AI phân tích và tạo lịch uống
          thuốc tự động.
        </p>
      </div>

      <div className="space-y-3">
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
    </div>
  );
};

export default ScanPage;
