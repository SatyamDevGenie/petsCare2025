import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorAppointments, respondToAppointment, clearAppointmentError } from '../../store/slices/appointmentSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

function StatusBadge({ status }) {
  const colors = {
    Pending: 'bg-amber-100 text-amber-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Cancelled: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}

export default function DoctorAppointments() {
  const dispatch = useDispatch();
  const { list, loading, error, actionSuccess } = useSelector((s) => s.appointments);
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  const handleRespond = (appointmentId, response) => {
    setRespondingId(appointmentId);
    dispatch(clearAppointmentError());
    dispatch(respondToAppointment({ appointmentId, response })).finally(() => setRespondingId(null));
  };

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;
  if (error && !actionSuccess) return <div className="text-red-600 py-8">{error}</div>;

  const appointments = list || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
      <p className="text-gray-600 mb-6">Accept, reject, or cancel appointments.</p>

      {actionSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">{actionSuccess}</div>
      )}

      <div className="space-y-4">
        {appointments.map((a) => (
          <Card key={a._id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">
                  {a.petOwner?.name ?? '—'} • Pet: {a.pet?.name ?? '—'}
                </p>
                <p className="text-sm text-gray-600">
                  {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                </p>
                {a.query && <p className="text-sm text-gray-500 mt-1">{a.query}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={a.status} />
                {a.status === 'Pending' && (
                  <>
                    <Button
                      variant="primary"
                      disabled={respondingId === a._id}
                      onClick={() => handleRespond(a._id, 'Accepted')}
                    >
                      {respondingId === a._id ? '...' : 'Accept'}
                    </Button>
                    <Button
                      variant="danger"
                      disabled={respondingId === a._id}
                      onClick={() => handleRespond(a._id, 'Rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={respondingId === a._id}
                      onClick={() => handleRespond(a._id, 'Cancelled')}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {appointments.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No appointments assigned to you.</p>
        </Card>
      )}
    </div>
  );
}
