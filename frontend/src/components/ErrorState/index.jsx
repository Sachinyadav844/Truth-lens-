export default function ErrorState({ title = 'Something went wrong', message = 'Please try again.', onRetry }) {
  return (
    <div className="truth-card border-rose-200 bg-rose-50 p-6 text-rose-700" role="alert">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-rose-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">
          Try again
        </button>
      )}
    </div>
  )
}

