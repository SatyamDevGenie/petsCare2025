import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointments, clearAppointmentError } from '../../store/slices/appointmentSlice';
import SendEmailModal from '../../components/admin/SendEmailModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
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

export default function AllAppointments() {
  const dispatch = useDispatch();
  const { list, loading, error, actionSuccess } = useSelector((s) => s.appointments);
  const [emailModal, setEmailModal] = useState({ open: false, id: null, ownerName: '' });

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  const openEmail = (id, ownerName) => setEmailModal({ open: true, id, ownerName });
  const closeEmail = () => {
    setEmailModal({ open: false, id: null, ownerName: '' });
    dispatch(clearAppointmentError());
  };

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;
  if (error && !actionSuccess) return <div className="text-red-600 py-8">{error}</div>;

  const appointments = list || [];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-1">All Appointments</h1>
      <p className="text-slate-600 mb-6 text-sm">View all appointments and send emails to pet owners.</p>

      {actionSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">{actionSuccess}</div>
      )}

      <div className="space-y-4">
        {appointments.map((a) => (
          <Card key={a._id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  {a.petOwner?.name ?? '—'} ({a.petOwner?.email ?? '—'})
                </p>
                <p className="text-sm text-slate-600">
                  Dr. {a.doctor?.name ?? '—'} • Pet: {a.pet?.name ?? a.petName ?? '—'}
                  {(a.pet?.breed || a.petBreed) && ` (${a.pet?.breed ?? a.petBreed})`}
                </p>
                <p className="text-sm text-slate-500">
                  {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={a.status} />
                <Button
                  variant="outline"
                  onClick={() => openEmail(a._id, a.petOwner?.name ?? a.petOwner?.email ?? 'Owner')}
                >
                  Send email
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {appointments.length === 0 && (
        <Card>
          <p className="text-slate-500 text-center py-8">No appointments.</p>
        </Card>
      )}

      <SendEmailModal
        open={emailModal.open}
        onClose={closeEmail}
        appointmentId={emailModal.id}
        ownerName={emailModal.ownerName}
      />
    </div>
  );
}
