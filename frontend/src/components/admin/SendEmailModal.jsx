import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { sendEmailToAppointmentUser, clearAppointmentError } from '../../store/slices/appointmentSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';

export default function SendEmailModal({ open, onClose, appointmentId, ownerName, initialMessage = '' }) {
  const [subject, setSubject] = useState('PetsCare – Update on your appointment');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector((s) => s.appointments);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (open && initialMessage) setMessage(initialMessage);
  }, [open, initialMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAppointmentError());
    dispatch(sendEmailToAppointmentUser({ appointmentId, subject, message })).then((res) => {
      if (res.meta?.requestStatus === 'fulfilled') {
        toast.success('Email sent successfully');
        setSubject('PetsCare – Update on your appointment');
        setMessage('');
        onClose();
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Send email to pet owner">
      {ownerName && <p className="text-sm text-slate-600 mb-4">To: {ownerName}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Optional message body..."
          />
        </div>
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Send email</Button>
        </div>
      </form>
    </Modal>
  );
}
