import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown,
  Briefcase, MessageSquare, Activity, BarChart3, ChevronRight, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5" style={{ boxShadow: 'var(--shadow-md)' }}>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="text-lg font-bold text-[var(--text-primary)]">
        {payload[0].value}
        <span className="ml-1.5 text-[11px] font-medium text-[var(--text-muted)]">registrations</span>
      </p>
    </div>
  );
};

function StatSkeleton() {
  return (
    <div className="stat-card animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-[var(--bg-subtle)]" />
      <div className="space-y-2">
        <div className="h-7 w-14 rounded bg-[var(--bg-subtle)]" />
        <div className="h-3.5 w-24 rounded bg-[var(--bg-subtle)]" />
      </div>
    </div>
  );
}

function PanelHeader({ icon: Icon, iconBg, iconColor, title, subtitle, right }) {
  return (
    <div className="dash-panel-header">
      <div className="dash-panel-header-left">
        <div className={`dash-panel-icon ${iconBg}`}>
          <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="dash-panel-title">{title}</p>
          {subtitle && <p className="dash-panel-subtitle">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

const QUICK_LINKS = [
  {
    label: 'Job Applications',
    desc: 'Review and manage recent applicant submissions',
    icon: Briefcase,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    variant: 'blue',
    path: '/applications',
  },
  {
    label: 'Contact Messages',
    desc: 'View and respond to user inquiries and feedback',
    icon: MessageSquare,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    variant: 'indigo',
    path: '/contacts',
  },
];

const CONVERSION_ROWS = [
  { key: 'accepted', label: 'Accepted', dot: 'bg-emerald-500', valueClass: 'bg-emerald-50 text-emerald-700' },
  { key: 'rejected', label: 'Rejected', dot: 'bg-red-500', valueClass: 'bg-red-50 text-red-700' },
  { key: 'pending', label: 'Pending', dot: 'bg-amber-500', valueClass: 'bg-amber-50 text-amber-700' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getAnalytics(),
      ]);
      setStats(s);
      setAnalytics(a);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { label: 'Accepted', value: stats.accepted_users, icon: UserCheck, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { label: 'Rejected', value: stats.rejected_users, icon: UserX, iconColor: 'text-red-500', iconBg: 'bg-red-50' },
    { label: 'Pending Review', value: stats.pending_users, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
  ] : [];

  const recentDailyRows = analytics?.daily_registrations?.slice(-7).reverse() || [];
  const chartData = analytics?.daily_registrations?.slice(-14).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: d.count,
  })) || [];
  const monthlyData = analytics?.monthly_growth?.map((m) => ({ month: m.month, count: m.count })) || [];

  const growthPositive = analytics ? analytics.growth_percentage >= 0 : true;

  return (
    <div className="page-stack">
      <div className="greeting-banner">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {greeting()}, {user?.username || 'Admin'}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] sm:self-auto">
          <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div className={`icon-box h-11 w-11 ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {card.value ?? '—'}
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--text-tertiary)]">{card.label}</p>
              </div>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.path}
            type="button"
            onClick={() => navigate(link.path)}
            className={`dash-nav-card dash-nav-card--${link.variant}`}
          >
            <div className={`dash-nav-card-icon ${link.iconBg}`}>
              <link.icon className={`h-5 w-5 ${link.iconColor}`} />
            </div>
            <div className="dash-nav-card-body">
              <p className="dash-nav-card-label">{link.label}</p>
              <p className="dash-nav-card-desc">{link.desc}</p>
            </div>
            <span className={`dash-nav-card-action dash-nav-card-action--${link.variant}`}>
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {analytics && (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="chart-card xl:col-span-2">
              <PanelHeader
                icon={Activity}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                title="Activity Trend"
                subtitle="Registrations over the last 14 days"
                right={
                  <span className="dash-panel-badge border border-[var(--accent-border)] bg-[var(--accent-light)] text-[var(--accent)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    Active (7d): {analytics.active_users_7d}
                  </span>
                }
              />
              <div className="chart-card-body">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} width={32} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fill="url(#areaGrad)" activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-conversion-card">
              <PanelHeader
                icon={TrendingUp}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Conversion Rate"
                subtitle="Accepted vs total applicants"
                right={
                  <span
                    className={`dash-panel-badge border ${
                      growthPositive
                        ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                        : 'border-red-100 bg-red-50 text-red-700'
                    }`}
                  >
                    {growthPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {Math.abs(analytics.growth_percentage)}%
                  </span>
                }
              />

              <div className="dash-conversion-body">
                <div className="dash-conversion-metric">
                  <p className="dash-conversion-value">{analytics.conversion_rate}%</p>
                  <p className="dash-conversion-label">Success rate</p>
                  <div className="dash-conversion-bar-wrap mt-4">
                    <div className="dash-conversion-bar">
                      <div
                        className="dash-conversion-bar-fill"
                        style={{ width: `${Math.min(analytics.conversion_rate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="dash-conversion-scale mt-1.5">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="dash-conversion-breakdown">
                  {CONVERSION_ROWS.map((row) => (
                    <div key={row.key} className="dash-conversion-row">
                      <div className="dash-conversion-row-left">
                        <span className={`dash-conversion-row-dot ${row.dot}`} />
                        <span className="dash-conversion-row-label">{row.label}</span>
                      </div>
                      <span className={`dash-conversion-row-value ${row.valueClass}`}>
                        {analytics.accept_reject_ratio[row.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="chart-card">
              <PanelHeader
                icon={BarChart3}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Monthly Growth"
                subtitle="Registrations in the last 6 months"
              />
              <div className="chart-card-body">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} width={32} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.8)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
                      {monthlyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#2563eb' : '#bfdbfe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-activity-card">
              <PanelHeader
                icon={Activity}
                iconBg="bg-slate-100"
                iconColor="text-slate-600"
                title="Recent Activity"
                subtitle="Daily registration summary"
                right={
                  <span className="dash-panel-badge border border-[var(--border)] bg-white text-[var(--text-tertiary)]">
                    Last 7 days
                  </span>
                }
              />

              <div className="dash-activity-table-wrap">
                {recentDailyRows.length === 0 ? (
                  <div className="dash-activity-empty">
                    <Activity className="mb-2 h-8 w-8 opacity-40" />
                    <p>No activity recorded yet</p>
                  </div>
                ) : (
                  <table className="dash-activity-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Count</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDailyRows.map((row) => (
                        <tr key={row.date}>
                          <td className="whitespace-nowrap">
                            {new Date(row.date).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </td>
                          <td className="dash-activity-count">{row.count}</td>
                          <td>
                            <span className={`badge ${row.count > 0 ? 'badge-active' : 'badge-inactive'}`}>
                              <span className={`badge-dot ${row.count > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              {row.count > 0 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
