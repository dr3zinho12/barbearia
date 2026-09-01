import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../../components/EmptyState';
import { CalendarIcon } from '../../components/icons';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/admin.service';
import { extractErrorMessage } from '../../services/api';
import { appointmentsService } from '../../services/appointments.service';
import { barbersService } from '../../services/barbers.service';
import { servicesService } from '../../services/services.service';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'];

export default function AdminAgendamentos() {
  useDocumentTitle('Agendamentos');
  const [result, setResult] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);

  const [date, setDate] = useState('');
  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    barbersService.list().then(setBarbers).catch(() => setBarbers([]));
    servicesService.list().then(setServices).catch(() => setServices([]));
    adminService
      .listClients({ pageSize: 100 })
      .then((res) => setClients(res.data))
      .catch(() => setClients([]));
  }, []);

  function loadAppointments() {
    appointmentsService
      .listAll({
        date: date || undefined,
        barberId: barberId || undefined,
        serviceId: serviceId || undefined,
        clientId: clientId || undefined,
        status: status || undefined,
        page,
        pageSize: 15,
      })
      .then(setResult)
      .catch(() => setResult({ data: [], meta: { total: 0, page: 1, pageSize: 15, totalPages: 0 } }));
  }

  useEffect(loadAppointments, [date, barberId, serviceId, clientId, status, page]);

  async function handleStatusChange(appointment, newStatus) {
    try {
      await appointmentsService.updateStatus(appointment.id, newStatus);
      toast.success('Status atualizado com sucesso!');
      loadAppointments();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  function updateFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
      <p className="mt-1 text-sm text-slate-400">Visualize e gerencie todos os agendamentos da barbearia.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input type="date" className="input" value={date} onChange={(e) => updateFilter(setDate)(e.target.value)} />

        <select className="input" value={barberId} onChange={(e) => updateFilter(setBarberId)(e.target.value)}>
          <option value="">Todos os barbeiros</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>{barber.name}</option>
          ))}
        </select>

        <select className="input" value={serviceId} onChange={(e) => updateFilter(setServiceId)(e.target.value)}>
          <option value="">Todos os serviços</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>

        <select className="input" value={clientId} onChange={(e) => updateFilter(setClientId)(e.target.value)}>
          <option value="">Todos os clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        <select className="input" value={status} onChange={(e) => updateFilter(setStatus)(e.target.value)}>
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {result === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {result?.data.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<CalendarIcon className="h-10 w-10" />} title="Nenhum agendamento encontrado" description="Ajuste os filtros para ver outros resultados." />
        </div>
      )}

      {result && result.data.length > 0 && (
        <>
          <div className="table-shell mt-6">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Barbeiro</th>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)} · {appointment.startTime}</td>
                    <td>{appointment.client?.name}</td>
                    <td>{appointment.barber?.name}</td>
                    <td>{appointment.service?.name}</td>
                    <td>{formatCurrency(appointment.service?.price ?? 0)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={appointment.status} />
                        <select
                          className="rounded-lg border border-brand-border bg-brand-night px-2 py-1 text-xs text-slate-300"
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              Página {result.meta.page} de {Math.max(result.meta.totalPages, 1)} · {result.meta.total} agendamento(s)
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Anterior
              </button>
              <button type="button" className="btn-ghost" disabled={page >= result.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
