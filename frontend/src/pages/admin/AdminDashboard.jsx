import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointments } from '../../store/slices/appointmentSlice';
import Card from '../../components/common/Card';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: appointments } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  const pending = (appointments || []).filter((a) => a.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.name}.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/appointments">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="font-semibold text-gray-900">All Appointments</h2>
            <p className="text-sm text-gray-600">{appointments?.length ?? 0} total, {pending} pending</p>
          </Card>
        </Link>
        <Link to="/admin/pets">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">🐾</div>
            <h2 className="font-semibold text-gray-900">Pets</h2>
            <p className="text-sm text-gray-600">Manage pets</p>
          </Card>
        </Link>
        <Link to="/admin/services">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">🩺</div>
            <h2 className="font-semibold text-gray-900">Services</h2>
            <p className="text-sm text-gray-600">Manage services</p>
          </Card>
        </Link>
        <Link to="/admin/doctors">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">👨‍⚕️</div>
            <h2 className="font-semibold text-gray-900">Doctors</h2>
            <p className="text-sm text-gray-600">Manage doctors</p>
          </Card>
        </Link>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-2">Quick links</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/appointments" className="text-primary-600 hover:underline font-medium">All appointments →</Link>
          <Link to="/admin/pets" className="text-primary-600 hover:underline font-medium">Pets →</Link>
          <Link to="/admin/services" className="text-primary-600 hover:underline font-medium">Services →</Link>
          <Link to="/admin/doctors" className="text-primary-600 hover:underline font-medium">Doctors →</Link>
        </div>
      </Card>
    </div>
  );
}
