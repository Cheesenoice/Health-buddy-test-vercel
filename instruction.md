# 🏥 TÊN DỰ ÁN: HealthBuddy (TÂM AN AI)

**Slogan:** _Trợ lý Y tế thụ động & Ví sức khỏe trọn đời trên Zalo._

---

## 📖 PHẦN 1: TỔNG QUAN GIẢI PHÁP (EXECUTIVE SUMMARY)

**Vấn đề (Pain Point):**

1. **Khoảng trống thông tin:** Sau khi rời bệnh viện, bệnh nhân (đặc biệt là người già) thường quên lời dặn, uống thuốc sai, dẫn đến hiệu quả điều trị kém hoặc tái nhập viện.
2. **Rào cản công nghệ:** Người lớn tuổi ngại cài App mới, mắt kém, không biết gõ phím (typing).
3. **Dữ liệu phân mảnh:** Đi khám Bệnh viện A, chiều khám Phòng khám B, đơn thuốc chồng chéo gây nguy cơ tương tác thuốc nguy hiểm.

**Giải pháp cốt lõi:**
Một **Zalo Mini App** tích hợp AI, hoạt động theo cơ chế **"Passive Interaction" (Tương tác thụ động)**. Người dùng không cần nhập liệu, chỉ cần quét QR hoặc chụp ảnh đơn thuốc. AI sẽ tự động phân tích, nhắc nhở, cảnh báo và trả lời bằng giọng nói.

---

## 🗺️ PHẦN 2: USER FLOW & TRẢI NGHIỆM NGƯỜI DÙNG (UX)

### 1. Luồng tiếp nhận dữ liệu (Data Ingestion Flow)

**Bước 1: Kích hoạt & Định danh**

- Bệnh nhân mở Zalo → Quét QR trên đơn thuốc (hoặc mở Mini App).
- **Quyền truy cập:** Zalo Mini App hiện popup xin quyền: _"HealthBuddy muốn truy cập số điện thoại và tên của bạn"_. Người dùng bấm **"Đồng ý"**.
- **Mapping (Ghép cặp):** Hệ thống so sánh SĐT Zalo với SĐT bệnh nhân trong dữ liệu QR.
  - **TRÙNG KHỚP:** Mở khóa hồ sơ, lưu Zalo ID là "Chủ sở hữu".
  - **KHÔNG TRÙNG:** Hỏi _"Bạn đang quét đơn thuốc của [Nguyễn Văn A]? Xác nhận bạn là người nhà?"_. Nếu xác nhận, lưu là "Người giám hộ".
  - _Kết luận:_ Không cần đăng ký user/pass. SĐT Zalo là Key.

**Bước 2: Xử lý dữ liệu đầu vào**

- **Kịch bản A (Happy Case - Có QR HealthBuddy):** App nhận `Token`, tải JSON sạch từ Server. Độ chính xác 100%.
- **Kịch bản B (Fallback - Đơn giấy cũ/Phòng khám nhỏ):**
  - Chọn nút "📷 Chụp đơn giấy".
  - **VNPT SmartReader (OCR)** đọc văn bản → **LLM** cấu trúc hóa dữ liệu.
  - Hiển thị lại kết quả để người dùng xác nhận nhanh ("Đúng/Sai").

### 2. Giao diện Tương tác Thụ động (Passive Dashboard)

_Mục tiêu: Người già không cần suy nghĩ, không cần gõ phím._

1.  **Màn hình Chờ (Trust Loader):**

    - Hiệu ứng: _"Đang kết nối dữ liệu bệnh viện..."_ → _"AI đang kiểm tra tương tác thuốc..."_ (Tạo niềm tin).

2.  **Header: Chẩn đoán & Kích cầu:**

    - Hiển thị tên bệnh + Lời dặn AI tóm tắt (Dịch sang ngôn ngữ bình dân: "Phổi bác đang viêm, sẽ gây ho...").
    - **VNPT SmartVoice:** Tự động phát tiếng chào và dặn dò ngắn gọn.

