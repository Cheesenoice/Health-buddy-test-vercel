import React from "react";

const SummaryCard = ({ summaryCard }) => {
  if (!summaryCard) return null;

  const getThemeColor = (theme) => {
    switch (theme) {
      case "red":
        return "from-red-600 to-red-400";
      case "green":
        return "from-green-600 to-green-400";
      default:
        return "from-blue-600 to-blue-400";
    }
  };

  return (
    <div
      className={`bg-gradient-to-r ${getThemeColor(
        summaryCard.theme
      )} text-white p-6 rounded-b-3xl shadow-lg mb-6`}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold">{summaryCard.title}</h2>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
          {summaryCard.subtitle}
        </span>
      </div>
      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md text-sm leading-relaxed border border-white/10 mt-4">
        <p>💡 {summaryCard.description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
