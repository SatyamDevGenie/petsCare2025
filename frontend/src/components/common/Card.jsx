export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-white rounded-saas-lg border border-slate-200/80 shadow-saas overflow-hidden ${
        padding ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
