import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import React from "react";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import MonthCalendar from "./MonthCalendar";

const getDaysInMonth = (
  month: number,
  year: number
): {
  date: Dayjs;
  day: number;
  full: string;
  isCurrentMonth: boolean;
}[] => {
  const daysInMonth = dayjs(`${year}-${month + 1}`).daysInMonth();
  const firstDayOfMonth = dayjs(`${year}-${month + 1}-01`);
  const lastDayOfMonth = dayjs(`${year}-${month + 1}-${daysInMonth}`);

  const dateArray: {
    date: Dayjs;
    day: number;
    full: string;
    isCurrentMonth: boolean;
  }[] = [];

  // Add days from the previous month
  const daysFromPrevMonth = firstDayOfMonth.day(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = firstDayOfMonth.subtract(i + 1, "day");
    dateArray.push({
      date,
      day: date.date(),
      full: date.format("DD-MM-YYYY"),
      isCurrentMonth: false,
    });
  }

  // Add days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = dayjs(`${year}-${month + 1}-${day}`);
    dateArray.push({
      date,
      day: date.date(),
      full: date.format("DD-MM-YYYY"),
      isCurrentMonth: true,
    });
  }

  // Add days from the next month
  const daysToAdd = 42 - dateArray.length;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = lastDayOfMonth.add(i, "day");
    dateArray.push({
      date,
      day: date.date(),
      full: date.format("DD-MM-YYYY"),
      isCurrentMonth: false,
    });
  }

  return dateArray;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(dayjs());

  const onSetMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(currentDate.subtract(1, 'month'));
    } else {
      setCurrentDate(currentDate.add(1, 'month'));
    }
  }

  const currentMonth = React.useMemo(() => {
    return {
      name: currentDate.format('MMMM'),
      days: getDaysInMonth(currentDate.month(), currentDate.year()),
    };
  }, [currentDate]);

  const nextMonth = React.useMemo(() => {
    const nextMonthDate = currentDate.add(1, "month");

    return {
      name: nextMonthDate.format('MMMM'),
      days: getDaysInMonth(nextMonthDate.month(), nextMonthDate.year()),
    };
  }, [currentDate]);

  console.log(currentMonth, nextMonth);

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-8">
        { currentDate.format('YYYY') }
      </h2>
      <div className="relative grid grid-cols-1 gap-x-14 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onSetMonth('prev')}
          className="absolute -top-1 -left-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onSetMonth('next')}
          className="absolute -top-1 -right-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="size-5" aria-hidden="true" />
        </button>
        <MonthCalendar name={currentMonth.name} days={currentMonth.days} />
        <MonthCalendar name={nextMonth.name} days={nextMonth.days} />
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
