import React from "react";
import {
  X,
  Info,
  Clock,
  AlertCircle,
  Activity,
  HelpCircle,
} from "lucide-react";

const DrugInfoModal = ({
  selectedDrug,
  onClose,
  loadingInfo,
  drugInfo,
  onQuestionClick,
}) => {
  if (!selectedDrug) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-auto sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-slide-up">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {selectedDrug.name}
            </h3>
            <p className="text-sm text-gray-500">{selectedDrug.dosage}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loadingInfo ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-10 h-10 border-4 border-zalo-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse">
                Đang tra cứu thông tin thuốc...
              </p>
            </div>
          ) : drugInfo ? (
            <>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Info size={18} /> Công dụng
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {drugInfo.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  Hướng dẫn sử dụng
                </h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {drugInfo.usage_guide}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  Tác dụng phụ thường gặp
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 bg-red-50 p-3 rounded-lg border border-red-100">
                  {drugInfo.side_effects?.map((effect, i) => (
                    <li key={i}>{effect}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Activity size={18} className="text-green-500" />
                  Lời khuyên sống khỏe
                </h4>
                <p className="text-gray-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                  {drugInfo.lifestyle_advice}
                </p>
              </div>

              {drugInfo.serious_warning && (
                <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-700 text-sm mb-1 flex items-center gap-2">
                    <AlertCircle size={16} /> Cảnh báo quan trọng
                  </h4>
                  <p className="text-red-600 text-xs">
                    {drugInfo.serious_warning}
                  </p>
                </div>
              )}

              {/* Suggested Questions */}
              {drugInfo.suggested_questions &&
                drugInfo.suggested_questions.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
                      <HelpCircle size={14} /> CÂU HỎI THƯỜNG GẶP
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {drugInfo.suggested_questions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onClose();
                            onQuestionClick(q);
                          }}
                          className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-gray-50 hover:border-zalo-primary hover:text-zalo-primary text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Không tìm thấy thông tin chi tiết.
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full bg-zalo-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugInfoModal;
