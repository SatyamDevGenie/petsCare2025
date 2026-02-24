import { useState, useEffect } from 'react';
import { useStore } from 'react-redux';
import { toast } from 'react-toastify';
import { summarizeVisitNotes } from '../api/ai';
import Modal from './common/Modal';
import Button from './common/Button';

export default function SummarizeNotesModal({ open, onClose, initialNotes = '', onUseInEmail }) {
  const getState = useStore().getState;
  const [notes, setNotes] = useState(initialNotes);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNotes(initialNotes);
      setSummary('');
    }
  }, [open, initialNotes]);

  const handleSummarize = async () => {
    const text = notes.trim();
    if (!text) {
      toast.error('Please paste or type visit notes first.');
      return;
    }
    setLoading(true);
    setSummary('');
    try {
      const { summary: result } = await summarizeVisitNotes(text, getState);
      setSummary(result || 'No summary generated.');
      toast.success('Summary ready.');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to summarize.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => toast.success('Copied to clipboard.'));
  };

  const handleUseInEmail = () => {
    if (summary && onUseInEmail) {
      onUseInEmail(summary);
      onClose();
    }
  };

  const handleClose = () => {
    setNotes(initialNotes);
    setSummary('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Summarize visit notes">
      <p className="text-sm text-slate-600 mb-3">
        Paste raw visit notes below. AI will generate a short, pet-owner-friendly summary (2–3 sentences).
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Checkup done. Weight 12 kg. Vaccination booster given. Next visit in 6 months."
        rows={4}
        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 mb-4"
      />
      <Button type="button" onClick={handleSummarize} loading={loading} disabled={loading} className="mb-4">
        {loading ? 'Summarizing…' : 'Summarize'}
      </Button>

      {summary && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Summary for pet owner</p>
          <p className="text-sm text-slate-800 whitespace-pre-wrap">{summary}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button type="button" variant="secondary" onClick={handleCopy}>
              Copy
            </Button>
            {onUseInEmail && (
              <Button type="button" variant="primary" onClick={handleUseInEmail}>
                Use in email
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
