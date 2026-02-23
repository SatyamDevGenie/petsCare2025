import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorById } from '../store/slices/doctorSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function DoctorDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.doctors);

  useEffect(() => {
    if (id) dispatch(getDoctorById(id));
  }, [dispatch, id]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 py-8">{error}</div>;
  if (!current) return null;

  return (
    <div>
      <Link to="/doctors" className="text-primary-600 hover:underline mb-4 inline-block">← Back to Doctors</Link>
      <Card>
        <div className="flex flex-col sm:flex-row gap-6">
          {current.profileImage ? (
            <img src={current.profileImage} alt="" className="w-32 h-32 rounded-xl object-cover" />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-5xl">👨‍⚕️</div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{current.name}</h1>
            <p className="text-primary-600 font-medium mt-1">{current.specialization}</p>
            {current.availability && (
              <p className="mt-2 px-3 py-1.5 bg-primary-50 text-primary-800 rounded-lg text-sm font-medium inline-block">
                Available: {current.availability}
              </p>
            )}
            {current.contactNumber && <p className="text-slate-600 mt-2">Contact: {current.contactNumber}</p>}
            {current.notes && <p className="text-slate-600 mt-4 leading-relaxed">{current.notes}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
}
