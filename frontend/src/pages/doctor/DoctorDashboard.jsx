import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorAppointments } from '../../store/slices/appointmentSlice';
import Card from '../../components/common/Card';

export default function DoctorDashboard() {
  const dispatch = useDispatch();
  const { doctor } = useSelector((s) => s.auth);
  const { list } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  const pending = (list || []).filter((a) => a.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
      <p className="text-slate-600 mb-8">Welcome, Dr. {doctor?.name}.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Link to="/doctor/appointments">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="font-semibold text-slate-900">My Appointments</h2>
            <p className="text-sm text-slate-600">{list?.length ?? 0} total, {pending} pending response</p>
          </Card>
        </Link>
        <Link to="/doctors">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">👥</div>
            <h2 className="font-semibold text-slate-900">Our Team</h2>
            <p className="text-sm text-slate-600">View doctors</p>
          </Card>
        </Link>
      </div>

      <Card>
        <h2 className="font-semibold text-slate-900 mb-2">Quick action</h2>
        <Link to="/doctor/appointments" className="text-primary-600 hover:underline font-medium">Respond to appointments →</Link>
      </Card>
    </div>
  );
}
