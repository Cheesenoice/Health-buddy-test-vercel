import React from "react";
import { Pill, Clock, Activity, Stethoscope } from "lucide-react";

const ModuleRenderer = ({ module, onDrugClick }) => {
  switch (module.type) {
    case "medication_scroll":
      return (
        <div className="px-4 mb-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Pill size={18} className="text-zalo-primary" /> {module.title}
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
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
