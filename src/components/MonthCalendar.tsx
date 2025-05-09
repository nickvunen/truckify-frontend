import React from "react";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  name: string;
  days: {
    date: Dayjs;
    day: number;
    full: string;
    isCurrentMonth: boolean;
  }[];
};

const TODAY = dayjs().format('DD-MM-YYYY');
const MonthCalendar: React.FC<Props> = ({ name, days }) => {
  return (
    <section className="text-center">
      <h2 className="text-sm font-semibold text-gray-900">{name}</h2>
      <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200">
        {days.map((day, dayIdx) => (
          <button
            key={day.full}
            type="button"
            className={classNames(
              dayIdx === 0 && "rounded-tl-lg",
              dayIdx === 6 && "rounded-tr-lg",
              dayIdx === days.length - 7 && "rounded-bl-lg",
              dayIdx === days.length - 1 && "rounded-br-lg",
              day.isCurrentMonth && "bg-white hover:bg-gray-50 text-black cursor-pointer",
              !day.isCurrentMonth && "bg-gray-50 text-gray-400 hover:bg-gray-100",
              "relative py-1.5 focus:z-10"
            )}
          >
            <time
              dateTime={day.full}
              className={classNames(
                day.full === TODAY && 'bg-indigo-600 font-semibold text-white',
                'mx-auto flex size-7 items-center justify-center rounded-full',
              )}
            >
              {day.day}
            </time>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MonthCalendar;
