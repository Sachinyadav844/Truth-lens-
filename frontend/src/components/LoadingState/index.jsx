export default function LoadingState({ title = 'Loading', description = 'Preparing your analysis...' }) {
  return (
    <div className="truth-card flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

