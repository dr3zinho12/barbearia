import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { UsersIcon } from '../../components/icons';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/admin.service';
import { PaginatedResult, User } from '../../types';
import { formatPhone } from '../../utils/format';

export default function AdminClientes() {
  useDocumentTitle('Clientes');
  const [result, setResult] = useState<PaginatedResult<User> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      adminService
        .listClients({ search: search || undefined, page, pageSize: 10 })
        .then(setResult)
        .catch(() => setResult({ data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 } }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Clientes</h1>
      <p className="mt-1 text-sm text-slate-400">Gerencie os clientes cadastrados na barbearia.</p>

      <div className="mt-6 max-w-sm">
        <input
          className="input"
          placeholder="Buscar por nome, e-mail ou telefone"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {result === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {result && result.data.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<UsersIcon className="h-10 w-10" />} title="Nenhum cliente encontrado" />
        </div>
      )}

      {result && result.data.length > 0 && (
        <>
          <div className="table-shell mt-6">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{formatPhone(client.phone)}</td>
                    <td>
                      <span className={client.active ? 'text-emerald-400' : 'text-slate-500'}>
                        {client.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/clientes/${client.id}`} className="font-medium text-brand-blue-400 hover:underline">
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              Página {result.meta.page} de {Math.max(result.meta.totalPages, 1)} · {result.meta.total} cliente(s)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={page >= result.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
