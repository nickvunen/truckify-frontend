import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import MonthCalendar from "./MonthCalendar";
import getCalendarDaysInMonth from "../utils/getCalendayDaysInMonth";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(dayjs());

  const [selectedStartDate, setSelectedStartDate] =
    React.useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Dayjs | null>(
    null
  );

  const onSelectDate = (date: Dayjs) => {
    if (
      selectedStartDate
    ) {
      if (selectedStartDate.format("DD-MM-YYYY") === date.format("DD-MM-YYYY")) {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
      } else if (selectedEndDate && selectedEndDate.format("DD-MM-YYYY") === date.format("DD-MM-YYYY")) {
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
      }
    } else {
      setSelectedStartDate(date);
    }
  };

  const selectedRange = React.useMemo(() => {
    if (!selectedStartDate) return [];
    const endDate = selectedEndDate || selectedStartDate;

    const days: Dayjs[] = [];
    const diff = endDate.diff(selectedStartDate, "day");

    for (let i = 0; i <= diff; i++) {
      days.push(selectedStartDate.add(i, "day"));
    }

    return days.map((date) => ({
      date,
      day: date.date(),
      full: date.format("DD-MM-YYYY")
    }));
  }, [selectedStartDate, selectedEndDate]);

  const onSetMonth = (direction: "prev" | "next") => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);

    if (direction === "prev") {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else {
      setCurrentDate(currentDate.add(1, "month"));
    }
  };

  const currentMonth = React.useMemo(() => {
    return {
      name: currentDate.format("MMMM"),
      days: getCalendarDaysInMonth(currentDate.month(), currentDate.year()),
    };
  }, [currentDate]);

  const nextMonth = React.useMemo(() => {
    const nextMonthDate = currentDate.add(1, "month");

    return {
      name: nextMonthDate.format("MMMM"),
      days: getCalendarDaysInMonth(nextMonthDate.month(), nextMonthDate.year()),
    };
  }, [currentDate]);

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-8">
        {currentDate.format("YYYY")}
      </h2>
      <div className="relative grid grid-cols-1 gap-x-14 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onSetMonth("prev")}
          className="absolute -top-1 -left-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onSetMonth("next")}
          className="absolute -top-1 -right-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="size-5" aria-hidden="true" />
        </button>
        <MonthCalendar
          name={currentMonth.name}
          days={currentMonth.days}
          selectedRange={selectedRange}
          onSelectDate={onSelectDate}
        />
        <MonthCalendar
          name={nextMonth.name}
          days={nextMonth.days}
          selectedRange={selectedRange}
          onSelectDate={onSelectDate}
        />
      </div>
      {/* <section className="mt-12">
        <h2 className="text-base font-semibold text-gray-900">Upcoming events</h2>
        <ol className="mt-2 divide-y divide-gray-200 text-sm/6 text-gray-500">
          <li className="py-4 sm:flex">
            <time dateTime="2022-01-17" className="w-28 flex-none">
              Wed, Jan 12
            </time>
            <p className="mt-2 flex-auto sm:mt-0">Nothing on today’s schedule</p>
          </li>
          <li className="py-4 sm:flex">
            <time dateTime="2022-01-19" className="w-28 flex-none">
              Thu, Jan 13
            </time>
            <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">View house with real estate agent</p>
            <p className="flex-none sm:ml-6">
              <time dateTime="2022-01-13T14:30">2:30 PM</time> - <time dateTime="2022-01-13T16:30">4:30 PM</time>
            </p>
          </li>
          <li className="py-4 sm:flex">
            <time dateTime="2022-01-20" className="w-28 flex-none">
              Fri, Jan 14
            </time>
            <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">Meeting with bank manager</p>
            <p className="flex-none sm:ml-6">All day</p>
          </li>
          <li className="py-4 sm:flex">
            <time dateTime="2022-01-18" className="w-28 flex-none">
              Mon, Jan 17
            </time>
            <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">Sign paperwork at lawyers</p>
            <p className="flex-none sm:ml-6">
              <time dateTime="2022-01-17T10:00">10:00 AM</time> - <time dateTime="2022-01-17T10:15">10:15 AM</time>
            </p>
          </li>
        </ol>
      </section> */}
    </div>
  );
};

export default Calendar;
