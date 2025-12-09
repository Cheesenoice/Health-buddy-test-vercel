import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HistoryPage = () => {
  const navigate = useNavigate();
  const items = [
    {
      date: "09/12/2025",
      source: "BV Đại học Y",
      summary: "Viêm phế quản cấp",
      meta: "3 loại thuốc • BS A",
      verified: true,
    },
    {
      date: "01/11/2025",
      source: "Phòng khám Tư nhân",
      summary: "Đau lưng (Thoát vị)",
      meta: "2 loại thuốc • BS Hùng",
      verified: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-2">Lịch sử khám</h1>
        <p className="text-sm text-gray-600 mb-4">
          Danh sách các lần khám trước đây và đơn thuốc liên quan sẽ hiển thị ở
          đây.
        </p>
        <div className="v-timeline">
          {items.map((it, idx) => (
            <div key={idx} className={`vt-item ${idx === 0 ? "active" : ""}`}>
              <div className="vt-dot"></div>
              <div className="vt-date">{it.date}</div>
              <div className="vt-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <b style={{ color: "#0068FF" }}>{it.source}</b>
                  <span
                    className={`source-tag ${
                      it.verified ? "src-qr" : "src-ocr"
                    }`}
                  >
                    {it.verified ? "QR Verified" : "Ảnh chụp"}
                  </span>
                </div>
                <div style={{ fontSize: 14 }}>{it.summary}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>
                  {it.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
