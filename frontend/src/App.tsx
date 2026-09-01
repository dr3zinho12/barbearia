import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ClientLayout } from './layouts/ClientLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { BarberLayout } from './layouts/BarberLayout';
import { PublicLayout } from './layouts/PublicLayout';
import AdminAdministradores from './pages/admin/AdminAdministradores';
import AdminAgendamentos from './pages/admin/AdminAgendamentos';
import AdminBarbeiros from './pages/admin/AdminBarbeiros';
import AdminClienteDetalhe from './pages/admin/AdminClienteDetalhe';
import AdminClientes from './pages/admin/AdminClientes';
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHorarios from './pages/admin/AdminHorarios';
import AdminPlanos from './pages/admin/AdminPlanos';
import AdminServicos from './pages/admin/AdminServicos';
import BarberDashboard from './pages/barber/BarberDashboard';
import BarberPerfil from './pages/barber/BarberPerfil';
import ClientDashboard from './pages/client/ClientDashboard';
import Historico from './pages/client/Historico';
import MeusAgendamentos from './pages/client/MeusAgendamentos';
import NovoAgendamento from './pages/client/NovoAgendamento';
import PerfilCliente from './pages/client/PerfilCliente';
import PlanosCliente from './pages/client/PlanosCliente';
import Barbeiros from './pages/public/Barbeiros';
import Cadastro from './pages/public/Cadastro';
import EsqueciSenha from './pages/public/EsqueciSenha';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';
import Planos from './pages/public/Planos';
import RedefinirSenha from './pages/public/RedefinirSenha';
import Servicos from './pages/public/Servicos';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="servicos" element={<Servicos />} />
        <Route path="planos" element={<Planos />} />
        <Route path="barbeiros" element={<Barbeiros />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="esqueci-senha" element={<EsqueciSenha />} />
        <Route path="redefinir-senha" element={<RedefinirSenha />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
        <Route path="cliente" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="agendamento" element={<NovoAgendamento />} />
          <Route path="agendamentos" element={<MeusAgendamentos />} />
          <Route path="historico" element={<Historico />} />
          <Route path="planos" element={<PlanosCliente />} />
          <Route path="perfil" element={<PerfilCliente />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['BARBER']} />}>
        <Route path="barbeiro" element={<BarberLayout />}>
          <Route index element={<BarberDashboard />} />
          <Route path="perfil" element={<BarberPerfil />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClientes />} />
          <Route path="clientes/:id" element={<AdminClienteDetalhe />} />
          <Route path="barbeiros" element={<AdminBarbeiros />} />
          <Route path="servicos" element={<AdminServicos />} />
          <Route path="agendamentos" element={<AdminAgendamentos />} />
          <Route path="planos" element={<AdminPlanos />} />
          <Route path="horarios" element={<AdminHorarios />} />
          <Route path="administradores" element={<AdminAdministradores />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
