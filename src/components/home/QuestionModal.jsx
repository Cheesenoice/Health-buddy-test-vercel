import React from "react";
import { X } from "lucide-react";

const QuestionModal = ({ isOpen, question, answer, answering, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[400px] h-auto sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-slide-up">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
          <h3 className="font-bold text-lg text-gray-800 flex-1 pr-4 line-clamp-1">
            {question}
          </h3>
          <button
            onClick={onClose}
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
                      {answer}
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
            onClick={onClose}
            className="w-full bg-zalo-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
