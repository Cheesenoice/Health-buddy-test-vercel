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
  Image as ImageIcon,
  Zap,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full overflow-y-auto">
        {/* Camera Viewfinder */}
        <div className="w-full aspect-[4/3] bg-black rounded-3xl relative overflow-hidden shadow-lg mb-6 shrink-0 group">
          {/* Tech Badge - Highlighted */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-fade-in-down">
              <Zap size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] text-center font-bold text-zalo-primary">
                VNPT SmartReader • OCR
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan"></div>

          {/* Corner Markers */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-xl"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-xl"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-xl"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-xl"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
            <Camera size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-medium text-center px-8">
              Di chuyển camera vào vùng mã QR
              <br />
              hoặc văn bản cần quét
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform hover:bg-gray-50">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-zalo-primary">
              <Camera size={20} />
            </div>
            <span className="text-sm font-bold text-gray-700">Chụp ảnh</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform hover:bg-gray-50">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <ImageIcon size={20} />
            </div>
            <span className="text-sm font-bold text-gray-700">Tải ảnh lên</span>
          </button>
        </div>

        {/* Manual Input Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-zalo-primary" />
              <span className="text-sm font-bold text-gray-800">
                Nhập liệu thủ công
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="text-xs bg-blue-50 text-zalo-primary hover:bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1 font-bold transition-colors"
              >
                <Database size={12} /> Dữ liệu mẫu <ChevronDown size={12} />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden ring-1 ring-black/5">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Chọn kịch bản Demo
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {demoScenarios.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => loadScenario(s)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors group"
                      >
                        <div className="font-bold text-gray-800 text-sm group-hover:text-zalo-primary">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {s.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <textarea
            className="w-full flex-1 min-h-[120px] p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zalo-primary/20 focus:border-zalo-primary transition-all font-mono text-xs resize-none mb-4"
            placeholder="Dán nội dung JSON hoặc văn bản đơn thuốc vào đây để phân tích..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className="w-full bg-zalo-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Đang xử lý...
              </>
            ) : (
              <>
                <ScanLine size={20} /> Phân tích & Tạo lịch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
