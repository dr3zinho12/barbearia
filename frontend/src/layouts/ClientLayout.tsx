import { CalendarIcon, ClockIcon, HistoryIcon, HomeIcon, TagIcon, UserIcon } from '../components/icons';
import { SidebarShell } from '../components/SidebarShell';

const NAV_ITEMS = [
  { to: '/cliente', label: 'Início', icon: <HomeIcon />, end: true },
  { to: '/cliente/agendamento', label: 'Agendar horário', icon: <CalendarIcon /> },
  { to: '/cliente/agendamentos', label: 'Meus agendamentos', icon: <ClockIcon /> },
  { to: '/cliente/historico', label: 'Histórico', icon: <HistoryIcon /> },
  { to: '/cliente/planos', label: 'Planos', icon: <TagIcon /> },
  { to: '/cliente/perfil', label: 'Meu perfil', icon: <UserIcon /> },
];

export function ClientLayout() {
  return <SidebarShell title="Área do Cliente" navItems={NAV_ITEMS} />;
}
