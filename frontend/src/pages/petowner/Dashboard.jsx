import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAppointments } from '../../store/slices/appointmentSlice';
import { getMyNotifications } from '../../store/slices/notificationSlice';
import Card from '../../components/common/Card';

export default function PetOwnerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list } = useSelector((s) => s.appointments);
  const { unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(getUserAppointments());
    dispatch(getMyNotifications());
  }, [dispatch]);

  const pending = (list || []).filter((a) => a.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Welcome back, {user?.name}.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/dashboard/book">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">📅</div>
            <h2 className="font-semibold text-slate-900">Book Appointment</h2>
            <p className="text-sm text-slate-600">Schedule a visit with a doctor</p>
          </Card>
        </Link>
        <Link to="/dashboard/appointments">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="font-semibold text-slate-900">My Appointments</h2>
            <p className="text-sm text-slate-600">{list?.length ?? 0} total, {pending} pending</p>
          </Card>
        </Link>
        <Link to="/dashboard/notifications">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">🔔</div>
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-600">{unreadCount ?? 0} unread</p>
          </Card>
        </Link>
        <Link to="/services">
          <Card className="hover:shadow-md hover:border-primary-200 transition h-full">
            <div className="text-3xl mb-2">🩺</div>
            <h2 className="font-semibold text-slate-900">Services</h2>
            <p className="text-sm text-slate-600">View our services</p>
          </Card>
        </Link>
      </div>

      <Card>
        <h2 className="font-semibold text-slate-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/dashboard/book" className="text-primary-600 hover:underline font-medium">Book new appointment →</Link>
          <Link to="/dashboard/notifications" className="text-primary-600 hover:underline font-medium">View notifications →</Link>
        </div>
      </Card>
    </div>
  );
}