3.  **Lịch trình ngang (Horizontal Timetable):**

    - Giao diện trượt ngang: Quá khứ (mờ) - **Hiện tại (nổi bật, ảnh thuốc thật)** - Tương lai (nhỏ).
    - Logic: Tự động gộp thuốc từ nhiều đơn khác nhau vào cùng một dòng thời gian.

4.  **Thẻ thuốc thông minh (Drug Card Modal):**

    - **Trigger:** Bấm vào icon ℹ️ cạnh tên thuốc.
    - **AI Summary:** Tên thuốc to rõ + 1 câu giải thích công dụng cực ngắn (VD: "Thuốc này giúp diệt vi khuẩn").
    - **Contextual Chips:** Gợi ý 2-3 câu hỏi liên quan (VD: "Có hại dạ dày không?", "Gây buồn ngủ không?").

5.  **Voice Bar (Hỏi đáp):** Nút Micro nổi ở dưới cùng. Bấm để hỏi, AI trả lời bằng giọng nói.

### 3. Nhắc nhở & Bảo mật (Retention)

- **Thông báo Zalo (ZNS):** Đến giờ uống thuốc, Zalo tự gửi tin nhắn nhắc nhở kèm hình ảnh.
- **Chế độ Người giám hộ:** Con cái theo dõi được lịch sử uống thuốc của bố mẹ.

---

## 🛠️ PHẦN 3: KIẾN TRÚC KỸ THUẬT & XỬ LÝ DỮ LIỆU

### 1. Chiến lược thu thập dữ liệu (Data Strategy)

Nguyên tắc: **"Bệnh viện in ra cái gì, ta lấy được cái đó."**

**Dữ liệu thô thu được (Raw Data):**

1.  **Thông tin hành chính:** Tên, Tuổi, SĐT (Key quan trọng nhất).
2.  **Thông tin lâm sàng:** Chẩn đoán (Mã ICD), Triệu chứng ghi chú.
3.  **Thông tin thuốc (Core):** Tên thuốc, Hàm lượng, Số lượng, Cách dùng.
4.  **Lời dặn:** Ngày tái khám, ghi chú text tự do.

### 2. Quy trình xử lý AI (The AI Pipeline)

Dữ liệu từ lệnh in thường là Text thô (Unstructured). Quy trình xử lý của HealthBuddy:

1.  **Structuring (Cấu trúc hóa):** VNPT SmartReader/LLM biến text lộn xộn thành JSON chuẩn.
    - _Input:_ "Rx: Panadol 500mg #10v (S1, C1 sau an)"
    - _Output:_ `{"medicine": "Panadol", "dose": "500mg", "time": ["07:00", "18:00"]}`
2.  **Enriching (Làm giàu dữ liệu - ĐIỂM ĂN TIỀN):**
    - AI tự tra Dược thư tìm hình ảnh viên thuốc, công dụng, tác dụng phụ, tương tác thuốc.
    - _Kết quả:_ App hiển thị hình ảnh viên thuốc và lời cảnh báo mà trên đơn giấy không có.
3.  **Translation (Dịch sang ngôn ngữ người già):**
    - Đơn ghi: "J20 - Viêm phế quản".
    - AI dịch: "Phổi bác đang bị viêm, sẽ gây ho và đờm."

### 3. Giải pháp tích hợp (Deployment Options)

#### Phương án 1: HealthBuddy Print Middleware (Ưu tiên)

_Giải pháp "Không xâm lấn" (Non-Invasive Integration) - Plug-and-Play_

- **Cơ chế:** Coi hệ thống bệnh viện là "Hộp đen". Cài driver máy in ảo → Bắt lệnh in → Trích xuất text & Tạo QR → Chèn đè QR vào góc tờ giấy → Đẩy ra máy in thật.
- **Ưu điểm:**
  - **Zero-Code:** Không sửa code HIS bệnh viện.
  - **An toàn:** Luồng một chiều (One-way), chỉ ĐỌC lệnh in, không chạm Database gốc.
  - **Triển khai:** 15 phút/máy.

#### Phương án 2: API Connector

_Giải pháp "Truy xuất nhẹ" (Light Integration)_

- **Cơ chế:** Bệnh viện cấp quyền Read-only API. HealthBuddy query dữ liệu gốc và trả về QR ảnh để bệnh viện in.
- **Ưu điểm:** Data sạch 100%, lấy được cả dữ liệu không in ra giấy (xét nghiệm cũ).

