import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  Clock,
  Info,
  Mic,
  ChevronRight,
  AlertCircle,
  FileText,
  Stethoscope,
  X,
  Activity,
  Calendar,
  HelpCircle, // Added icon
} from "lucide-react";
import { GeminiService } from "../services/gemini";
import ChatModal from "../components/ChatModal";

const HomePage = () => {
  const { prescription } = useApp();
  const navigate = useNavigate();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugInfo, setDrugInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // State for Question Modal
  const [questionModal, setQuestionModal] = useState({
    isOpen: false,
    question: "",
    answer: "",
  });
  const [answering, setAnswering] = useState(false);

  if (!prescription) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Pill size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Chưa có đơn thuốc</h2>
        <p className="text-gray-500">
          Hãy quét mã QR hoặc chụp đơn thuốc để bắt đầu theo dõi sức khỏe.
        </p>
        <button
          onClick={() => navigate("/scan")}
          className="bg-zalo-primary text-white px-6 py-3 rounded-full font-bold shadow-md mt-4"
        >
          Quét đơn ngay
        </button>
      </div>
    );
  }

  const handleDrugClick = async (drug) => {
    setSelectedDrug(drug);
    setLoadingInfo(true);
    setDrugInfo(null);
    try {
      // Pass patient context if available, otherwise default. Supports both new and old structures.
      const diagnosis =
        prescription.summary_card?.title || prescription.diagnosis || "bệnh lý";
      const context = `Bệnh nhân bị ${diagnosis}`;
      const info = await GeminiService.enrichDrugInfo(drug.name, context);
      setDrugInfo(info);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleQuestionClick = async (question) => {
    setQuestionModal({ isOpen: true, question, answer: null });
    setAnswering(true);
    try {
      const context = JSON.stringify(prescription);
      const answer = await GeminiService.chat(
        question,
        [],
        `Bạn là bác sĩ AI. Đây là đơn thuốc của bệnh nhân: ${context}. Hãy trả lời câu hỏi ngắn gọn, dễ hiểu cho người già.`
      );
      setQuestionModal({ isOpen: true, question, answer });
    } catch (error) {
      setQuestionModal({
        isOpen: true,
        question,
        answer: "Xin lỗi, bác sĩ ảo đang bận. Vui lòng thử lại.",
      });
    } finally {
      setAnswering(false);
    }
  };

  // Dynamic Module Renderer
  const renderModule = (module) => {
    switch (module.type) {
      case "medication_scroll":
        return (
          <div key={module.id} className="px-4 mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Pill size={18} className="text-zalo-primary" /> {module.title}
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {Array.isArray(module.data) &&
                module.data.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleDrugClick(item)}
                    className="min-w-[280px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 snap-center active:scale-95 transition-transform cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <Pill size={24} />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">{item.detail}</p>
                    <div className="flex items-center gap-2 text-sm text-zalo-primary bg-blue-50 p-2 rounded-lg">
                      <Clock size={14} />
                      <span>{item.sub_detail}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case "info_list":
        return (
          <div key={module.id} className="px-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-red-500" />
                {module.title}
              </h3>
              <div className="space-y-3">
                {Array.isArray(module.data) &&
                  module.data.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">
                        {item.label}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          item.status === "warning"
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case "text_block":
        return (
          <div key={module.id} className="px-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Stethoscope size={18} className="text-green-600" />
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {module.data}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case "red":
        return "from-red-600 to-red-400";
      case "green":
        return "from-green-600 to-green-400";
      default:
        return "from-blue-600 to-blue-400";
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Dynamic Header Card */}
      {prescription.summary_card && (
        <div
          className={`bg-gradient-to-r ${getThemeColor(
            prescription.summary_card.theme
          )} text-white p-6 rounded-b-3xl shadow-lg mb-6`}
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold">
              {prescription.summary_card.title}
            </h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
              {prescription.summary_card.subtitle}
            </span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md text-sm leading-relaxed border border-white/10 mt-4">
            <p>💡 {prescription.summary_card.description}</p>
          </div>
        </div>
      )}

      {/* Render Dynamic Modules */}
      {prescription.modules &&
        prescription.modules.map((module) => renderModule(module))}

      {/* Suggested Questions (Big Cards) */}
      {prescription.suggested_questions && (
        <div className="px-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <HelpCircle size={18} className="text-zalo-primary" />
              Bác muốn hỏi gì?
            </h3>
            <span className="text-xs text-gray-500">AI gợi ý</span>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x">
            {prescription.suggested_questions.map((q, i) => (
              <div
                key={i}
                onClick={() => handleQuestionClick(q)}
                className="min-w-[45%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-40 snap-start active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-2xl">
                  🤔
                </div>
                <span className="text-sm font-bold text-gray-700 line-clamp-3 leading-tight">
                  {q}
                </span>
                <span className="text-[10px] text-zalo-primary mt-2 font-bold uppercase">
                  Chạm để nghe
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 bg-zalo-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors z-40"
      >
        <Mic size={24} />
      </button>

      {/* Drug Info Modal */}
      {selectedDrug && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-auto sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-slide-up">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {selectedDrug.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedDrug.dosage}</p>
              </div>
              <button
                onClick={() => setSelectedDrug(null)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {loadingInfo ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="w-10 h-10 border-4 border-zalo-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm animate-pulse">
                    Đang tra cứu thông tin thuốc...
                  </p>
                </div>
              ) : drugInfo ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <Info size={18} /> Công dụng
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {drugInfo.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Clock size={18} className="text-orange-500" />
                      Hướng dẫn sử dụng
                    </h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {drugInfo.usage_guide}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500" />
                      Tác dụng phụ thường gặp
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 bg-red-50 p-3 rounded-lg border border-red-100">
                      {drugInfo.side_effects?.map((effect, i) => (
                        <li key={i}>{effect}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Activity size={18} className="text-green-500" />
                      Lời khuyên sống khỏe
                    </h4>
                    <p className="text-gray-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                      {drugInfo.lifestyle_advice}
                    </p>
                  </div>

                  {drugInfo.serious_warning && (
                    <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                      <h4 className="font-bold text-red-700 text-sm mb-1 flex items-center gap-2">
                        <AlertCircle size={16} /> Cảnh báo quan trọng
                      </h4>
                      <p className="text-red-600 text-xs">
                        {drugInfo.serious_warning}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Không tìm thấy thông tin chi tiết.
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setSelectedDrug(null)}
                className="w-full bg-zalo-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Answer Modal */}
      {questionModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] h-auto sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-slide-up">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <h3 className="font-bold text-lg text-gray-800 flex-1 pr-4 line-clamp-1">
                {questionModal.question}
              </h3>
              <button
                onClick={() =>
                  setQuestionModal({ ...questionModal, isOpen: false })
                }
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 min-h-[200px] max-h-[60vh] overflow-y-auto">
              {answering ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-10 h-10 border-4 border-zalo-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm animate-pulse">
                    Bác sĩ AI đang suy nghĩ...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex gap-3">
                      <div className="min-w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm text-xl">
                        👨‍⚕️
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                          {questionModal.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-400">
                    Câu trả lời được tạo bởi AI dựa trên đơn thuốc của bác.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
              <button
                onClick={() =>
                  setQuestionModal({ ...questionModal, isOpen: false })
                }
                className="w-full bg-zalo-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HomePage;
