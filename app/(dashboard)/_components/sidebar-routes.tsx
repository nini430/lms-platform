'use client';

import { Layout, Compass } from 'lucide-react';

import SidebarItem from './sidebar-item';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
];
const SidebarRoutes = () => {
  const routes = guestRoutes;
  return (
    <div className="flex flex-col w-full py-4">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
