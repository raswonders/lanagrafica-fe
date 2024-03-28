import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createDateString(day: string, month: string, year: string) {
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
}

export function isValidISODate(value: string) {
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

export function isAdult(value: string) {
  const today = new Date();
  const birthDate = new Date(value);

  const ageDiff = today.getFullYear() - birthDate.getFullYear();
  if (ageDiff > 18) return true;
  if (ageDiff < 18) return false;

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff > 0) return true;
  if (monthDiff < 0) return false;

  const dayDiff = today.getDate() - birthDate.getDate();
  if (dayDiff > 0) return true;
  if (dayDiff <= 0) return false;
}
