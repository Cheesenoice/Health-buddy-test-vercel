- giải đáp về data
  1. Flow
  - **Quy trình (User Flow):**
    1. Bệnh nhân mở Zalo  → Quét QR trên đơn thuốc.
    2. Zalo Mini App mở lên → Hiện popup xin quyền: *"HealFlow muốn truy cập số điện thoại và tên của bạn"*.
    3. Người dùng bấm **"Đồng ý"** (Đây là tính năng có sẵn của Zalo API).
    4. **Mapping (Ghép cặp):**
       - Hệ thống so sánh SĐT Zalo vừa lấy được với SĐT bệnh nhân được in trên đơn thuốc (dữ liệu trong QR).
       - Nếu **TRÙNG KHỚP** →Mở khóa hồ sơ, lưu Zalo ID này là "Chủ sở hữu" của đơn thuốc đó.
       - Nếu **KHÔNG TRÙNG** (Ví dụ con quét cho bố) → Hỏi: *"Bạn đang quét đơn thuốc của [Nguyễn Văn A]? Xác nhận bạn là người nhà?"*  → Nếu xác nhận, lưu Zalo ID này là "Người giám hộ".
  **Kết luận:** Không cần form đăng ký user/pass. SĐT Zalo chính là chìa khóa (Key).
  **2. Về Data: Chúng ta lấy được những gì? (Data Ingestion)**
  **Bệnh viện in ra cái gì, ta lấy được cái đó.**
  Chúng ta **không** chọc vào Database tổng của bệnh viện (việc này quá khó về bảo mật và xin phép), mà chúng ta "bắt" (capture) luồng dữ liệu văn bản được gửi đến máy in.
  **Cụ thể dữ liệu lấy được (Raw Data):**
  1. **Thông tin hành chính:**
     - Tên, Tuổi, Giới tính.
     - Số thẻ BHYT (nếu có in).
     - **Số điện thoại** (Quan trọng nhất để xác thực).
     - Địa chỉ.
  2. **Thông tin lâm sàng (Cực quan trọng cho AI):**
     - Chẩn đoán (VD: J20 - Viêm phế quản cấp).
     - Triệu chứng ghi chú (VD: Ho nhiều, sốt nhẹ).
  3. **Thông tin thuốc (The Core):**
     - Tên thuốc, Hàm lượng.
     - Số lượng.
     - Cách dùng (VD: Sáng 1 viên, Tối 1 viên, Uống sau ăn).
  4. **Lời dặn/Tái khám:**
     - Ngày hẹn tái khám.
     - Lời dặn dò (thường là text tự do).
  ### 3. AI sẽ làm gì với đống dữ liệu "Bệnh viện cho gì lấy đó" này?
  Dữ liệu lấy từ lệnh in thường là **Text thô (Unstructured Text)** hoặc định dạng lộn xộn. Đây chính là lúc **AI Generative** tỏa sáng để ghi điểm với BGK.
  **Quy trình xử lý dữ liệu của HealFlow:**
  1. **Input:** Một chuỗi văn bản lộn xộn lấy từ driver máy in.
     - *Ví dụ:* Rx: Panadol 500mg #10v (S1, C1 sau an) - Chan doan: Sot virus
  2. **AI Processing (VNPT SmartReader/LLM):**
     - **Structuring (Cấu trúc hóa):** Biến text lộn xộn thành JSON chuẩn.
       - "medicine": "Panadol", "dose": "500mg", "time": ["07:00", "18:00"].
     - **Enriching (Làm giàu dữ liệu - ĐIỂM ĂN TIỀN):**
       - Bệnh viện chỉ cho tên thuốc "Panadol".
       - **AI tự tra Dược thư:** Tìm ra hình ảnh viên thuốc, công dụng (giảm đau), tác dụng phụ (hại gan nếu uống rượu), tương tác thuốc.
       - *Kết quả:* App hiển thị hình ảnh viên thuốc và lời cảnh báo mà trên đơn giấy không có.
     - **Translation (Dịch sang ngôn ngữ người già):**
       - Đơn ghi: "J20 - Viêm phế quản".
       - AI dịch: "Phổi bác đang bị viêm, sẽ gây ho và đờm."
  quy trình về việc xin bệnh viện trích xuất data ko can thiệp
  Bạn hãy dùng đúng thuật ngữ **"Plug-and-Play Print Middleware"** (Phần mềm trung gian Cắm-là-chạy).
  ### 1. Tên giải pháp:
  **HealFlow Print Middleware: Tích hợp "Không xâm lấn" (Non-Invasive Integration)**
  ### 2. Mô tả cơ chế (Dành cho người không chuyên kỹ thuật):
  > "Hãy tưởng tượng HealFlow như một 'Trạm kiểm soát thông minh' đặt giữa Máy tính bác sĩ và Máy in."
  - **Quy trình cũ:** Máy tính bác sĩ →Máy in.
  - **Quy trình HealFlow:** Máy tính bác sĩ  → **HealFlow Middleware**  →Máy in.
  Khi bác sĩ nhấn lệnh "In đơn thuốc" trên phần mềm hiện tại:
  1. **Bắt tín hiệu:** HealFlow nhận luồng dữ liệu in (như một bản copy).
  2. **Xử lý tức thì:** Hệ thống tự động tạo mã QR chứa thông tin đơn thuốc đó.
  3. **Đóng dấu:** Chèn mã QR vào góc tờ đơn (như đóng dấu mộc).
  4. **Hoàn tất:** Đẩy lệnh ra máy in vật lý.
  **Toàn bộ quá trình diễn ra trong tích tắc, Bác sĩ không cần thay đổi bất kỳ thao tác nào.**
  ### 3. Tại sao giải pháp này An toàn & Khả thi? (Selling Points)
  - **🔒 Nguyên tắc "Luồng một chiều" (One-way Data Flow):**
    - HealFlow chỉ **ĐỌC** dữ liệu đầu ra (lệnh in) mà tuyệt đối **KHÔNG** có quyền truy cập hay chỉnh sửa Database (HIS) của bệnh viện. Điều này loại bỏ 100% rủi ro làm hỏng dữ liệu gốc.
  - **⚡ Triển khai "Plug-and-Play":**
    - Không cần viết lại code (No-code integration).
    - Không cần đấu nối API phức tạp.
    - Thời gian cài đặt: **15 phút/máy**. Tương thích với mọi phần mềm bệnh viện (VNPT HIS, Viettel HIS, FPT...).
  - **📄 Pháp lý & Bảo mật:**
    - Dữ liệu được xử lý cục bộ (On-premise) trước khi mã hóa thành QR Token. Tuân thủ cam kết bảo mật dữ liệu vì không mở cổng kết nối lạ vào hệ thống lõi.

