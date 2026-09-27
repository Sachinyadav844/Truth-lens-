import { Search, Sparkles } from 'lucide-react'

export default function ClaimInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter a claim to fact-check...',
  buttonLabel = 'Check Claim',
  examples = [],
  loading = false,
}) {
  return (
    <div className="w-full">
      <div className="truth-card flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <textarea
            id="claim-input"
            rows={1}
            value={value}
            onChange={onChange}
            maxLength={500}
            aria-label="Claim to investigate"
            placeholder={placeholder}
            className="min-h-[52px] w-full resize-none border-0 bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="btn-primary h-[56px] min-w-[180px] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? 'Checking...' : buttonLabel}
          </span>
        </button>
      </div>

      {examples.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
          <span className="mr-1 font-medium text-slate-500">Or try an example:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange({ target: { value: example } })}
              className="chip"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

