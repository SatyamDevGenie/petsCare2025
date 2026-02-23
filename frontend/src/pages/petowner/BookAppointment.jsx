import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookAppointment } from '../../store/slices/appointmentSlice';
import { getDoctors } from '../../store/slices/doctorSlice';
import { clearAppointmentError } from '../../store/slices/appointmentSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

// Build time options (every 30 min) between start and end for a given schedule slot
function getTimeOptionsForSlot(slot, intervalMinutes = 30) {
  const [startH, startM] = (slot.startTime || '00:00').split(':').map(Number);
  const [endH, endM] = (slot.endTime || '00:00').split(':').map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const options = [];
  for (let m = start; m < end; m += intervalMinutes) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    options.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }
  return options;
}

export default function BookAppointment() {
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, actionSuccess } = useSelector((s) => s.appointments);
  const { list: doctors } = useSelector((s) => s.doctors);

  const selectedDoctor = useMemo(
    () => (doctors || []).find((d) => d._id === doctorId),
    [doctors, doctorId]
  );

  const scheduleForSelectedDate = useMemo(() => {
    if (!selectedDoctor?.schedule?.length || !selectedDate) return [];
    const d = new Date(selectedDate + 'T12:00:00');
    const dayOfWeek = d.getDay();
    return (selectedDoctor.schedule || []).filter((s) => s.dayOfWeek === dayOfWeek);
  }, [selectedDoctor, selectedDate]);

  const timeOptions = useMemo(() => {
    const options = new Set();
    scheduleForSelectedDate.forEach((slot) => {
      getTimeOptionsForSlot(slot).forEach((t) => options.add(t));
    });
    return Array.from(options).sort();
  }, [scheduleForSelectedDate]);

  const dateInvalidForDoctor = selectedDoctor?.schedule?.length && selectedDate && scheduleForSelectedDate.length === 0;
  const minDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (actionSuccess === 'Booked') {
      toast.success('Appointment booked successfully');
      dispatch(clearAppointmentError());
      navigate('/dashboard/appointments');
    }
  }, [actionSuccess, dispatch, navigate]);

  useEffect(() => {
    if (!selectedDate || !doctorId) setSelectedTime('');
    else if (selectedTime && !timeOptions.includes(selectedTime)) setSelectedTime('');
  }, [selectedDate, doctorId, timeOptions, selectedTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAppointmentError());
    if (!selectedDate || !selectedTime) return;
    const appointmentDate = new Date(`${selectedDate}T${selectedTime}:00`);
    dispatch(bookAppointment({ petName: petName.trim(), petBreed: petBreed.trim(), doctorId, appointmentDate, query: query || undefined }));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-1">Book Appointment</h1>
      <p className="text-sm text-slate-500 mb-6">Enter your pet&apos;s name and breed, choose a doctor, and pick a date & time that matches the doctor&apos;s availability.</p>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="e.g. Max, Bella"
            required
          />
          <Input
            label="Pet breed"
            value={petBreed}
            onChange={(e) => setPetBreed(e.target.value)}
            placeholder="e.g. Labrador, Persian"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); setSelectedDate(''); setSelectedTime(''); }}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">Select doctor</option>
              {(doctors || []).map((d) => (
                <option key={d._id} value={d._id}>{d.name} – {d.specialization}</option>
              ))}
            </select>
            {selectedDoctor && (
              <p className="mt-2 text-sm text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
                <strong>Available:</strong> {selectedDoctor.availability || 'Contact clinic'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            {dateInvalidForDoctor && (
              <p className="mt-1 text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                This doctor is not available on this day. {selectedDoctor?.availability}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              disabled={!selectedDate || timeOptions.length === 0}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-60"
            >
              <option value="">Select time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {selectedDate && timeOptions.length === 0 && scheduleForSelectedDate.length === 0 && selectedDoctor?.schedule?.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">Select an available date for this doctor to see time slots.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Query / Notes (optional)</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Any specific concerns?"
            />
          </div>
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <Button
            type="submit"
            loading={loading}
            disabled={dateInvalidForDoctor || (selectedDate && timeOptions.length === 0)}
            className="w-full"
          >
            Book Appointment
          </Button>
        </form>
      </Card>
    </div>
  );
}
