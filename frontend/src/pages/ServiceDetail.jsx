import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleService } from '../store/slices/serviceSlice';
import { askAboutService as askAboutServiceApi } from '../api/ai';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

export default function ServiceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.services);
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState('');

  useEffect(() => {
    if (id) dispatch(getSingleService(id));
  }, [dispatch, id]);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || !current?._id) return;
    setAskError('');
    setReply('');
    setAskLoading(true);
    try {
      const { reply: result } = await askAboutServiceApi(current._id, q);
      setReply(result || 'No reply received.');
    } catch (err) {
      setAskError(err.response?.data?.message || err.message || 'Failed to get answer.');
    } finally {
      setAskLoading(false);
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 py-8">{error}</div>;
  if (!current) return null;

  return (
    <div>
      <Link to="/services" className="text-primary-600 hover:underline mb-4 inline-block">← Back to Services</Link>
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{current.title}</h1>
        <p className="text-slate-600 mb-4">{current.description}</p>
        <p className="text-primary-600 font-semibold text-lg">₹{current.price ?? '—'}</p>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Ask about this service</h2>
        <p className="text-sm text-slate-500 mb-3">
          Ask anything about this service—what&apos;s included, how to prepare, how long it takes, etc.
        </p>
        <div className="flex flex-wrap gap-2 items-start">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. What's included? How to prepare? How long does it take?"
            className="flex-1 min-w-[200px] border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={askLoading}
          />
          <Button variant="primary" onClick={handleAsk} disabled={askLoading || !question.trim()}>
            {askLoading ? '...' : 'Ask AI'}
          </Button>
        </div>
        {askError && <p className="text-red-600 text-sm mt-2">{askError}</p>}
        {reply && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-1">Answer</p>
            <p className="text-slate-700 whitespace-pre-wrap">{reply}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
