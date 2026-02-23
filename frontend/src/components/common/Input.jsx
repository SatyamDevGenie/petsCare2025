export default function Input({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition ${
          error ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
