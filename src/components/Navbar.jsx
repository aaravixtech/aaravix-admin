import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, ChevronDown, LogOut, User, Settings, ShieldCheck,
  ChevronRight, LayoutDashboard, Briefcase, MessageSquare,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ICON_MAP = {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
};

export default function Navbar({ onMenuToggle, meta }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const Icon = ICON_MAP[meta?.icon] || LayoutDashboard;
  const crumbs = meta?.crumbs ?? [{ label: meta?.title || 'Dashboard' }];

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="navbar sticky top-0 z-30 h-[var(--navbar-h)] shrink-0 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        {/* ── Head: breadcrumbs, title, subtitle ── */}
        <div className="navbar-head flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="navbar-menu-toggle"
            aria-label="Open menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          <div className="navbar-head-divider" aria-hidden="true" />

          <div className="flex min-w-0 items-center gap-3.5">
            <div className="navbar-head-icon  hidden shrink-0 sm:flex">
              <Icon className="h-[18px] w-[18px] text-[var(--accent)]" strokeWidth={2.25} />
            </div>

            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="navbar-breadcrumb mb-0.5 hidden sm:flex">
                <ol className="flex min-w-0 items-center gap-1">
                  <li className="shrink-0">
                    <Link
                      to="/"
                      className="text-[11px] font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                    >
                      Home
                    </Link>
                  </li>
                  {crumbs.map((crumb, i) => (
                    <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
                      <ChevronRight className="h-3 w-3 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                      {crumb.path && i < crumbs.length - 1 ? (
                        <Link
                          to={crumb.path}
                          className="truncate text-[11px] font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className="truncate text-[11px] font-semibold text-[var(--text-tertiary)]"
                          aria-current="page"
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="flex min-w-0 items-center gap-2">
                <div className="navbar-head-icon flex shrink-0 sm:hidden">
                  <Icon className="h-4 w-4 text-[var(--accent)]" strokeWidth={2.25} />
                </div>
                <h1 className="truncate text-[15px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-base lg:text-[17px]">
                  {meta?.title || 'Dashboard'}
                </h1>
              </div>

              {meta?.subtitle && (
                <p className="navbar-head-subtitle mt-0.5 hidden truncate text-[12px] leading-snug text-[var(--text-tertiary)] lg:block">
                  {meta.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button type="button" className="btn-icon relative" aria-label="Notifications">
            <Bell className="h-[17px] w-[17px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)] ring-2 ring-white" />
          </button>

          <div className="mx-0.5 hidden h-7 w-px bg-[var(--border)] sm:block" />

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="navbar-profile-btn flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] py-1 pl-1 pr-2.5 transition-colors hover:border-[var(--border)] hover:bg-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[11px] font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left md:block">
                <p className="max-w-[100px] truncate text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Admin</p>
              </div>
              <ChevronDown
                className={`hidden h-4 w-4 text-[var(--text-muted)] transition-transform md:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-white"
                style={{ boxShadow: 'var(--shadow-modal)' }}
              >
                <div className="border-b border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
                  <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                    {user?.username || 'Admin User'}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-tertiary)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
                    System Administrator
                  </p>
                </div>

                <div className="p-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                  >
                    <User className="h-4 w-4 text-[var(--text-muted)]" />
                    Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                  >
                    <Settings className="h-4 w-4 text-[var(--text-muted)]" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-[var(--border)] p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
