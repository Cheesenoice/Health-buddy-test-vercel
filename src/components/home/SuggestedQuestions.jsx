import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Mic } from "lucide-react";
import { GeminiService } from "../../services/gemini";
import { useApp } from "../../context/AppContext";

const SuggestedQuestions = ({ questions, onQuestionClick, onRecordClick }) => {
  const { prescription } = useApp();
  const [localQuestions, setLocalQuestions] = useState(questions || []);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLocalQuestions(questions || []);
  }, [questions]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const context = JSON.stringify(prescription);
      const newQs = await GeminiService.generateMoreQuestions(
        localQuestions,
        context
      );
      // Insert new questions at the beginning
      setLocalQuestions([...newQs, ...localQuestions]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!localQuestions) return null;

  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle size={18} className="text-zalo-primary" />
          Bác muốn hỏi gì?
        </h3>
        <span className="text-xs text-gray-500">AI gợi ý</span>
      </div>

      <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto pb-4 no-scrollbar snap-x auto-cols-min">
        {/* Record Button (First) */}
        <div
          onClick={onRecordClick}
          className="w-[120px] flex-none bg-red-50 p-3 rounded-2xl border border-red-100 border-dashed flex flex-col items-center justify-center text-center h-[140px] snap-start active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 text-red-500 shadow-sm">
            <Mic size={20} />
          </div>
          <span className="text-xs font-bold text-red-500">Hỏi trực tiếp</span>
        </div>

        {/* Add More Button (Second) */}
        <div
          onClick={handleLoadMore}
          className="w-[4] flex-none bg-blue-50 p-3 rounded-2xl border border-blue-100 border-dashed flex flex-col items-center justify-center text-center h-[140px] snap-start active:scale-95 transition-transform cursor-pointer"
        >
          {loadingMore ? (
            <div className="w-6 h-6 border-2 border-zalo-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 text-zalo-primary shadow-sm">
                <Plus size={20} />
              </div>
              <span className="text-xs font-bold text-zalo-primary">
                Thêm câu hỏi
              </span>
            </>
          )}
        </div>

        {/* Questions List */}
        {localQuestions.map((q, i) => (
          <div
            key={i}
            onClick={() => onQuestionClick(q)}
            className="w-[160px] flex-none bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-[140px] snap-start active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-lg">
              🤔
            </div>
            <span className="text-xs font-bold text-gray-700 line-clamp-3 leading-tight">
              {q}
            </span>
            <span className="text-[9px] text-zalo-primary mt-1 font-bold uppercase">
              Chạm để nghe
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
