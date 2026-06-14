export function parseIsActive(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'active';
}

export default function StatusToggle({
  checked,
  disabled = false,
  loading = false,
  onChange,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  loadingLabel = 'Updating...',
}) {
  return (
    <label
      className={`flex items-center ${disabled || loading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={Boolean(checked)}
          disabled={disabled || loading}
          onChange={onChange}
        />
        <div
          className={`block w-14 h-7 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        />
        <div
          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
            checked ? 'transform translate-x-7' : ''
          }`}
        />
      </div>
      <span className="ml-3 text-sm font-medium text-gray-700">
        {loading ? loadingLabel : checked ? activeLabel : inactiveLabel}
      </span>
    </label>
  );
}
