import React, { useEffect, useRef } from "react";
import { Pill, Clock, Activity, Stethoscope } from "lucide-react";

const ModuleRenderer = ({ module, onDrugClick }) => {
  const scrollRef = useRef(null);
  const currentHour = new Date().getHours();

  const getSessionStatus = (session) => {
    // Handle "As Needed" (Khi cần) - Always available
    if (session === "as_needed" || session === "khi_can") {
      return "neutral";
    }

    // Simple logic to determine if a session is past, active, or future
    // Morning: 0-11, Noon: 11-14, Evening: 14-24
    let startHour = 0;
    let endHour = 0;

    if (session === "morning") {
      startHour = 0;
      endHour = 11;
    } else if (session === "noon") {
      startHour = 11;
      endHour = 14;
    } else if (session === "evening") {
      startHour = 14;
      endHour = 24;
    } else {
      // Fallback for unknown sessions
      return "neutral";
    }

    if (currentHour >= endHour) return "past";
    if (currentHour >= startHour && currentHour < endHour) return "active";
    return "future";
  };

  // Auto-scroll to active or relevant session
  useEffect(() => {
    if (
      module.type === "medication_schedule" &&
      scrollRef.current &&
      Array.isArray(module.data)
    ) {
      let activeIndex = module.data.findIndex(
        (slot) => getSessionStatus(slot.session) === "active"
      );

      // If no active session, look for the first future or neutral one
      if (activeIndex === -1) {
        activeIndex = module.data.findIndex((slot) => {
          const s = getSessionStatus(slot.session);
          return s === "future" || s === "neutral";
        });
      }

      if (activeIndex !== -1) {
        const container = scrollRef.current;
        const card = container.children[activeIndex];

        if (card) {
          // Center the active card
          const scrollLeft =
            card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
          container.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }
  }, [module]);

  switch (module.type) {
    case "medication_scroll":
      return (
        <div className="px-4 mb-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Pill size={18} className="text-zalo-primary" /> {module.title}
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
            {Array.isArray(module.data) &&
              module.data.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onDrugClick(item)}
                  className="min-w-[280px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 snap-center active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                      <Pill size={24} />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mb-1">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">{item.detail}</p>
                  <div className="flex items-center gap-2 text-sm text-zalo-primary bg-blue-50 p-2 rounded-lg">
                    <Clock size={14} />
                    <span>{item.sub_detail}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );

    case "medication_schedule":
      return (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 px-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-zalo-primary" /> {module.title}
            </h3>
            {module.status === "expired" && (
              <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded">
                Đã kết thúc
              </span>
            )}
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {Array.isArray(module.data) &&
              module.data.map((slot, idx) => {
                const status = getSessionStatus(slot.session);
                const isActive = status === "active";
                const isPast = status === "past";
                const isNeutral = status === "neutral";

                return (
                  <div
                    key={idx}
                    className={`min-w-[85%] p-4 rounded-2xl border transition-all snap-center relative overflow-hidden
                    ${
                      isActive
                        ? "bg-blue-50 border-zalo-primary shadow-lg scale-[1.02]"
                        : isPast
                        ? "bg-gray-50 border-gray-200"
                        : isNeutral
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-zalo-primary"></div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <div
                        className={`text-lg font-extrabold ${
                          isActive
                            ? "text-zalo-primary"
                            : isNeutral
                            ? "text-orange-600"
                            : "text-gray-700"
                        }`}
                      >
                        {slot.display_time}
                      </div>
                      <div
                        className={`text-xs font-bold px-2 py-1 rounded-lg 
                      ${
                        isActive
                          ? "bg-zalo-primary text-white"
                          : isPast
                          ? "bg-gray-200 text-gray-500"
                          : isNeutral
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      >
                        {isActive
                          ? "🔔 Hiện tại"
                          : isPast
                          ? "Đã qua"
                          : isNeutral
                          ? "Khi cần"
                          : "Sắp tới"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {slot.items.map((med, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-start gap-3 pt-3 border-t border-dashed border-gray-200 first:border-0 first:pt-0"
                        >
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center shrink-0">
                            <Pill
                              size={24}
                              className={
                                isActive
                                  ? "text-zalo-primary"
                                  : isNeutral
                                  ? "text-orange-500"
                                  : "text-gray-400"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4
                                className={`font-bold text-base ${
                                  isActive
                                    ? "text-zalo-primary"
                                    : "text-gray-800"
                                }`}
                              >
                                {med.name}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 mb-2">
                              {med.dosage} • {med.instruction}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDrugClick(med);
                              }}
                              className="bg-blue-50 text-zalo-primary px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 active:scale-95 transition-transform flex items-center gap-1 border border-blue-100 shadow-sm"
                            >
                              <span className="text-lg">💊</span> Thuốc này giúp
                              gì?
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      );

    case "info_list":
      return (
        <div className="px-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Activity size={18} className="text-red-500" />
              {module.title}
            </h3>
            <div className="space-y-3">
              {Array.isArray(module.data) &&
                module.data.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span
                      className={`text-sm font-bold ${
                        item.status === "warning"
                          ? "text-red-600"
                          : "text-gray-800"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );

    case "text_block":
      return (
        <div className="px-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Stethoscope size={18} className="text-green-600" />
              {module.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {module.data}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ModuleRenderer;
