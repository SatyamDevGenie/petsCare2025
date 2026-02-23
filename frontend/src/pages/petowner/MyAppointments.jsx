import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAppointments } from '../../store/slices/appointmentSlice';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

function StatusBadge({ status }) {
  const colors = {
    Pending: 'bg-amber-100 text-amber-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Cancelled: 'bg-slate-100 text-slate-800',
  };
  return (
    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${colors[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
}

export default function MyAppointments() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(getUserAppointments());
  }, [dispatch]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 py-8">{error}</div>;

  const appointments = list || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Appointments</h1>
      <p className="text-slate-600 mb-6">View your appointment history and status.</p>

      <div className="space-y-4">
        {appointments.map((a) => (
          <Card key={a._id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  Dr. {a.doctor?.name ?? '—'} • {a.pet?.name ?? a.petName ?? '—'}
                  {(a.pet?.breed || a.petBreed) && ` (${a.pet?.breed ?? a.petBreed})`}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                </p>
                {a.query && <p className="text-sm text-slate-500 mt-1">{a.query}</p>}
              </div>
              <StatusBadge status={a.status} />
            </div>
          </Card>
        ))}
      </div>
      {appointments.length === 0 && (
        <Card>
          <p className="text-slate-500 text-center py-8">No appointments yet. Book one from the dashboard.</p>
        </Card>
      )}
    </div>
  );
}
