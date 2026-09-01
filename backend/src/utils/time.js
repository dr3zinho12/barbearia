// Helpers para manipulação de horários no formato "HH:mm" e datas
// no formato "YYYY-MM-DD", evitando problemas de fuso horário do objeto Date.

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function rangesOverlap(startA, endA, startB, endB) {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);
  return startAMin < endBMin && startBMin < endAMin;
}

// Retorna o dia da semana (0=domingo .. 6=sábado) de uma string "YYYY-MM-DD"
// sem sofrer deslocamento de fuso horário.
export function dayOfWeekFromDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function dateStringToDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function dateToDateString(date) {
  return date.toISOString().slice(0, 10);
}

// Data de hoje no fuso horário local do servidor, no formato "YYYY-MM-DD".
export function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function nowMinutesOfDay() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function addDaysToDateString(dateString, days) {
  const date = dateStringToDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToDateString(date);
}
