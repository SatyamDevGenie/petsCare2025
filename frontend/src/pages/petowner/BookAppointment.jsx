import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bookAppointment } from '../../store/slices/appointmentSlice';
import { getPets } from '../../store/slices/petSlice';
import { getDoctors } from '../../store/slices/doctorSlice';
import { clearAppointmentError } from '../../store/slices/appointmentSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function BookAppointment() {
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, actionSuccess } = useSelector((s) => s.appointments);
  const { list: pets } = useSelector((s) => s.pets);
  const { list: doctors } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(getPets());
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (actionSuccess === 'Booked') {
      dispatch(clearAppointmentError());
      navigate('/dashboard/appointments');
    }
  }, [actionSuccess, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAppointmentError());
    const date = new Date(appointmentDate);
    dispatch(bookAppointment({ petId, doctorId, appointmentDate: date, query: query || undefined }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
      <p className="text-gray-600 mb-6">Select pet, doctor, and preferred date/time.</p>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select pet</option>
              {(pets || []).map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.type}, {p.breed})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select doctor</option>
              {(doctors || []).map((d) => (
                <option key={d._id} value={d._id}>{d.name} – {d.specialization}</option>
              ))}
            </select>
          </div>
          <Input
            label="Date & time"
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Query / Notes (optional)</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any specific concerns?"
            />
          </div>
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <Button type="submit" loading={loading} className="w-full">Book Appointment</Button>
        </form>
      </Card>
    </div>
  );
}
