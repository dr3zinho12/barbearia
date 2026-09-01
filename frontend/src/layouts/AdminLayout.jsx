import { BuildingIcon, CalendarIcon, ChartIcon, ScissorsIcon, SettingsIcon, TagIcon, UserIcon, UsersIcon } from '../components/icons';
import { SidebarShell } from '../components/SidebarShell';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <ChartIcon />, end: true },
  { to: '/admin/clientes', label: 'Clientes', icon: <UsersIcon /> },
  { to: '/admin/barbeiros', label: 'Barbeiros', icon: <ScissorsIcon /> },
  { to: '/admin/servicos', label: 'Serviços', icon: <TagIcon /> },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: <CalendarIcon /> },
  { to: '/admin/planos', label: 'Planos', icon: <TagIcon /> },
  { to: '/admin/horarios', label: 'Horários', icon: <BuildingIcon /> },
  { to: '/admin/administradores', label: 'Administradores', icon: <UserIcon /> },
  { to: '/admin/configuracoes', label: 'Configurações', icon: <SettingsIcon /> },
];

export function AdminLayout() {
  return <SidebarShell title="Painel Administrativo" navItems={NAV_ITEMS} />;
}
