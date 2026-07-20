import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Eye, EyeOff, Loader2, ArrowRight, Layers, Shield,
  Briefcase, MessageSquare, LayoutDashboard,
} from 'lucide-react';
import toast from 'react-hot-toast';

const BRAND_FEATURES = [
  { icon: LayoutDashboard, text: 'Dashboard overview & analytics' },
  { icon: Briefcase, text: 'Manage job applications' },
  { icon: MessageSquare, text: 'Review contact messages' },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      {/* Brand panel — desktop */}
      <aside className="login-brand">
        <div className="login-brand-inner">
          <div className="login-brand-logo">
            <div className="login-brand-logo-icon">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="login-brand-logo-text">Aaravix</p>
              <p className="login-brand-logo-tag">Admin Portal</p>
            </div>
          </div>

          <h1 className="login-brand-headline">
            Manage your platform with confidence
          </h1>
          <p className="login-brand-desc">
            A secure admin workspace for applications, messages, and team operations — all in one place.
          </p>
        </div>

        <ul className="login-brand-features">
          {BRAND_FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="login-brand-feature">
              <span className="login-brand-feature-icon">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Sign-in panel */}
      <main className="login-main">
        <div className="login-form-shell animate-in">
          <div className="login-mobile-brand">
            <div className="login-mobile-brand-icon">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[var(--text-primary)]">Aaravix</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Admin Portal
              </p>
            </div>
          </div>

          <header className="login-form-header">
            <h2 className="login-form-title">Sign in</h2>
            <p className="login-form-subtitle">
              Enter your credentials to access the admin dashboard.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-field-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="input-field pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="login-footer">
            <Shield className="h-3.5 w-3.5" />
            Secured admin access · Aaravix
          </p>
        </div>
      </main>
    </div>
  );
}
