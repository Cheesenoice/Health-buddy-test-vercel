import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill } from "lucide-react";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center space-y-4">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <Pill size={40} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-700">Chưa có đơn thuốc</h2>
      <p className="text-gray-500">
        Hãy quét mã QR hoặc chụp đơn thuốc để bắt đầu theo dõi sức khỏe.
      </p>
      <button
        onClick={() => navigate("/scan")}
        className="bg-zalo-primary text-white px-6 py-3 rounded-full font-bold shadow-md mt-4"
      >
        Quét đơn ngay
      </button>
    </div>
  );
};

export default EmptyState;
