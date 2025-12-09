import React, { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot, Mic, Volume2 } from "lucide-react";
import { GeminiService } from "../services/gemini";

const ChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Chào bác, bác cần hỏi gì về đơn thuốc hay sức khỏe ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Thuốc này uống lúc nào tốt nhất?",
    "Tôi có cần kiêng ăn gì không?",
    "Tác dụng phụ của thuốc là gì?",
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

      const response = await GeminiService.chat(userMsg, history);

      // Fix: Extract answer if response is an object (e.g. { answer: "...", suggested_questions: [...] })
      let responseText = response;
      if (typeof response === "object") {
        responseText = response.answer || "Xin lỗi, tôi không có câu trả lời.";
        if (
          response.suggested_questions &&
          Array.isArray(response.suggested_questions)
        ) {
          setSuggestedQuestions(response.suggested_questions);
        }
      }

      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
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
    <div className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end sm:justify-center items-center animate-in fade-in duration-200">
      <div className="bg-[#F2F4F7] w-full max-w-md h-[80vh] sm:h-[600px] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-white p-4 rounded-t-3xl sm:rounded-t-2xl flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-zalo-primary">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Bác sĩ AI</h3>
              <p className="text-xs text-green-500 flex items-center gap-1">
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
