interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
  maxDate: string;
  /** Dias da semana (0=domingo .. 6=sábado) em que o barbeiro não trabalha. */
  closedWeekdays: number[];
  viewYear: number;
  viewMonth: number;
  onViewChange: (year: number, month: number) => void;
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function monthKey(year: number, month: number): string {
  return `${year}-${pad2(month + 1)}`;
}

export function Calendar({ value, onChange, minDate, maxDate, closedWeekdays, viewYear, viewMonth, onViewChange }: CalendarProps) {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  const monthLabel = firstOfMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const currentMonthKey = monthKey(viewYear, viewMonth);
  const canGoPrev = currentMonthKey > minDate.slice(0, 7);
  const canGoNext = currentMonthKey < maxDate.slice(0, 7);

  function changeMonth(delta: number) {
    let nextMonth = viewMonth + delta;
    let nextYear = viewYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    onViewChange(nextYear, nextMonth);
  }

  return (
    <div className="rounded-xl border border-brand-border bg-brand-night p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mês anterior"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <p className="text-sm font-semibold capitalize text-white">{monthLabel}</p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          disabled={!canGoNext}
          aria-label="Próximo mês"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />;

          const dateStr = toDateString(viewYear, viewMonth, day);
          const dayOfWeek = (startWeekday + day - 1) % 7;
          const isClosedDay = closedWeekdays.includes(dayOfWeek);
          const isOutOfRange = dateStr < minDate || dateStr > maxDate;
          const isSelected = dateStr === value;
          const isDisabled = isClosedDay || isOutOfRange;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(dateStr)}
              title={isClosedDay ? 'O barbeiro não atende neste dia' : undefined}
              className={[
                'aspect-square rounded-lg text-sm font-medium transition',
                isSelected
                  ? 'bg-brand-blue-500 text-white shadow-glow'
                  : isClosedDay
                    ? 'bg-red-500/10 text-red-400 cursor-not-allowed'
                    : isOutOfRange
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-200 hover:border hover:border-brand-blue-500/50 hover:bg-white/5',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-brand-border pt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-500" /> Selecionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" /> Dia sem expediente
        </span>
      </div>
    </div>
  );
}
