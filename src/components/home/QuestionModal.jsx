import React, { useEffect } from "react";
import { X, Volume2, HelpCircle, ArrowLeft } from "lucide-react";

const QuestionModal = ({
  isOpen,
  question,
  answer,
  answering,
  onClose,
  relatedQuestions,
  onQuestionClick,
  onBack,
}) => {
  // Auto-speak when answer arrives
  useEffect(() => {
    if (!answering && answer && isOpen) {
      const u = new SpeechSynthesisUtterance(answer);
      u.lang = "vi-VN";
      window.speechSynthesis.speak(u);

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [answering, answer, isOpen]);

  if (!isOpen) return null;

  // Simple Markdown Parser for Bold and Lists
  const renderContent = (text) => {
    if (!text) return null;

    const lines = text.split("\n");

    return (
      <div className="text-gray-800 text-sm leading-relaxed space-y-2">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          // Handle Bullet points (start with * or - or •)
          if (
            trimmedLine.startsWith("*") ||
            trimmedLine.startsWith("-") ||
            trimmedLine.startsWith("•")
          ) {
            const content = trimmedLine.replace(/^[\*\-•]\s*/, "");
            const parts = content.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-zalo-primary mt-1.5 text-[6px]">●</span>
                <span>
                  {parts.map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </span>
              </div>
            );
          }

          // Regular text with bold support
          const parts = line.split(/(\*\*.*?\*\*)/g);
          if (trimmedLine === "") return <br key={index} />;

          return (
            <p key={index}>
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-0">
      <div className="bg-white w-full max-w-md h-auto rounded-t-3xl flex flex-col shadow-2xl animate-slide-up max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl gap-3">
          {onBack ? (
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                onBack();
              }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
          ) : null}

          <h3 className="font-bold text-lg text-gray-800 flex-1 pr-2 line-clamp-1">
            {question}
          </h3>
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
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
                  <div className="flex-1">
                    {renderContent(answer)}

                    {/* VNPT SmartVoice Branding */}
                    <div className="flex flex-row items-center gap-1.5 mt-3 bg-white/60 w-fit px-2 py-1 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <Volume2 size={12} className="text-zalo-primary" />
                      <span className="text-[10px] font-bold text-zalo-primary">
                        VNPT SmartVoice
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 mt-3 bg-white/60 w-fit px-2 py-1 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-zalo-primary">
                        VNPT SmartBot • ChatBot AI
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Questions - Elevated Buttons */}
              {relatedQuestions && relatedQuestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <HelpCircle size={12} /> CÓ THỂ BÁC QUAN TÂM
                  </p>
                  <div className="flex flex-col gap-2">
                    {relatedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          onQuestionClick(q);
                        }}
                        className="bg-white text-gray-800 px-4 py-3 rounded-xl text-sm font-semibold shadow-md border border-gray-100 active:scale-95 transition-all hover:shadow-lg hover:border-blue-200 text-left flex justify-between items-center group"
                      >
                        <span>{q}</span>
                        <span className="text-gray-300 group-hover:text-zalo-primary transition-colors">
                          ›
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-center text-gray-400 mt-2">
                Câu trả lời được tạo bởi AI dựa trên đơn thuốc của bác.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
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
