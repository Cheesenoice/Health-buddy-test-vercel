import React from "react";
import { HelpCircle } from "lucide-react";

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle size={18} className="text-zalo-primary" />
          Bác muốn hỏi gì?
        </h3>
        <span className="text-xs text-gray-500">AI gợi ý</span>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x">
        {questions.map((q, i) => (
          <div
            key={i}
            onClick={() => onQuestionClick(q)}
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
  );
};

export default SuggestedQuestions;
