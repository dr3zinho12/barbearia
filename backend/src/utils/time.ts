// Helpers para manipulação de horários no formato "HH:mm" e datas
// no formato "YYYY-MM-DD", evitando problemas de fuso horário do objeto Date.

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);
  return startAMin < endBMin && startBMin < endAMin;
}

// Retorna o dia da semana (0=domingo .. 6=sábado) de uma string "YYYY-MM-DD"
// sem sofrer deslocamento de fuso horário.
export function dayOfWeekFromDateString(dateString: string): number {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function dateStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function dateToDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(dateStringToDate(value).getTime());
}

export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export function combineDateAndTime(dateString: string, time: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}

// Data de hoje no fuso horário local do servidor, no formato "YYYY-MM-DD".
export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function nowMinutesOfDay(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function addDaysToDateString(dateString: string, days: number): string {
  const date = dateStringToDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToDateString(date);
}
