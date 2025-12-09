import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
// Using the requested Gemini 2.0 Flash Experimental model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const GeminiService = {
  /**
   * Parses raw prescription text into structured JSON.
   * @param {string} text - The raw text from OCR or input.
   * @returns {Promise<Object>} - Structured prescription data.
   */
  async parsePrescription(text) {
    // Ensure text is a string for the prompt, even if an object is passed (e.g. sample data)
    let promptText = text;
    if (typeof text === "object") {
      promptText = JSON.stringify(text);
    }

    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      console.warn("Gemini API Key is missing. Returning mock data.");
      return mockPrescriptionData;
    }

    const currentDate = new Date().toLocaleString("vi-VN");

    const prompt = `
      You are an AI backend for "HealFlow", a medical app for the elderly.
      Analyze the input text (OCR from prescription, lab result, or doctor note) and generate a Dynamic UI JSON structure.
      
      Input Text: "${promptText}"
      Current Date: "${currentDate}"

      Rules:
      1. Do NOT assume a fixed schema. Adapt the UI modules based on the content.
      2. If it's a Prescription: 
         - Use a 'medication_schedule' module.
         - INTELLIGENTLY GROUP medicines into sessions: "morning" (Sáng), "noon" (Trưa), "evening" (Chiều/Tối), "as_needed" (Khi cần/Sốt/Đau).
         - Calculate if the prescription is valid based on "Current Date" vs "Prescription Date" + "Duration".
      3. If it's a Lab Result: Use an 'info_list' module.
      4. If it's General Advice: Use a 'text_block' module.
      5. Always provide a 'summary_card' at the top.

      Required JSON Structure:
      {
        "summary_card": {
          "title": "Short Diagnosis or Main Title",
          "subtitle": "Date or Doctor Name",
          "description": "Simple, elderly-friendly explanation of the condition.",
          "theme": "blue" (default) or "red" (urgent) or "green" (normal)
        },
        "modules": [
          {
            "id": "unique_string",
            "type": "medication_schedule" | "info_list" | "text_block",
            "title": "Section Title",
            "status": "active" | "expired", // For prescription, check dates
            "data": [ 
              // If type is medication_schedule (Array of Sessions):
              { 
                "session": "morning" | "noon" | "evening" | "as_needed",
                "display_time": "07:00 • Sáng",
                "items": [
                  { "name": "Drug Name", "dosage": "1 viên", "instruction": "Sau ăn", "icon": "pill" }
                ]
              }
              // If type is info_list:
              { "label": "Test Name", "value": "Result Value", "status": "normal" | "warning" }
            ] 
            // If type is text_block, data is just a string.
          }
        ],
        "suggested_questions": ["Question 1?", "Question 2?"],
        "speech_text": "A warm greeting and summary for Text-to-Speech."
      }
      
      Only return the JSON object, no markdown formatting.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Clean up markdown code blocks if present
      const jsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing prescription with Gemini:", error);
      throw error;
    }
  },

  /**
   * Enriches drug information with context-aware advice.
   * @param {string} drugName
   * @param {string} patientContext (e.g., "Elderly patient, history of stomach pain")
   */
  async enrichDrugInfo(drugName, patientContext = "Elderly patient") {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      return mockDrugInfo(drugName);
    }

    const prompt = `
      Provide a detailed but simple guide for the drug "${drugName}" for a "${patientContext}".
      Return a valid JSON object with the following structure:
      {
        "summary": "A simple one-sentence explanation of what this drug does.",
        "usage_guide": "Step-by-step guide on how to take it (e.g., before/after food, with water).",
        "side_effects": ["Common side effect 1", "Common side effect 2"],
        "lifestyle_advice": "One tip for lifestyle changes while taking this drug (e.g., drink water, avoid alcohol).",
        "serious_warning": "One important warning (e.g., stop if rash appears)."
      }
      Only return the JSON object, no markdown formatting.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error enriching drug info:", error);
      return mockDrugInfo(drugName);
    }
  },

  /**
   * Chat with the AI assistant.
   * @param {string} message
   * @param {Array} history
   * @param {string} context - System context about the patient/prescription
   */
  async chat(message, history = [], context = "") {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      return "I am a demo bot. Please configure your Gemini API Key to chat for real.";
    }

    let finalMessage = message;
    if (history.length === 0 && context) {
      finalMessage = `Context: ${context}\n\nUser Question: ${message}`;
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    try {
      const result = await chat.sendMessage(finalMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Chat error:", error);
      return "Xin lỗi, bác sĩ ảo đang bận. Bác vui lòng thử lại sau.";
    }
  },
};

// Mock Data for fallback
const mockPrescriptionData = {
  summary_card: {
    title: "Viêm phế quản cấp",
    subtitle: "BS. Nguyễn Văn A - 15/12/2025",
    description:
      "Phổi của bác đang bị viêm, gây ho và có đờm. Cần uống thuốc để tiêu diệt vi khuẩn và giảm viêm.",
    theme: "blue",
  },
  modules: [
    {
      id: "meds_schedule",
      type: "medication_schedule",
      title: "Lịch uống thuốc hôm nay",
      status: "active",
      data: [
        {
          session: "morning",
          display_time: "07:00 • Sáng",
          items: [
            {
              name: "Augmentin 625mg",
              dosage: "1 viên",
              instruction: "Sau ăn",
              icon: "pill",
            },
          ],
        },
        {
          session: "noon",
          display_time: "12:00 • Trưa",
          items: [
            {
              name: "Panadol 500mg",
              dosage: "1 viên",
              instruction: "Sau ăn",
              icon: "pill",
            },
          ],
        },
        {
          session: "evening",
          display_time: "19:00 • Tối",
          items: [
            {
              name: "Augmentin 625mg",
              dosage: "1 viên",
              instruction: "Sau ăn",
              icon: "pill",
            },
          ],
        },
      ],
    },
    {
      id: "advice_1",
      type: "text_block",
      title: "Lời dặn bác sĩ",
      data: "Uống nhiều nước ấm, tránh nằm điều hòa lạnh. Tái khám sau 5 ngày.",
    },
  ],
  suggested_questions: [
    "Thuốc Augmentin có hại dạ dày không?",
    "Tôi có cần kiêng ăn gì không?",
  ],
  speech_text:
    "Chào bác, bác sĩ chẩn đoán bác bị viêm phế quản cấp. Bác nhớ uống thuốc đúng giờ và giữ ấm cơ thể nhé.",
};

const mockDrugInfo = (name) => ({
  summary: `${name} là thuốc giúp điều trị bệnh của bác.`,
  usage_guide: "Uống sau khi ăn no với một cốc nước đầy.",
  side_effects: ["Buồn nôn", "Mệt mỏi", "Đau đầu nhẹ"],
  lifestyle_advice: "Nên nghỉ ngơi nhiều, tránh làm việc nặng.",
  serious_warning: "Ngưng thuốc ngay nếu thấy nổi mẩn đỏ hoặc khó thở.",
});
