import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleService } from '../store/slices/serviceSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function ServiceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.services);

  useEffect(() => {
    if (id) dispatch(getSingleService(id));
  }, [dispatch, id]);

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
    </div>
  );
}
