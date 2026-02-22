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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600">PetsCare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-600 hover:text-primary-600 font-medium transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                    {role}
                  </span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      {role === 'user' && (
                        <>
                          <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/dashboard/book" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Book Appointment</Link>
                          <Link to="/dashboard/appointments" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                          <Link to="/dashboard/notifications" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Notifications</Link>
                        </>
                      )}
                      {role === 'doctor' && (
                        <>
                          <Link to="/doctor" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/doctor/appointments" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Appointments</Link>
                        </>
                      )}
                      {role === 'admin' && (
                        <>
                          <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                          <Link to="/admin/appointments" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>All Appointments</Link>
                          <Link to="/admin/pets" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Pets</Link>
                          <Link to="/admin/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Services</Link>
                          <Link to="/admin/doctors" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Doctors</Link>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
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
