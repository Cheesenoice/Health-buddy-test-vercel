import React, { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot } from "lucide-react";
import { GeminiService } from "../services/gemini";
import { useApp } from "../context/AppContext";

const ChatModal = ({ isOpen, onClose }) => {
  const { prescription } = useApp();
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Chào bác, bác cần hỏi gì về đơn thuốc hay sức khỏe ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      // Convert history to Gemini format
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      // Prepare context from prescription
      let context = "";
      if (prescription) {
        context = `
          Patient Diagnosis: ${prescription.diagnosis}
          Explanation: ${prescription.diagnosis_explanation}
          Medicines: ${prescription.medicines
            .map((m) => `${m.name} (${m.dosage})`)
            .join(", ")}
          Advice: ${prescription.advice}
        `;
      }

      const response = await GeminiService.chat(userMsg, history, context);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:w-[400px] h-[90vh] sm:h-[600px] flex flex-col sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="bg-zalo-primary p-4 flex justify-between items-center text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">Trợ lý Y tế AI</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900 rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi của bác..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-zalo-primary outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-zalo-primary text-white p-3 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
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
