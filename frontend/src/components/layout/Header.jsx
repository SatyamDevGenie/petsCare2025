import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const THEMES = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'classic', label: 'Classic', icon: '📜' },
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, doctor, role, token } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const name = user?.name ?? doctor?.name ?? '';

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/pets', label: 'Pets' },
  ];

  return (
    <header
      className="backdrop-blur-sm border-b theme-border sticky top-0 z-40 shadow-saas"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight theme-text">PetsCare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium theme-text-muted hover:text-primary-600 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg theme-text-muted theme-hover-bg transition border theme-border"
                title="Theme"
                aria-label="Change theme"
              >
                <span className="text-base">
                  {THEMES.find((t) => t.id === theme)?.icon ?? '☀️'}
                </span>
                <span className="text-xs font-medium capitalize hidden sm:inline">{theme}</span>
                <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {themeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setThemeMenuOpen(false)} aria-hidden />
                  <div
                    className="absolute right-0 mt-1 w-40 theme-bg-card rounded-xl shadow-saas-lg border theme-border py-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow)' }}
                  >
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setTheme(t.id); setThemeMenuOpen(false); }}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition ${
                          theme === t.id ? 'bg-primary-100 text-primary-700' : 'theme-text hover:opacity-80'
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium theme-text-muted hover:text-primary-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition shadow-saas"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 theme-text hover:text-primary-600 px-3 py-2 rounded-lg hover:opacity-90 transition"
                >
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                    {role}
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                    <div className="absolute right-0 mt-1 w-52 theme-bg-card rounded-xl shadow-saas-lg border theme-border py-1.5 z-20">
                      {role === 'user' && (
                        <>
                          <Link to="/dashboard" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/dashboard/book" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Book Appointment</Link>
                          <Link to="/dashboard/appointments" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                          <Link to="/dashboard/notifications" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Notifications</Link>
                        </>
                      )}
                      {role === 'doctor' && (
                        <>
                          <Link to="/doctor" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/doctor/appointments" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                        </>
                      )}
                      {role === 'admin' && (
                        <>
                          <Link to="/admin" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/admin/appointments" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>All Appointments</Link>
                          <Link to="/admin/pets" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Pets</Link>
                          <Link to="/admin/services" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Services</Link>
                          <Link to="/admin/doctors" className="block px-4 py-2.5 text-sm theme-text hover:opacity-80" onClick={() => setMenuOpen(false)}>Doctors</Link>
                        </>
                      )}
                      <div className="my-1 border-t theme-border" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
