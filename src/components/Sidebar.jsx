import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Briefcase, MessageSquare, LogOut, X,
  ChevronLeft, ChevronRight, Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/applications', label: 'Applications', icon: Briefcase },
  { path: '/contacts', label: 'Messages', icon: MessageSquare },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-full flex-col
          border-r border-[var(--border)] bg-white
          transition-[width,transform] duration-200 ease-out
          lg:static lg:z-auto lg:translate-x-0
          ${collapsed ? 'lg:w-[var(--sidebar-w-collapsed)]' : 'lg:w-[var(--sidebar-w)]'}
          w-[var(--sidebar-w)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div
          className={`
            flex h-[var(--navbar-h)] shrink-0 items-center border-b border-[var(--border)] px-4
            ${collapsed ? 'lg:justify-center lg:px-0' : 'justify-between'}
          `}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]">
              <Layers className="h-[18px] w-[18px] text-white" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)] select-none">
                Aaravix
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Menu
            </p>
          )}

          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `nav-link ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${isActive ? 'active' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !collapsed && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
                        aria-hidden="true"
                      />
                    )}
                    <item.icon
                      className={`nav-link-icon h-[18px] w-[18px] shrink-0 ${
                        isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--border)]">
          {!collapsed ? (
            <div className="p-3">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                    {user?.username || 'Admin User'}
                  </p>
                  <p className="text-[11px] font-medium text-[var(--text-muted)]">Administrator</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          )}

          <div className={`px-3 pb-3 ${collapsed ? 'lg:px-2' : ''}`}>
            <button
              type="button"
              onClick={handleLogout}
              title={collapsed ? 'Sign Out' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-[13px] font-semibold text-[var(--text-tertiary)] transition-colors hover:bg-red-50 hover:text-red-600 ${
                collapsed ? 'lg:justify-center lg:px-0' : 'px-3'
              }`}
            >
              <LogOut className="h-[17px] w-[17px] shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          <div className="hidden border-t border-[var(--border)] lg:flex lg:items-center lg:justify-center lg:py-3">
            <button
              type="button"
              onClick={onToggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
