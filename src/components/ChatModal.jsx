import React, { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot, Mic, Volume2, ScanLine } from "lucide-react";
import { GeminiService } from "../services/gemini";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const GUIDANCE_MESSAGE =
  "Chào bác! Hiện tại cháu chưa có thông tin đơn thuốc. Bác vui lòng quét đơn thuốc hoặc kết quả xét nghiệm để cháu tư vấn kỹ hơn nhé.";

const ChatModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { prescription } = useApp();

  const [messages, setMessages] = useState(() => {
    if (prescription) {
      return [
        {
          role: "model",
          text: `Chào bác, cháu đã xem đơn thuốc ${
            prescription.summary_card?.title || ""
          }. Bác cần hỏi gì thêm không ạ?`,
        },
      ];
    }
    return [
      {
        role: "model",
        text: GUIDANCE_MESSAGE,
        action: "scan_prescription",
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [suggestedQuestions, setSuggestedQuestions] = useState(() => {
    if (prescription && Array.isArray(prescription.suggested_questions)) {
      return prescription.suggested_questions;
    }
    return [];
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check for prescription update when modal opens
  useEffect(() => {
    if (isOpen && prescription) {
      setMessages((prev) => {
        // If currently showing guidance message (meaning no data was found previously),
        // but now we have data, switch to the greeting message.
        if (prev.length === 1 && prev[0].text === GUIDANCE_MESSAGE) {
          return [
            {
              role: "model",
              text: `Chào bác, cháu đã xem đơn thuốc ${
                prescription.summary_card?.title || ""
              }. Bác cần hỏi gì thêm không ạ?`,
            },
          ];
        }
        return prev;
      });

      // Also update suggested questions if they are missing
      setSuggestedQuestions((prev) => {
        if (
          prev.length === 0 &&
          Array.isArray(prescription.suggested_questions)
        ) {
          return prescription.suggested_questions;
        }
        return prev;
      });
    }
  }, [isOpen, prescription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestedQuestions]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsg = text;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);
    setSuggestedQuestions([]); // Clear old suggestions while loading

    try {
      // Convert history to Gemini format
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      // Prepare context from prescription data
      const context = prescription
        ? `Thông tin đơn thuốc/sức khỏe hiện tại của bệnh nhân: ${JSON.stringify(
            prescription
          )}`
        : "";

      // Pass context as the 3rd argument
      const response = await GeminiService.chat(userMsg, history, context);

      // Fix: Extract answer if response is an object (e.g. { answer: "...", suggested_questions: [...] })
      let responseText = response;
      let action = null;

      if (typeof response === "object") {
        responseText = response.answer || "Xin lỗi, tôi không có câu trả lời.";
        if (
          response.suggested_questions &&
          Array.isArray(response.suggested_questions)
        ) {
          setSuggestedQuestions(response.suggested_questions);
        }
        if (response.action) {
          action = response.action;
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: responseText, action: action },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Xin lỗi, cháu đang gặp chút trục trặc. Bác hỏi lại sau nhé.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end items-center animate-in fade-in duration-200">
      <div className="bg-[#F2F4F7] w-full max-w-md h-[80vh] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-white p-4 rounded-t-3xl flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-zalo-primary">
              <Bot size={24} />
            </div>
            {/* Changed: make title and tag inline, keep status below */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">Bác sĩ AI</h3>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
                  <span className="text-[10px] font-bold text-zalo-primary">
                    VNPT SmartBot • ChatBot AI
                  </span>
                </div>
              </div>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Đang
                trực tuyến
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Message List */}
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-zalo-primary text-white rounded-tr-none"
                      : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                  }`}
                >
                  {msg.text}
                  {msg.action === "scan_prescription" && (
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/scan");
                      }}
                      className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors w-full justify-center"
                    >
                      <ScanLine size={16} />
                      Mở trang quét đơn thuốc
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Persistent Mic & Branding & Suggestions */}
          <div className="flex flex-col items-center gap-4 pb-4">
            {/* Mic & Tag */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-zalo-primary/20 rounded-full animate-ping"></div>
                <div className="w-16 h-16 bg-zalo-primary rounded-full flex items-center justify-center shadow-lg shadow-zalo-primary/30 transition-transform hover:scale-105 active:scale-95">
                  <Mic size={28} className="text-white" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
                <Volume2 size={14} className="text-zalo-primary" />
                <span className="text-[10px] font-bold text-zalo-primary">
                  VNPT SmartVoice
                </span>
              </div>
            </div>

            {/* Suggestions */}
            {!isLoading && suggestedQuestions.length > 0 && (
              <div className="w-full space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase text-center mb-2">
                  {messages.length > 1 ? "Gợi ý tiếp theo" : "Gợi ý câu hỏi"}
                </p>
                <div className="flex flex-col gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full bg-white text-gray-700 p-3 rounded-xl text-sm font-medium shadow-sm border border-gray-100 active:scale-95 transition-all hover:border-zalo-primary/50 hover:text-zalo-primary text-left flex justify-between items-center"
                    >
                      {q}
                      <span className="text-gray-300">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-zalo-primary outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-zalo-primary text-white p-3 rounded-full disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
