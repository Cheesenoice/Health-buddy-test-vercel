import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mic } from "lucide-react";
import { GeminiService } from "../services/gemini";
import ChatModal from "../components/ChatModal";

// Import new components
import EmptyState from "../components/home/EmptyState";
import SummaryCard from "../components/home/SummaryCard";
import ModuleRenderer from "../components/home/ModuleRenderer";
import SuggestedQuestions from "../components/home/SuggestedQuestions";
import DrugInfoModal from "../components/home/DrugInfoModal";
import QuestionModal from "../components/home/QuestionModal";

const HomePage = () => {
  const { prescription } = useApp();
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
    return <EmptyState />;
  }

  const handleDrugClick = async (drug) => {
    setSelectedDrug(drug);
    setLoadingInfo(true);
    setDrugInfo(null);
    try {
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

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Dynamic Header Card */}
      <SummaryCard summaryCard={prescription.summary_card} />

      {/* Render Dynamic Modules */}
      {prescription.modules &&
        prescription.modules.map((module) => (
          <ModuleRenderer
            key={module.id}
            module={module}
            onDrugClick={handleDrugClick}
          />
        ))}

      {/* Suggested Questions (Big Cards) */}
      <SuggestedQuestions
        questions={prescription.suggested_questions}
        onQuestionClick={handleQuestionClick}
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 bg-zalo-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors z-40"
      >
        <Mic size={24} />
      </button>

      {/* Drug Info Modal */}
      <DrugInfoModal
        selectedDrug={selectedDrug}
        onClose={() => setSelectedDrug(null)}
        loadingInfo={loadingInfo}
        drugInfo={drugInfo}
      />

      {/* Question Answer Modal */}
      <QuestionModal
        isOpen={questionModal.isOpen}
        question={questionModal.question}
        answer={questionModal.answer}
        answering={answering}
        onClose={() => setQuestionModal({ ...questionModal, isOpen: false })}
      />

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HomePage;
