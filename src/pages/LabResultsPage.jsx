import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { GeminiService } from "../services/gemini";
import QuestionModal from "../components/home/QuestionModal";

const LabResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const moduleData = location.state?.moduleData;
  const hasFetched = useRef(false); // Prevent double fetch

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    question: "",
    answer: "",
    relatedQuestions: [],
  });
  const [modalHistory, setModalHistory] = useState([]);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    if (moduleData && moduleData.data && !hasFetched.current) {
      hasFetched.current = true;
      const fetchAnalysis = async () => {
        try {
          const result = await GeminiService.analyzeLabResults(moduleData.data);
          setAnalysis(result);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingAnalysis(false);
        }
      };
      fetchAnalysis();
    }
  }, [moduleData]);

  const handleExplainClick = async (item) => {
    setModalHistory([]); // Clear history
    setModalState({
      question: `Giải thích chỉ số: ${item.label}`,
      answer: null,
      relatedQuestions: [],
    });
    setModalOpen(true);
    setAnswering(true);

    try {
      const result = await GeminiService.explainLabResult(
        item.label,
        item.value,
        JSON.stringify(moduleData.data)
      );

      if (typeof result === "object") {
        setModalState((prev) => ({
          ...prev,
          answer: result.explanation,
          relatedQuestions: result.suggested_questions || [],
        }));
      } else {
        setModalState((prev) => ({
          ...prev,
          answer: result,
          relatedQuestions: [],
        }));
      }
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        answer: "Xin lỗi, không thể giải thích lúc này.",
      }));
    } finally {
      setAnswering(false);
    }
  };

  const handleQuestionClick = async (question) => {
    // Push current to history
    setModalHistory((prev) => [...prev, modalState]);

    setModalState({ question, answer: null, relatedQuestions: [] });
    setAnswering(true);
    try {
      const context = JSON.stringify(moduleData.data);
      const result = await GeminiService.chat(
        question,
        [],
        `Bạn là bác sĩ AI. Đây là kết quả xét nghiệm của bệnh nhân: ${context}.`
      );

      if (typeof result === "object" && result.answer) {
        setModalState((prev) => ({
          ...prev,
          answer: result.answer,
          relatedQuestions: result.suggested_questions || [],
        }));
      } else {
        setModalState((prev) => ({
          ...prev,
          answer: result,
          relatedQuestions: [],
        }));
      }
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        answer: "Xin lỗi, bác sĩ ảo đang bận. Vui lòng thử lại.",
      }));
    } finally {
      setAnswering(false);
    }
  };

  const handleBack = () => {
    if (modalHistory.length > 0) {
      const prev = modalHistory[modalHistory.length - 1];
      setModalState(prev);
      setModalHistory((hist) => hist.slice(0, -1));
    }
  };

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Không có dữ liệu xét nghiệm.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Chi tiết xét nghiệm</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-5 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-blue-100" />
            <h2 className="font-bold text-lg">Tổng quan sức khỏe</h2>
          </div>

          {loadingAnalysis ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : (
            <div>
              <p className="text-blue-50 text-sm leading-relaxed mb-4">
                {analysis?.summary}
              </p>
              {/* Highlights: dùng grid tự động, không fix số dòng */}
              <div className="grid grid-cols-1 gap-3">
                {analysis?.highlights?.map((h, i) => {
                  if (!h.content) return null;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl backdrop-blur-sm border ${
                        h.type === "green"
                          ? "bg-green-500/20 border-green-400/30"
                          : "bg-red-500/20 border-red-400/30"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {h.type === "green" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        <span className="text-xs font-bold uppercase opacity-90">
                          {h.title}
                        </span>
                      </div>
                      <p className="text-xs font-medium">{h.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results List */}
        <h3 className="font-bold text-gray-800 mb-3 px-1">Danh sách chỉ số</h3>
        <div className="space-y-3">
          {moduleData.data.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-gray-800 block">
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      item.status === "warning"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
                {item.status === "warning" && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    Cảnh báo
                  </span>
                )}
              </div>

              <button
                onClick={() => handleExplainClick(item)}
                className="w-full mt-2 py-2 bg-blue-50 text-zalo-primary text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
              >
                <HelpCircle size={14} /> Giải thích chỉ số này
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Modal */}
      <QuestionModal
        isOpen={modalOpen}
        question={modalState.question}
        answer={modalState.answer}
        relatedQuestions={modalState.relatedQuestions}
        onQuestionClick={handleQuestionClick}
        onBack={modalHistory.length > 0 ? handleBack : null}
        answering={answering}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LabResultsPage;
