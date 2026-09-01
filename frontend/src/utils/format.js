export function formatCurrency(value) {
  const numeric = typeof value === 'string' ? Number(value) : value;
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function dashboardPathForRole(role) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'BARBER') return '/barbeiro';
  return '/cliente';
}

export function formatDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateLong(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h${rest}min`;
}

const WEEKDAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function weekdayLabel(dayOfWeek) {
  return WEEKDAY_LABELS[dayOfWeek] ?? '';
}

const STATUS_LABELS = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELED: 'Cancelado',
  NO_SHOW: 'Não compareceu',
  ACTIVE: 'Ativa',
  EXPIRED: 'Expirada',
};

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}
