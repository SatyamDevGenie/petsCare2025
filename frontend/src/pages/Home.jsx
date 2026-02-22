import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { token, role } = useSelector((s) => s.auth);

  return (
    <div>
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">PetsCare</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Quality care for your pets. Book appointments with our doctors and keep your furry friends healthy.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Our Services
          </Link>
          <Link
            to="/doctors"
            className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition"
          >
            Meet Doctors
          </Link>
          {token && role === 'user' && (
            <Link
              to="/dashboard/book"
              className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition"
            >
              Book Appointment
            </Link>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mt-12">
        <Link
          to="/services"
          className="block p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mb-4">🩺</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Services</h2>
          <p className="text-gray-600 text-sm">Check our healthcare and grooming services.</p>
        </Link>
        <Link
          to="/doctors"
          className="block p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mb-4">👨‍⚕️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Doctors</h2>
          <p className="text-gray-600 text-sm">Meet our experienced veterinary team.</p>
        </Link>
        <Link
          to="/pets"
          className="block p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mb-4">🐾</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Pets</h2>
          <p className="text-gray-600 text-sm">Browse pets in our care.</p>
        </Link>
      </section>
    </div>
  );
}
