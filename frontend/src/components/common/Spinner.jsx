export default function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="w-9 h-9 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}