---

- flow chính

  Mở Zalo, chọn chức năng quét QR, quét và dẫn vào zalo mini app
  vẫn có **Trust Loader**

  vào screen chính screen sẽ bao gồm

  - tóm tắt chuẩn đoán bệnh và lời bác sĩ nói - vì bệnh nhân sẽ quên
    - giải thích bệnh tật, lời dặn bác sĩ - mục đích hiểu rõ tác hại của bệnh → kích cầu tái khám
    - AI đọc QR và tạo luôn
  - AI pop up các card câu hỏi khả năng bệnh nhân sẽ hỏi
    - mục đích là ko muốn phụ huynh phải input, hay typing
      - mục đích hiểu rõ tác hại của bệnh → kích cầu tái khám
    - nếu ko có thì nhấn vào nút thu âm để nói chuyện vs AI
  - phần còn lại idea là làm lịch uống thuốc - timetable, để theo dõi uống thuốc trực quan
    - chứ ko phải to-do list cho phụ huynh vì họ sẽ ko check vào
    - phần này AI đọc thông tin từ QR và tự thêm vào lịch uống thuốc
    - thêm UI là 1, thêm vào nhắc nhở thông báo là 2 - thông báo tự nhảy khi tới giờ - thông báo = cái chat ZALO

- nghiệp vụ
  Đây là bản tài liệu tổng hợp toàn diện nhất về dự án **HealFlow (Tâm An AI)**. Tài liệu này được cấu trúc để bạn có thể dùng làm **Proposal (Hồ sơ thi)**, **PRD (Tài liệu yêu cầu sản phẩm)** cho team Dev, hoặc **Script** để thuyết trình (Pitching).
  ***
  # 🏥 TÊN DỰ ÁN: HEALFLOW (TÂM AN AI)
  **Slogan:** _Trợ lý Y tế thụ động & Ví sức khỏe trọn đời trên Zalo._
  ***
  ## 📖 PHẦN 1: TỔNG QUAN GIẢI PHÁP (EXECUTIVE SUMMARY)
  **Vấn đề (Pain Point):**
  1. **Khoảng trống thông tin:** Sau khi rời bệnh viện, bệnh nhân (đặc biệt là người già) thường quên lời dặn, uống thuốc sai, dẫn đến hiệu quả điều trị kém hoặc tái nhập viện.
  2. **Rào cản công nghệ:** Người lớn tuổi ngại cài App mới, mắt kém, không biết gõ phím (typing).
  3. **Dữ liệu phân mảnh:** Đi khám Bệnh viện A, chiều khám Phòng khám B, đơn thuốc chồng chéo gây nguy cơ tương tác thuốc nguy hiểm.
  **Giải pháp cốt lõi:**
  Một **Zalo Mini App** tích hợp AI, hoạt động theo cơ chế **"Passive Interaction" (Tương tác thụ động)**. Người dùng không cần nhập liệu, chỉ cần quét QR hoặc chụp ảnh đơn thuốc. AI sẽ tự động phân tích, nhắc nhở, cảnh báo và trả lời bằng giọng nói.
  ***
  ## 🗺️ PHẦN 2: USER FLOW HOÀN THIỆN (END-TO-END FLOW)
  Hành trình người dùng được chia làm 3 giai đoạn: **Nạp dữ liệu $\rightarrow$ Chăm sóc hàng ngày $\rightarrow$ Lưu trữ trọn đời.**
  ### Giai đoạn 1: Input Đa nguồn (Unified Input)
  _Mục tiêu: Đưa dữ liệu vào hệ thống dễ nhất có thể._
  1. **Điểm chạm:** Người dùng mở Zalo $\rightarrow$ Chọn tính năng Quét QR (hoặc mở Mini App).
  2. **Kịch bản A (Happy Case - Có QR HealFlow):**
     - Quét mã QR trên đơn thuốc/phiếu hướng dẫn.
     - **Xử lý:** App nhận diện `Token`, tải dữ liệu JSON sạch từ Server.
     - **Kết quả:** Vào ngay Dashboard. Độ chính xác 100%.
  3. **Kịch bản B (Fallback Case - Đơn giấy/Phòng khám nhỏ):**
     - mở zalo mini app vào giao diện chính
     - Người dùng chọn nút "📷 Chụp đơn giấy".
     - Chụp ảnh tờ đơn, có thể chụp nhiều đơn giấy
     - **Xử lý AI:** **VNPT SmartReader (OCR)** đọc văn bản $\rightarrow$ **LLM** cấu trúc hóa dữ liệu (Tên thuốc, liều lượng, giờ uống).
     - **Xác thực:** Hiện lại kết quả để người dùng check nhanh ("Đúng/Sai").
     - có thể trong lần quét có thể thiếu thông tin, nhưng có gì thì AI phân tích và giải thích cái đó
  ### Giai đoạn 2: Tương tác Thụ động (The Passive Dashboard)
  _Mục tiêu: Người già không cần suy nghĩ, không cần gõ phím._
  1. **Màn hình Chờ (Trust Loader):**
     - Hiệu ứng: _"Đang kết nối dữ liệu bệnh viện..."_ $\rightarrow$ _"AI đang kiểm tra tương tác thuốc..."_ (Tạo niềm tin & sự an tâm).
  2. **Header: Chẩn đoán & Kích cầu:**
     - Hiển thị tên bệnh + Lời dặn AI tóm tắt (nhấn mạnh tác hại nếu không tuân thủ để bệnh nhân sợ mà uống thuốc đúng giờ).
     - **VNPT SmartVoice:** Tự động phát tiếng chào và dặn dò ngắn gọn.
  3. **Lịch trình ngang (Horizontal Timetable):**
     - Giao diện trượt ngang.
     - **Quá khứ:** Mờ đi.
     - **Hiện tại (Active):** Phóng to, nổi bật, có hình ảnh viên thuốc thực tế.
     - **Tương lai:** Hiển thị nhỏ.
     - _Logic:_ Tự động gộp thuốc từ nhiều đơn khác nhau vào cùng một dòng thời gian.
  4. **Thẻ câu hỏi dự đoán (Predictive Big Cards):**
     - AI đoán 4 câu hỏi người già hay thắc mắc nhất (Ăn gì? Kiêng gì? Tác dụng phụ? Tái khám?).
     - Hiển thị dạng thẻ to + Icon minh họa.
     - **Tương tác:** Chạm là nghe câu trả lời (Voice). Không gõ phím.
  5. **Voice Bar (Hỏi đáp sâu):**
     - Nút Micro nổi ở dưới cùng. Bấm để hỏi bất kỳ điều gì $\rightarrow$ AI trả lời.
  ### 🎨 1. MÔ TẢ UI/UX (USER FLOW)
  **1. Điểm chạm (Trigger):**
  - Trên thẻ thuốc (trong Lịch trình ngang), ngay cạnh tên thuốc sẽ có một nút nhỏ hình tròn, icon **ℹ️** hoặc **Dấu hỏi (?)**.
  - Màu sắc: Xanh nhạt hoặc Xám, không quá chói để không tranh chấp với nút hành động chính.
  **2. Modal xuất hiện (The Drug Card):**
  - Khi bấm vào, một **Popup (hoặc Bottom Sheet)** hiện lên đè lên màn hình.
  - **Phần 1: Tóm tắt (AI Summary):**
    - Tên thuốc to rõ + Hình ảnh.
    - Một câu giải thích cực ngắn, bình dân: *"Đây là thuốc kháng sinh. Giúp diệt vi khuẩn gây viêm họng."*
    - _(Tự động phát giọng nói câu này)._
  - **Phần 2: Gợi ý câu hỏi (Contextual Chips):**
    - Ngay bên dưới là 2-3 thẻ câu hỏi liên quan chặt chẽ đến thuốc đó.
    - Ví dụ: [🤢 Có hại dạ dày không?] [😴 Có gây buồn ngủ?]
  - **Tương tác:** Bấm vào thẻ câu hỏi  AI trả lời ngay tại chỗ (Voice + Text).
  ### 💡 3. LOGIC "AI GENERATION" (ĐỂ VIẾT VÀO PROPOSAL)
  Trong phần kỹ thuật, bạn giải thích tính năng này như sau:
  > "Context-Aware Drug Education" (Giáo dục thuốc theo ngữ cảnh)
  >
  > Thay vì hiển thị tờ hướng dẫn sử dụng dài ngoằng mà không ai đọc, HealFlow sử dụng **LLM (SmartBot)** để tạo nội dung "Micro-content" cho từng loại thuốc:
  >
  > 1. **Input:** Tên thuốc (ví dụ: Augmentin).
  > 2. **Processing:** AI tra cứu Dược thư + Hồ sơ bệnh nhân (ví dụ: Người già, hay đau bụng).
  > 3. **Generation:**
  >    - **Summary:** Tạo 1 câu tóm tắt công dụng dễ hiểu nhất cho người già (bỏ qua các thuật ngữ hóa học).
  >    - **Suggested Q&A:** AI dự đoán 2 câu hỏi mà *người bệnh cụ thể này* quan tâm nhất (Ví dụ: Với thuốc kháng sinh Augmentin, AI sẽ gợi ý câu hỏi về "Tiêu chảy" vì đây là tác dụng phụ phổ biến nhất).
  ### Giai đoạn 3: Nhắc nhở & Bảo mật (Retention & Security)
  1. **Thông báo Zalo (ZNS):**
     - Đến giờ uống thuốc, Zalo tự gửi tin nhắn nhắc nhở (kèm hình ảnh thuốc). Không cần mở App thường xuyên.
  2. **Chế độ Người giám hộ:**
     - Con cái muốn xem lịch sử uống thuốc của bố mẹ.
  ***
  ## 💼 PHẦN 3: LOGIC NGHIỆP VỤ & TÍNH NĂNG NÂNG CAO
  Đây là phần biến dự án thành "Platform" chứ không chỉ là "App".
  tại bệnh viện đăng kí khám có hỏi số điện thoại cá nhân, số điện thoại con cái hoặc người giám hộ
  sau đó lên zalo mini app để đọc QR, giải quyết được vấn đề Authentic và bảo mật data
  QR được embed thông tin và mã hóa, không phải ai cũng quét được để đọc
  để dùng cần dùng zalo chính chủ khớp với các số điện thoại đã đăng kí
  ### 1. Cơ chế "Hợp nhất Đơn thuốc" (Cross-Prescription Check)
  - **Case:** Sáng ông A đi BV Bạch Mai lấy thuốc Tim mạch. Chiều ông A ra hiệu thuốc mua thêm thuốc Khớp.
  - **Xử lý:** Hệ thống lưu cả 2 đơn vào "Hồ sơ sức khỏe".
  - **AI Value:** AI chạy kiểm tra chéo (Cross-check). Nếu thuốc Khớp (mới) kỵ với thuốc Tim mạch (cũ) $\rightarrow$ **Cảnh báo Đỏ** ngay lập tức trên màn hình: _"Dừng lại! Hai thuốc này uống chung gây chảy máu. Gọi bác sĩ ngay!"_
  ### 2. Cơ chế "Một QR cho tất cả" (One Visit ID)
  - **Vấn đề:** Đi khám có 5-6 tờ giấy (Xét nghiệm máu, X-quang, Đơn thuốc...). Quét từng tờ rất phiền.
  - **Giải pháp:** Tất cả dữ liệu trong một đợt khám được gom về một `Mã Đợt Khám (Visit ID)`. Mã QR trên tờ đơn thuốc cuối cùng là chìa khóa vạn năng.
  - **UX:** Quét 1 lần $\rightarrow$ App tự chia Tab: [Kết quả Xét nghiệm] | [Hình ảnh X-quang] | [Đơn thuốc].
  ### 3. Cơ chế Lịch sử "Ví sức khỏe"
  - Lưu trữ Timeline trọn đời: Tháng 1 khám ở đâu, Tháng 2 khám ở đâu.
  - Dễ dàng tìm lại đơn thuốc cũ để đi mua thuốc hoặc đưa cho bác sĩ mới tham khảo.
  ***
  ### 🛠️ PHẦN 4: CHIẾN LƯỢC TRIỂN KHAI & KHẢ THI (HOW TO DEPLOY)
  Để trình bày vào Proposal một cách mạch lạc, thuyết phục và thể hiện sự linh hoạt của hệ thống, bạn nên chia mục **"Chiến lược Triển khai & Tích hợp" (Deployment Strategy)** thành 2 cấp độ rõ ràng.
  Dưới đây là cách diễn giải **Straight-forward (Đi thẳng vào vấn đề)** cho 2 phương án này:
  ***
  ### 🏛️ PHƯƠNG ÁN 1: TÍCH HỢP "KHÔNG XÂM LẤN" (THE NON-INVASIVE WAY)
  **Tên kỹ thuật:** \*HealFlow Print Middleware (Máy in ảo)**\*Dành cho:** Các bệnh viện quy trình cũ, hệ thống đóng (Legacy systems), hoặc ngại rủi ro bảo mật.
  **Cơ chế hoạt động:**
  Chúng ta coi hệ thống bệnh viện là một "Hộp đen" (Blackbox). Chúng ta chỉ quan tâm đầu ra là tờ giấy.
  1. **Cài đặt:** Cài một driver máy in ảo nhẹ (3MB) lên máy tính bác sĩ.
  2. **Đánh chặn (Intercept):** Khi bác sĩ nhấn "In", Middleware chặn lệnh in lại.
  3. **Trích xuất & Chèn:** Nó "đọc" nội dung văn bản trong lệnh in $\rightarrow$ Tạo QR Code $\rightarrow$ Chèn đè mã QR này vào góc tờ giấy.
  4. **Hoàn tất:** Gửi lệnh ra máy in thật.
  **Điểm mạnh để "bán" giải pháp:**
  - ✅ **Zero-Code Change:** Bệnh viện **không cần sửa bất kỳ dòng code nào** trong phần mềm quản lý (HIS) của họ.
  - ✅ **Triển khai siêu tốc:** Cài là chạy (Plug & Play) trong 15 phút.
  - ✅ **An toàn tuyệt đối:** HealFlow chỉ "nhìn" thấy dữ liệu khi nó được in ra, không bao giờ chạm vào Database gốc.
  ***
  ### 🏛️ PHƯƠNG ÁN 2: TÍCH HỢP "TRUY XUẤT NHẸ" (THE LIGHT INTEGRATION WAY)
  **Tên kỹ thuật:** \*HealFlow API Connector (Kết nối API)**\*Dành cho:** Bệnh viện đã Chuyển đổi số, cởi mở, muốn dữ liệu đầy đủ và chính xác 100%.
  **Cơ chế hoạt động:**
  Bệnh viện cấp cho HealFlow một quyền **"Đọc giới hạn" (Read-only Access)** thông qua API hoặc View Database.
  1. **Kích hoạt (Trigger):** Khi bác sĩ nhấn nút "Lưu & In" trên phần mềm bệnh viện.
  2. **Truy vấn (Query):** Phần mềm bệnh viện bắn một tín hiệu (chứa `Mã Đợt Khám`) sang Server HealFlow.
  3. **Trích xuất (Fetch):** HealFlow dùng mã đó, gọi ngược lại API bệnh viện để lấy trọn bộ hồ sơ (File PDF xét nghiệm gốc, Đơn thuốc dạng JSON chuẩn).
  4. **Phản hồi:** HealFlow trả về một mã QR (dưới dạng ảnh) để phần mềm bệnh viện tự in lên giấy.
  **Điểm mạnh "Straight-forward":**
  - ✅ **Data Sạch (Clean Data):** Không cần OCR hay phân tích lệnh in. Dữ liệu lấy trực tiếp từ nguồn nên chính xác 100%.
  - ✅ **Lấy được nhiều hơn:** Có thể lấy được cả những ghi chú của bác sĩ hoặc kết quả xét nghiệm cũ mà **không cần in ra giấy**.
  - ✅ **Quy trình chuẩn:** Đây là cách làm việc tiêu chuẩn của các hệ thống Y tế hiện đại (HL7/FHIR).
  ***
  ### 📊 BẢNG SO SÁNH (Đưa vào Slide/Proposal)
  | Đặc điểm                 | Phương án 1: Máy in ảo (No-Touch) | Phương án 2: Kết nối API (Light-Touch) |
  | ------------------------ | --------------------------------- | -------------------------------------- |
  | **Độ can thiệp**         | **0%** (Không đụng vào hệ thống)  | **10%** (Cần IT bệnh viện mở cổng API) |
  | **Dữ liệu lấy được**     | Chỉ những gì in trên giấy         | Toàn bộ hồ sơ số (cả cái không in)     |
  | **Độ chính xác**         | 98% (Phụ thuộc format in)         | **100%** (Dữ liệu gốc)                 |
  | **Thời gian triển khai** | Ngay lập tức (Cài đặt máy trạm)   | 1-2 tuần (Cấu hình Server)             |
  | **Trường hợp dùng**      | Phòng khám tư, BV cũ, Demo nhanh  | BV lớn, BV thông minh, Hợp tác sâu     |
  ### 💡 LỜI KHUYÊN CHIẾN THUẬT
  Trong Proposal vòng này, bạn hãy viết:
  > "HealFlow được thiết kế với kiến trúc linh hoạt, ưu tiên Phương án 1 (Máy in ảo) để thâm nhập thị trường nhanh chóng mà không gặp rào cản kỹ thuật. Tuy nhiên, hệ thống sẵn sàng chuyển sang Phương án 2 (API Integration) khi đối tác bệnh viện muốn nâng cao trải nghiệm dữ liệu chuyên sâu."
  Câu này cho thấy bạn vừa thực dụng (biết cách đi nhanh) vừa có tầm nhìn (biết cách làm chuẩn).
  ***
  ### 🤖 PHẦN 5: ỨNG DỤNG AI TRIỆT ĐỂ (AI STACK)
  Sử dụng bộ API của cuộc thi (VNPT AI) để giải quyết từng khâu:
  | Chức năng             | API Sử dụng                | Vai trò của AI                                                                                                                         |
  | --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | **Đầu vào (Input)**   | **VNPT SmartReader (OCR)** | Đọc và số hóa đơn thuốc giấy, đơn viết tay khi không có QR.                                                                            |
  | **Xử lý (Core)**      | **VNPT SmartBot (LLM)**    | - Cấu trúc hóa dữ liệu thô.<br>- Tra cứu tương tác thuốc.<br>- Tạo lời dặn bình dân hóa.<br>- Dự đoán câu hỏi người dùng (Predictive). |
  | **Giao tiếp (UI)**    | **VNPT SmartVoice (TTS)**  | Chuyển văn bản thành giọng nói (Text-to-Speech) để người già "nghe" đơn thuốc.                                                         |
  | **Lắng nghe (Input)** | **VNPT SmartVoice (STT)**  | Chuyển giọng nói người già thành văn bản để Bot trả lời (Speech-to-Text).                                                              |
  |                       |                            |                                                                                                                                        |
  | **Thấu hiểu**         | **VNSocial / Emotion**     | Phân tích cảm xúc qua giọng nói để phát hiện sự mệt mỏi/lo lắng của bệnh nhân.                                                         |
  | **Tính năng HealFlow (User Feature)**                   | **API VNPT sử dụng**                                         | **Vai trò cụ thể trong hệ thống** |
  | ------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
  | **1. Đọc đơn thuốc giấy**<br>(Dự phòng khi không có QR) | **VNPT SmartReader**<br>_(5.1 OCR + 5.2 Bóc tách thông tin)_ | Chụp ảnh đơn thuốc                |
  `→` API bóc tách dữ liệu: Tên thuốc, Liều lượng, Lời dặn
  `→` Chuyển thành JSON để nạp vào Lịch uống thuốc. |
  | **2. Tóm tắt bệnh án**<br>(Giáo dục bệnh nhân) | **VNPT SmartReader**<br>_(5.3 Tóm tắt)_ | Đầu vào là đoạn chẩn đoán dài dòng của bác sĩ
  `→` API tóm tắt lại thành 1 câu dễ hiểu cho người già (VD: "Phổi bác đang yếu, cần kiêng lạnh"). |
  | **3. Bác sĩ ảo ra lệnh**<br>(Voice-First Interface) | **VNPT SmartVoice**<br>_(3.1 Text to Speech)_ | Chuyển đổi text hướng dẫn thành **Giọng nói tự nhiên** (Miền Bắc/Nam). Tự động phát khi mở Mini App để người già không cần đọc. |
  | **4. Bệnh nhân hỏi đáp**<br>(Không gõ phím) | **VNPT SmartVoice**<br>_(3.2 Speech to Text)_ | Người già bấm nút Micro và nói
  `→` API chuyển thành Text để gửi cho Bot xử lý. |
  | **5. Phân tích sức khỏe qua giọng nói**<br>(Cảnh báo sớm) | **VNPT SmartVoice**<br>_(3.4 Phân tích cuộc gọi GenAI)_ | Phân tích **Cảm xúc/Tone giọng** khi người già nói. Nếu phát hiện giọng "mệt mỏi", "hoảng loạn"
  `→` Gửi cảnh báo Zalo cho người nhà. |
  | **6. Trí tuệ Y khoa**<br>(Bộ não tư vấn) | **VNPT SmartBot**<br>_(4.2 SmartBot nâng cao - LLM)_ | Đóng vai trò là Dược sĩ AI. Nhận câu hỏi từ người dùng
  `→` Tra cứu Context đơn thuốc
  `→` Trả lời (VD: "Thuốc này gây buồn ngủ, bác nên ngủ trưa"). |
  | | | |
  | **7. Tối ưu trải nghiệm**<br>(Analytics) | **VNPT SmartUX**<br>_(7.1 SmartUX)_ | Theo dõi hành vi: Người già hay bấm vào nút nào nhất? Hay kẹt ở bước nào? Để tối ưu giao diện Zalo Mini App. |
  | | | |
  ***
  ### 📈 PHẦN 6: BUSINESS CASE & TÁC ĐỘNG
  ### 1. Tại sao Bệnh viện mua cái này? (B2B)
  - **Tăng tỷ lệ tái khám:** AI giải thích rõ cơ chế bệnh, khiến bệnh nhân sợ/hiểu và quay lại tái khám đúng hẹn.
  - **Giảm tải CSKH:** Bot trả lời tự động các câu hỏi "Thuốc này uống lúc nào", "Kiêng gì", giúp tổng đài bệnh viện đỡ bận.
  - **Data Insight:** Bệnh viện biết được bệnh nhân về nhà có uống thuốc không, hay bỏ ngang.
  ### 2. Tại sao Bệnh nhân dùng? (B2C)
  - **Tiện:** Có sẵn trên Zalo.
  - **An tâm:** Có "Bác sĩ ảo" bên cạnh 24/7.
  - **An toàn:** Được cảnh báo nếu uống nhầm thuốc.
  ***
  ### ✅ TỔNG KẾT
  **HealFlow** không chỉ là một ứng dụng nhắc thuốc. Nó là một **lớp (layer) công nghệ thông minh** nằm giữa Bệnh viện và Bệnh nhân, giúp xóa bỏ rào cản công nghệ cho người cao tuổi bằng **Passive AI** và **Zalo Ecosystem**.
