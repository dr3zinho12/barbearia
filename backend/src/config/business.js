// Identidade e regras de negócio da barbearia.
// Para renomear o sistema, altere apenas este arquivo (back-end) e
// frontend/src/config/brand.js (front-end).
export const business = {
  name: 'Royal Cut',
  shortName: 'RC',
  email: 'contato@royalcut.com',

  // Tamanho do intervalo (em minutos) usado para gerar horários candidatos
  // dentro do expediente ao calcular disponibilidade de agendamento.
  slotStepMinutes: 30,

  // Antecedência mínima, em horas, para cancelar ou remarcar um agendamento.
  minCancellationNoticeHours: 2,

  // Quantos dias no futuro o cliente pode consultar/agendar horários.
  maxBookingHorizonDays: 60,
};