---

## 💼 PHẦN 4: TÍNH NĂNG NGHIỆP VỤ NÂNG CAO

### 1. Cơ chế "Hợp nhất Đơn thuốc" (Cross-Prescription Check)

- **Case:** Sáng khám Tim mạch, chiều mua thêm thuốc Khớp.
- **AI Value:** Hệ thống lưu cả 2 đơn. AI chạy kiểm tra chéo. Nếu thuốc Khớp kỵ thuốc Tim mạch → **Cảnh báo Đỏ** ngay lập tức: _"Dừng lại! Hai thuốc này uống chung gây chảy máu."_

### 2. Cơ chế "Một QR cho tất cả" (One Visit ID)

- **Vấn đề:** Đi khám có nhiều tờ giấy (Xét nghiệm, X-quang, Đơn thuốc).
- **Giải pháp:** Gom tất cả dữ liệu đợt khám về một `Mã Đợt Khám`. Quét QR trên đơn thuốc cuối cùng là xem được tất cả (chia Tab: Xét nghiệm | X-quang | Thuốc).

### 3. Context-Aware Drug Education (Giáo dục thuốc theo ngữ cảnh)

Thay vì hiển thị tờ hướng dẫn sử dụng dài ngoằng, AI tạo nội dung "Micro-content":

- **Input:** Tên thuốc + Hồ sơ bệnh nhân (VD: Người già, hay đau bụng).
- **Generation:**
  - _Summary:_ 1 câu tóm tắt dễ hiểu.
  - _Suggested Q&A:_ AI dự đoán câu hỏi _người bệnh cụ thể này_ quan tâm (VD: Với thuốc kháng sinh, gợi ý câu hỏi về "Tiêu chảy").

---

## 🤖 PHẦN 5: ỨNG DỤNG VNPT AI (AI STACK)

| Chức năng             | API VNPT Sử dụng           | Vai trò cụ thể                                                                                                                         |
| :-------------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Đầu vào (Input)**   | **VNPT SmartReader (OCR)** | Đọc và số hóa đơn thuốc giấy, đơn viết tay khi không có QR.                                                                            |
| **Xử lý (Core)**      | **VNPT SmartBot (LLM)**    | - Cấu trúc hóa dữ liệu thô.<br>- Tra cứu tương tác thuốc.<br>- Tạo lời dặn bình dân hóa.<br>- Dự đoán câu hỏi người dùng (Predictive). |
| **Giao tiếp (UI)**    | **VNPT SmartVoice (TTS)**  | Chuyển văn bản thành giọng nói (Text-to-Speech) để người già "nghe" đơn thuốc.                                                         |
| **Lắng nghe (Input)** | **VNPT SmartVoice (STT)**  | Chuyển giọng nói người già thành văn bản để Bot trả lời (Speech-to-Text).                                                              |
| **Thấu hiểu**         | **VNSocial / Emotion**     | Phân tích cảm xúc qua giọng nói để phát hiện sự mệt mỏi/lo lắng của bệnh nhân.                                                         |
| **Tối ưu UX**         | **VNPT SmartUX**           | Theo dõi hành vi để tối ưu giao diện Mini App.                                                                                         |

---

## 📈 PHẦN 6: BUSINESS CASE & TÁC ĐỘNG

### 1. Tại sao Bệnh viện mua cái này? (B2B)

- **Tăng tỷ lệ tái khám:** AI giải thích rõ cơ chế bệnh, khiến bệnh nhân hiểu và quay lại tái khám đúng hẹn.
- **Giảm tải CSKH:** Bot trả lời tự động các câu hỏi thường gặp, giảm tải cho tổng đài.
- **Data Insight:** Theo dõi được việc tuân thủ điều trị của bệnh nhân.

### 2. Tại sao Bệnh nhân dùng? (B2C)

- **Tiện:** Có sẵn trên Zalo, không cần cài App lạ.
- **An tâm:** Có "Bác sĩ ảo" bên cạnh 24/7.
- **An toàn:** Được cảnh báo tương tác thuốc nguy hiểm.
