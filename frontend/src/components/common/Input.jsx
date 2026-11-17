export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <input className="input-field" {...props} />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}