import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle2,
  Circle,
} from "lucide-react";
import clsx from "clsx";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  // Track completed (ticked) medication item ids
  const [completedItems, setCompletedItems] = useState(new Set());

  // Generate 7 days for the week (Monday -> Sunday) that contains selectedDate
  useEffect(() => {
    const days = [];
    const selected = new Date(selectedDate);
    const day = selected.getDay(); // 0 (Sun) ... 6 (Sat)
    // compute offset to Monday: if Sunday (0) go back 6 days, else 1 - day
    const offsetToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(selected);
    monday.setDate(selected.getDate() + offsetToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    setWeekDays(days);
  }, [selectedDate]);

  const formatDate = (date) => {
    const day = date.getDay() + 1;
    const dayStr = day === 1 ? "CN" : `Thứ ${day}`;
    return `${dayStr}, ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const getDayLabel = (date) => {
    const day = date.getDay();
    if (day === 0) return "CN";
    return `T${day + 1}`;
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Mock Data: This structure is designed to be populated from the JSON output of Gemini
  const scheduleData = [
    {
      type: "session",
      sessionTitle: "Sáng",
      time: "07:30",
      status: "done", // 'done' or 'pending'
      items: [
        {
          id: 1,
          name: "YESOM 40 40mg (Esomeprazol)",
          dosage: "1 viên",
          instruction: "Dùng sau ăn",
        },
        {
          id: 2,
          name: "Thuốc dạ dày Ebysta Merap",
          dosage: "1 gói",
          instruction: "Uống trực tiếp",
        },
      ],
    },
    {
      type: "appointment",
      time: "09:00",
      title: "Tái khám Hô hấp",
      location: "BV Đại học Y - Phòng 204",
      doctor: "BS. Nguyễn Văn A",
    },
    {
      type: "session",
      sessionTitle: "Trưa",
      time: "12:30",
      status: "pending",
      items: [
        {
          id: 3,
          name: "Thuốc dạ dày Ebysta Merap",
          dosage: "1 gói",
          instruction: "Uống trực tiếp",
        },
        {
          id: 4,
          name: "Vitamin C 500mg",
          dosage: "1 viên",
          instruction: "Uống sau ăn",
        },
      ],
    },
    {
      type: "session",
      sessionTitle: "Tối",
      time: "19:00",
      status: "pending",
      items: [
        {
          id: 5,
          name: "YESOM 40 40mg",
          dosage: "1 viên",
          instruction: "Dùng sau ăn",
        },
      ],
    },
  ];

  // Initialize completedItems from scheduleData (session-level or item-level flags)
  useEffect(() => {
    const ids = new Set();
    scheduleData.forEach((slot) => {
      if (slot.type === "session" && Array.isArray(slot.items)) {
        if (slot.status === "done") {
          slot.items.forEach((it) => ids.add(it.id));
        } else {
          // support item.done if present in data
          slot.items.forEach((it) => {
            if (it.done) ids.add(it.id);
          });
        }
      }
    });
    setCompletedItems(ids);
  }, []); // run once on mount

  // toggle a single medication item
  const toggleItem = (id) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-24 flex flex-col">
      {/* Header Date Navigation */}
      <div className="bg-blue-600 text-white pt-4 pb-2 px-4 sticky top-0 z-10 shadow-md rounded-b-3xl">
        {/* Date Selector */}
        <div className="flex items-center justify-between bg-white/10 rounded-xl p-2 mb-4 backdrop-blur-sm">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7); // move one week back
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-sm">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7); // move one week forward
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekly Strip */}
        <div className="flex justify-between items-center mb-2 px-1">
          {weekDays.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  "flex flex-col items-center justify-center w-10 h-14 rounded-xl transition-all duration-200",
                  isSelected
                    ? "bg-white text-blue-600 shadow-lg scale-110 -translate-y-1"
                    : "text-blue-100 hover:bg-white/10"
                )}
              >
                <span className="text-[10px] font-medium mb-1 opacity-80">
                  {getDayLabel(date)}
                </span>
                <span
                  className={clsx(
                    "text-sm font-bold",
                    isSelected ? "text-base" : ""
                  )}
                >
                  {date.getDate()}
                </span>
                {isSelected && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Content */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto -mt-2">
        {scheduleData.map((slot, idx) => {
          // Render Appointment Card
          if (slot.type === "appointment") {
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-400 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  LỊCH KHÁM
                </div>
                <div className="flex items-start gap-3 mt-1">
                  <div className="bg-orange-50 p-3 rounded-full text-orange-500 shrink-0">
                    <CalendarIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-gray-800 text-lg">
                        {slot.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {slot.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin size={14} className="mr-1 shrink-0" />
                      <span className="truncate">{slot.location}</span>
                    </div>
                    <div className="text-gray-500 text-sm mt-1 pl-4.5 border-l-2 border-gray-100 ml-0.5">
                      {slot.doctor}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Render Medication Session Card
          const isDone = slot.status === "done";
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              {/* Session Header */}
              <div
                className={clsx(
                  "px-4 py-3 flex justify-between items-center",
                  isDone ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">{slot.time}</span>
                  <span className="opacity-90 text-sm font-medium">
                    • {slot.sessionTitle}
                  </span>
                </div>
                <div
                  className={clsx(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide",
                    isDone ? "bg-white/20 text-white" : "bg-white text-blue-600"
                  )}
                >
                  {isDone ? "Đã dùng" : "Chưa dùng"}
                </div>
              </div>

              {/* Med Items */}
              <div className="p-2 bg-white">
                {slot.items.map((item, i) => {
                  const itemDone = isDone || completedItems.has(item.id);
                  return (
                    <div
                      key={i}
                      className={clsx(
                        "flex items-start gap-3 p-3 rounded-xl mb-1 last:mb-0 transition-colors",
                        itemDone ? "opacity-60" : "bg-gray-50"
                      )}
                    >
                      <div className="mt-1 shrink-0">
                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                          <span className="font-medium text-gray-600">
                            {item.dosage}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{item.instruction}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleItem(item.id)}
                        aria-pressed={itemDone}
                        className="text-gray-300 hover:text-blue-500 transition-colors shrink-0"
                      >
                        {itemDone ? (
                          <CheckCircle2 size={24} className="text-green-500" />
                        ) : (
                          <Circle size={24} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {scheduleData.length === 0 && (
          <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
            <CalendarIcon size={48} className="text-gray-200 mb-2" />
            <p>Không có lịch nào cho ngày này</p>
          </div>
        )}
      </div>

      {/* Placeholder for the new feature */}
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-2">Lịch hẹn</h1>
        <p className="text-sm text-gray-600">
          Quản lý lịch hẹn và nhắc nhở ở đây. Tính năng sẽ được hoàn thiện.
        </p>
        {/* ...calendar component / events list... */}
      </div>
    </div>
  );
};

export default CalendarPage;
