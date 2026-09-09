export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const WEEKDAY_BY_JS_INDEX: Weekday[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

const WEEKDAY_SHORT_UK: Record<Weekday, string> = {
  mon: "пн",
  tue: "вт",
  wed: "ср",
  thu: "чт",
  fri: "пт",
  sat: "сб",
  sun: "нд",
};

export const getWeekdayFromDate = (dateIso: string): Weekday => {
  return WEEKDAY_BY_JS_INDEX[
    new Date(`${dateIso}T00:00:00.000Z`).getUTCDay()
  ];
};

export const getWeekdayShortUk = (dateIso: string): string => {
  return WEEKDAY_SHORT_UK[getWeekdayFromDate(dateIso)];
};

export const formatDateShortUk = (dateIso: string): string => {
  const [, month, day] = dateIso.split("-");
  return `${getWeekdayShortUk(dateIso)}, ${day}.${month}`;
};

export const getNextDaysIso = (count: number): string[] => {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i
    );
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    days.push(`${date.getFullYear()}-${month}-${day}`);
  }
  return days;
};

export const getTodayIso = (): string => {
  return getNextDaysIso(1)[0];
};
