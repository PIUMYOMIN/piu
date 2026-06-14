import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

export default function FloatingToast({ toast, onDismiss }) {
  if (!toast) return null;

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-50 border-green-200'
      : toast.type === 'error'
      ? 'bg-red-50 border-red-200'
      : 'bg-blue-50 border-blue-200';

  const textColor =
    toast.type === 'success'
      ? 'text-green-800'
      : toast.type === 'error'
      ? 'text-red-800'
      : 'text-blue-800';

  const icon =
    toast.type === 'success' ? (
      <FaCheckCircle className="text-green-500" />
    ) : toast.type === 'error' ? (
      <FaTimesCircle className="text-red-500" />
    ) : (
      <FaInfoCircle className="text-blue-500" />
    );

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slideIn">
      <div
        className={`flex items-center p-4 rounded-lg border shadow-lg max-w-md ${bgColor} ${textColor}`}
        role="status"
        aria-live="polite"
      >
        <div className="text-lg mr-3">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-3 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss notification"
        >
          <FaTimesCircle />
        </button>
      </div>
    </div>
  );
}
