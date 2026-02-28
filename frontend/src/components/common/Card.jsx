export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`theme-bg-card rounded-saas-lg border theme-border shadow-saas overflow-hidden ${
        padding ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
