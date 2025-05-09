import dayjs, { Dayjs } from "dayjs";

const getCalendarDaysInMonth = (
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

export default getCalendarDaysInMonth;