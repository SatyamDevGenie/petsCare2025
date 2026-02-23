import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDoctorAppointments, respondToAppointment, clearAppointmentError } from '../../store/slices/appointmentSlice';
import Button from '../../components/common/Button';
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

export default function DoctorAppointments() {
  const dispatch = useDispatch();
  const { list, loading, error, actionSuccess } = useSelector((s) => s.appointments);
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRespond = (appointmentId, response) => {
    setRespondingId(appointmentId);
    dispatch(clearAppointmentError());
    dispatch(respondToAppointment({ appointmentId, response })).then((res) => {
      if (res.meta?.requestStatus === 'fulfilled') toast.success(`Appointment ${response.toLowerCase()} successfully`);
    }).finally(() => setRespondingId(null));
  };

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;
  if (error && !actionSuccess) return <div className="text-red-600 py-8">{error}</div>;

  const appointments = list || [];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-1">My Appointments</h1>
      <p className="text-sm text-slate-500 mb-6">Accept, reject, or cancel appointments.</p>

      <div className="space-y-4">
        {appointments.map((a) => (
          <Card key={a._id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  {a.petOwner?.name ?? '—'} • Pet: {a.pet?.name ?? a.petName ?? '—'}
                  {(a.pet?.breed || a.petBreed) && ` (${a.pet?.breed ?? a.petBreed})`}
                </p>
                <p className="text-sm text-slate-600">
                  {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                </p>
                {a.query && <p className="text-sm text-slate-500 mt-1">{a.query}</p>}
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
          <p className="text-slate-500 text-center py-8">No appointments assigned to you.</p>
        </Card>
      )}
    </div>
  );
}
