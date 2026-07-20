/**
 * Dashboard Layout — Professional SaaS Shell
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PAGE_META = {
  '/': {
    title: 'Dashboard Overview',
    subtitle: 'Monitor platform activity and key metrics',
    icon: 'LayoutDashboard',
    crumbs: [{ label: 'Overview' }],
  },
  '/applications': {
    title: 'Job Applications',
    subtitle: 'Review and manage applicant submissions',
    icon: 'Briefcase',
    crumbs: [{ label: 'Applications' }],
  },
  '/contacts': {
    title: 'Contact Messages',
    subtitle: 'View and respond to user inquiries',
    icon: 'MessageSquare',
    crumbs: [{ label: 'Messages' }],
  },
};

const DEFAULT_META = PAGE_META['/'];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || DEFAULT_META;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          meta={meta}
        />

        <main className="main-content">
          <div key={location.pathname} className="main-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
