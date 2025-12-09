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
      Bạn là backend AI cho "HealthBuddy", một ứng dụng y tế cho người cao tuổi.
      Phân tích văn bản đầu vào (OCR từ đơn thuốc, kết quả xét nghiệm, hoặc ghi chú bác sĩ) và tạo ra một cấu trúc UI động dưới dạng JSON.
      
      Văn bản đầu vào: "${promptText}"
      Ngày hiện tại: "${currentDate}"

      Quy tắc:
      1. Không giả định một schema cố định. Điều chỉnh modules UI dựa trên nội dung.
      2. Nếu là đơn thuốc (Prescription): 
         - Sử dụng module 'medication_schedule'.
         - NHÓM thuốc một cách THÔNG MINH theo các session: "morning" (Sáng), "noon" (Trưa), "evening" (Chiều/Tối), "as_needed" (Khi cần/Sốt/Đau).
         - Tính xem đơn thuốc còn hiệu lực hay không dựa trên "Current Date" so với "Prescription Date" + "Duration".
         - Xem KỸ trường hợp 'as_needed': bất kỳ thuốc nào không nằm trong liều/cử chính (thuốc ngoài cử chính), hoặc có chỉ dẫn như "khi cần", "khi đau", "khi sốt", hoặc không có lịch dùng cố định, PHẢI được xếp vào session "as_needed". Nếu một thuốc vừa có liều cố định vừa có hướng dẫn "khi cần", tách phần 'as_needed' thành mục riêng.
      3. Nếu là kết quả xét nghiệm (Lab Result): dùng module 'info_list'.
      4. Nếu là lời khuyên chung: dùng module 'text_block'.
      5. Luôn cung cấp 'summary_card' ở đầu.

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
        "suggested_questions": ["Câu hỏi 1?", "Câu hỏi 2?", "Câu hỏi 3?", "Câu hỏi 4?"] (min 4, max 4. QUAN TRỌNG: Đây là câu hỏi BỆNH NHÂN hỏi Bác sĩ. Ví dụ: "Tôi nên kiêng ăn gì?", "Bệnh này có lây không?". KHÔNG ĐƯỢC tạo câu hỏi bác sĩ hỏi bệnh nhân),
        "speech_text": "A warm greeting and summary for Text-to-Speech."
      }
      
      Chỉ trả về đối tượng JSON, không kèm định dạng markdown.
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
      Cung cấp hướng dẫn chi tiết nhưng đơn giản cho thuốc "${drugName}" dành cho "${patientContext}".
      Trả về một đối tượng JSON hợp lệ với cấu trúc sau:
      {
        "summary": "A simple one-sentence explanation of what this drug does.",
        "usage_guide": "Step-by-step guide on how to take it (e.g., before/after food, with water).",
        "side_effects": ["Common side effect 1", "Common side effect 2"],
        "lifestyle_advice": "One tip for lifestyle changes while taking this drug (e.g., drink water, avoid alcohol).",
        "serious_warning": "One important warning (e.g., stop if rash appears).",
        "suggested_questions": ["Câu hỏi bệnh nhân thắc mắc về thuốc này?", "Câu hỏi 2?", "Câu hỏi 3?", "Câu hỏi 4?"] (LƯU Ý: Vai bệnh nhân lớn tuổi hỏi bác sĩ)
      }
      Chỉ trả về đối tượng JSON, không kèm định dạng markdown.
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
   * Generates more suggested questions based on context.
   */
  async generateMoreQuestions(currentQuestions, context) {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      return [
        "Tôi nên ăn gì?",
        "Tôi nên kiêng gì?",
        "Bệnh này bao lâu thì khỏi?",
        "Thuốc này uống lúc nào?",
      ];
    }

    const prompt = `
      Ngữ cảnh: ${context}
      Câu hỏi hiện tại: ${JSON.stringify(currentQuestions)}
      Tạo đúng 4 câu hỏi mới, ngắn gọn, đơn giản, phù hợp cho người lớn tuổi về đơn thuốc hoặc chẩn đoán, không trùng với các câu hỏi hiện tại.
      QUAN TRỌNG: Các câu hỏi này là do BỆNH NHÂN hỏi BÁC SĨ để hiểu thêm về bệnh tình.
      Ví dụ ĐÚNG: "Tôi có được ăn trứng không?", "Uống thuốc này có mệt không?", "Khi nào tôi cần tái khám?".
      Ví dụ SAI (Cấm): "Bác có bị tiểu đường không?", "Bác thấy trong người thế nào?".
      Trả về một mảng JSON gồm 4 chuỗi câu hỏi.
      Chỉ trả về mảng JSON, không thêm gì khác.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      let arr = JSON.parse(jsonString);
      // Đảm bảo luôn trả về 4 câu hỏi
      if (!Array.isArray(arr) || arr.length !== 4) {
        arr = [
          "Tôi nên ăn gì?",
          "Tôi nên kiêng gì?",
          "Bệnh này bao lâu thì khỏi?",
          "Thuốc này uống lúc nào?",
        ];
      }
      return arr;
    } catch (error) {
      console.error("Error generating questions:", error);
      return [
        "Tôi nên ăn gì?",
        "Tôi nên kiêng gì?",
        "Bệnh này bao lâu thì khỏi?",
        "Thuốc này uống lúc nào?",
      ];
    }
  },

  /**
   * Analyzes lab results to provide a summary.
   */
  async analyzeLabResults(results) {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      return {
        summary: "Kết quả xét nghiệm của bác có một số chỉ số cần lưu ý.",
        highlights: [
          { title: "Lưu ý", content: "Vui lòng tham khảo ý kiến bác sĩ." },
        ],
      };
    }

    const prompt = `
      Phân tích các kết quả xét nghiệm sau cho bệnh nhân cao tuổi: ${JSON.stringify(
        results
      )}
      Trả về một đối tượng JSON bằng tiếng Việt với:
      {
        "summary": "Tóm tắt ngắn gọn (tối đa 2 câu) về tình trạng sức khỏe chung bằng tiếng Việt, giọng văn ân cần, dễ hiểu.",
        "highlights": [
          { "title": "Tin tốt", "content": "Chỉ số nào tốt", "type": "green" },
          { "title": "Cần chú ý", "content": "Chỉ số nào bất thường", "type": "red" }
        ]
      }
      Chỉ trả về JSON.
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
      console.error("Error analyzing lab results:", error);
      return { summary: "Không thể phân tích kết quả.", highlights: [] };
    }
  },

  /**
   * Explains a specific lab result indicator.
   */
  async explainLabResult(testName, testValue, context) {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      return {
        explanation: `Chỉ số ${testName} của bác là ${testValue}.`,
        suggested_questions: [
          "Chỉ số này có nguy hiểm không?",
          "Tôi cần ăn kiêng gì?",
        ],
      };
    }

    const prompt = `
      Giải thích chỉ số xét nghiệm '${testName}: ${testValue}' cho người cao tuổi.
      Ngữ cảnh: ${context}.
      
      Yêu cầu:
      1. Cực kỳ ngắn gọn (tối đa 3 dòng).
      2. Dùng ngôn ngữ bình dân, dễ hiểu.
      3. Sử dụng ký hiệu so sánh trực quan (ví dụ: Kết quả ${testValue} > Mức an toàn 100).
      4. Kết luận ngay là Tốt hay Xấu.
      
      Return a JSON object:
      {
        "explanation": "Markdown text...",
        "suggested_questions": ["Câu hỏi bệnh nhân thắc mắc về chỉ số này?", "Câu hỏi 2?", "Câu hỏi 3?", "Câu hỏi 4?"] (min 4, max 4. Đóng vai bệnh nhân hỏi)
      }
      Chỉ trả về JSON.
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
      console.error("Error explaining lab result:", error);
      return {
        explanation: "Xin lỗi, không thể giải thích chỉ số này lúc này.",
        suggested_questions: [],
      };
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
      return {
        answer:
          "I am a demo bot. Please configure your Gemini API Key to chat for real.",
        suggested_questions: ["How to configure API Key?", "Is this free?"],
      };
    }

    let finalMessage = message;
    const systemInstruction = `
      Bạn là trợ lý y tế ảo 'HealthBuddy' dành cho người lớn tuổi. 
      Ngữ cảnh: ${context}
      
      Yêu cầu:
      1. Trả lời bằng Tiếng Việt, ngắn gọn, dễ hiểu, ân cần.
      2. Nếu ngữ cảnh (context) rỗng hoặc không có thông tin bệnh lý, và người dùng hỏi về tình trạng sức khỏe của họ, hãy hướng dẫn họ chọn tính năng "Quét đơn thuốc" hoặc "Chụp kết quả" để bạn có dữ liệu tư vấn.
      3. Trả về định dạng JSON:
      {
        "answer": "Nội dung trả lời (Markdown)...",
        "suggested_questions": ["Câu hỏi tiếp theo bệnh nhân nên hỏi?", "Câu hỏi 2?", "Câu hỏi 3?", "Câu hỏi 4?"] (Tối đa 4 câu. Đóng vai bệnh nhân hỏi lại bác sĩ),
        "action": "scan_prescription" (Nếu bạn khuyên người dùng quét đơn thuốc/kết quả xét nghiệm) hoặc null
      }
      Chỉ trả về JSON.
    `;

    if (history.length === 0) {
      finalMessage = `${systemInstruction}\n\nUser Question: ${message}`;
    } else {
      finalMessage = `${systemInstruction}\n\nUser Question: ${message}`;
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    try {
      const result = await chat.sendMessage(finalMessage);
      const response = await result.response;
      const text = response.text();
      try {
        const jsonString = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        return JSON.parse(jsonString);
      } catch (e) {
        return {
          answer: text,
          suggested_questions: [],
        };
      }
    } catch (error) {
      console.error("Chat error:", error);
      return {
        answer: "Xin lỗi, bác sĩ ảo đang bận. Bác vui lòng thử lại sau.",
        suggested_questions: [],
      };
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
  suggested_questions: [
    "Thuốc này có hại dạ dày không?",
    "Uống thuốc này có buồn ngủ không?",
  ],
});
