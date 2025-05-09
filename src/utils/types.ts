import { Dayjs } from "dayjs";

export type Date = {
  date: Dayjs;
  day: number;
  full: string;
};

export type Truck = {
  level: string;
  image: string;
  license: string;
  price_per_day: number;
  id: number;
};