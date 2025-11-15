import React, { useState } from "react";

interface DateRangeCalendarProps {
  onDateSelect: (startDate: string, endDate: string) => void;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(
    selectedStartDate ? new Date(selectedStartDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    selectedEndDate ? new Date(selectedEndDate) : null
  );
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
      setIsSelectingEnd(true);
    } else if (isSelectingEnd) {
      // Complete selection
      if (date < startDate) {
        // If end date is before start date, swap them
        setEndDate(startDate);
        setStartDate(date);
        onDateSelect(date.toISOString().split('T')[0], startDate.toISOString().split('T')[0]);
      } else {
        setEndDate(date);
        onDateSelect(startDate.toISOString().split('T')[0], date.toISOString().split('T')[0]);
      }
      setIsSelectingEnd(false);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return (
      date.getTime() === startDate.getTime() ||
      date.getTime() === endDate.getTime()
    );
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const renderMonth = (date: Date) => {
    const days = getDaysInMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth();

    return (
      <div className="bg-white rounded-lg p-3 shadow-md">
        <h3 className="text-base font-bold text-gray-800 mb-3 text-center">
          {monthNames[month]} {year}
        </h3>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-center text-xs font-semibold text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="w-8 h-8" />;
            }
            
            const disabled = isDateDisabled(day);
            const selected = isDateSelected(day);
            const inRange = isDateInRange(day);
            const isStart = startDate && day.getTime() === startDate.getTime();
            const isEnd = endDate && day.getTime() === endDate.getTime();
            
            return (
              <button
                key={index}
                onClick={() => !disabled && handleDateClick(day)}
                disabled={disabled}
                className={`w-8 h-8 rounded-full font-semibold transition-all duration-200 text-xs flex items-center justify-center ${
                  disabled
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : selected
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md scale-105"
                    : inRange
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonthDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );

  return (
    <div className="space-y-2">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-all duration-200"
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        <div className="text-center">
          {startDate && endDate && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded border border-blue-200">
              <div className="font-bold text-gray-800 text-sm">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </div>
            </div>
          )}
          {startDate && !endDate && (
            <div className="bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
              <div className="text-[10px] font-semibold text-yellow-700">
                Select your checkout date
              </div>
            </div>
          )}
          {!startDate && (
            <div className="text-gray-500 text-[10px]">
              Select your departure and arrival dates
            </div>
          )}
        </div>
        
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-all duration-200"
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Two months side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {renderMonth(currentMonth)}
        {renderMonth(nextMonthDate)}
      </div>
    </div>
  );
};

export default DateRangeCalendar;

