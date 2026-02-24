import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDoctorAppointments, respondToAppointment, clearAppointmentError } from '../../store/slices/appointmentSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import SummarizeNotesModal from '../../components/SummarizeNotesModal';

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
  const [summarizeOpen, setSummarizeOpen] = useState(false);
  const [summarizeInitialNotes, setSummarizeInitialNotes] = useState('');
  const [rejectModal, setRejectModal] = useState({ open: false, appointmentId: null });
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRespond = (appointmentId, response, rejectionReason) => {
    setRespondingId(appointmentId);
    dispatch(clearAppointmentError());
    dispatch(respondToAppointment({ appointmentId, response, rejectionReason })).then((res) => {
      if (res.meta?.requestStatus === 'fulfilled') toast.success(`Appointment ${response.toLowerCase()} successfully`);
    }).finally(() => setRespondingId(null));
  };

  const openRejectModal = (appointmentId) => {
    setRejectModal({ open: true, appointmentId });
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectModal({ open: false, appointmentId: null });
    setRejectReason('');
  };

  const submitReject = () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    handleRespond(rejectModal.appointmentId, 'Rejected', trimmed);
    closeRejectModal();
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setSummarizeInitialNotes(a.query || '');
                    setSummarizeOpen(true);
                  }}
                >
                  Summarize notes
                </Button>
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
                      onClick={() => openRejectModal(a._id)}
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

      <SummarizeNotesModal
        open={summarizeOpen}
        onClose={() => setSummarizeOpen(false)}
        initialNotes={summarizeInitialNotes}
      />

      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeRejectModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Reject appointment</h3>
            <p className="text-sm text-slate-600 mb-3">Please provide a reason for rejecting this appointment (required).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Slot not available, fully booked..."
              className="w-full border border-slate-300 rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-red-500 focus:border-red-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={closeRejectModal}>Cancel</Button>
              <Button variant="danger" onClick={submitReject} disabled={!rejectReason.trim() || respondingId === rejectModal.appointmentId}>
                {respondingId === rejectModal.appointmentId ? '...' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
