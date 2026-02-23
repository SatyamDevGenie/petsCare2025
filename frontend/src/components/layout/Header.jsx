import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useState } from 'react';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, doctor, role, token } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-40 shadow-saas">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-slate-800">PetsCare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition"
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
                  className="flex items-center gap-2 text-slate-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
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
                    <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-saas-lg border border-slate-100 py-1.5 z-20">
                      {role === 'user' && (
                        <>
                          <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/dashboard/book" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Book Appointment</Link>
                          <Link to="/dashboard/appointments" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                          <Link to="/dashboard/notifications" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Notifications</Link>
                        </>
                      )}
                      {role === 'doctor' && (
                        <>
                          <Link to="/doctor" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/doctor/appointments" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                        </>
                      )}
                      {role === 'admin' && (
                        <>
                          <Link to="/admin" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/admin/appointments" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>All Appointments</Link>
                          <Link to="/admin/pets" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Pets</Link>
                          <Link to="/admin/services" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Services</Link>
                          <Link to="/admin/doctors" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Doctors</Link>
                        </>
                      )}
                      <div className="my-1 border-t border-slate-100" />
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
    </header>
  );
}
