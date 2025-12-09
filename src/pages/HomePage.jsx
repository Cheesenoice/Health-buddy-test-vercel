import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { GeminiService } from "../services/gemini";

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

  // State for Question Modal
  const [questionModal, setQuestionModal] = useState({
    isOpen: false,
    question: "",
    answer: "",
    relatedQuestions: [],
  });
  const [questionHistory, setQuestionHistory] = useState([]); // History stack
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

  const handleQuestionClick = async (question, isRelated = false) => {
    if (isRelated) {
      // Push current state to history before updating
      setQuestionHistory((prev) => [...prev, questionModal]);
    } else {
      // New conversation, clear history
      setQuestionHistory([]);
    }

    setQuestionModal({
      isOpen: true,
      question,
      answer: null,
      relatedQuestions: [],
    });
    setAnswering(true);
    try {
      const context = JSON.stringify(prescription);
      const result = await GeminiService.chat(
        question,
        [],
        `Bạn là bác sĩ AI. Đây là đơn thuốc của bệnh nhân: ${context}.`
      );

      if (typeof result === "object" && result.answer) {
        setQuestionModal((prev) => ({
          ...prev,
          answer: result.answer,
          relatedQuestions: result.suggested_questions || [],
        }));
      } else {
        setQuestionModal((prev) => ({
          ...prev,
          answer: result,
          relatedQuestions: [],
        }));
      }
    } catch (error) {
      setQuestionModal((prev) => ({
        ...prev,
        answer: "Xin lỗi, bác sĩ ảo đang bận. Vui lòng thử lại.",
        relatedQuestions: [],
      }));
    } finally {
      setAnswering(false);
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 0) {
      const previousState = questionHistory[questionHistory.length - 1];
      setQuestionModal(previousState);
      setQuestionHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-xl relative pb-24">
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
          onQuestionClick={(q) => handleQuestionClick(q, false)}
          onRecordClick={() =>
            window.dispatchEvent(new Event("open-chat-modal"))
          }
        />

        {/* Drug Info Modal */}
        <DrugInfoModal
          selectedDrug={selectedDrug}
          onClose={() => setSelectedDrug(null)}
          loadingInfo={loadingInfo}
          drugInfo={drugInfo}
          onQuestionClick={(q) => handleQuestionClick(q, false)}
        />

        {/* Question Answer Modal */}
        <QuestionModal
          isOpen={questionModal.isOpen}
          question={questionModal.question}
          answer={questionModal.answer}
          relatedQuestions={questionModal.relatedQuestions}
          answering={answering}
          onClose={() => setQuestionModal({ ...questionModal, isOpen: false })}
          onQuestionClick={(q) => handleQuestionClick(q, true)}
          onBack={questionHistory.length > 0 ? handleBack : null}
        />
      </div>
    </div>
  );
};

export default HomePage;
