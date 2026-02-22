import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../store/slices/doctorSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function Doctors() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Doctors</h1>
      <p className="text-gray-600 mb-8">Meet our veterinary team.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(list || []).map((d) => (
          <Link key={d._id} to={`/doctors/${d._id}`}>
            <Card className="h-full hover:shadow-md hover:border-primary-200 transition">
              <div className="flex items-start gap-4">
                {d.profileImage ? (
                  <img src={d.profileImage} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl">👨‍⚕️</div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{d.name}</h2>
                  <p className="text-primary-600 text-sm">{d.specialization}</p>
                  {d.contactNumber && <p className="text-gray-500 text-sm mt-1">{d.contactNumber}</p>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {(!list || list.length === 0) && (
        <p className="text-gray-500 text-center py-12">No doctors available.</p>
      )}
    </div>
  );
}
