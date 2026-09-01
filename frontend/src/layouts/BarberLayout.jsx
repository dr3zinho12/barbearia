import { HomeIcon, UserIcon } from '../components/icons';
import { SidebarShell } from '../components/SidebarShell';

const NAV_ITEMS = [
  { to: '/barbeiro', label: 'Minha agenda', icon: <HomeIcon />, end: true },
  { to: '/barbeiro/perfil', label: 'Meu perfil', icon: <UserIcon /> },
];

export function BarberLayout() {
  return <SidebarShell title="Área do Barbeiro" navItems={NAV_ITEMS} />;
}
