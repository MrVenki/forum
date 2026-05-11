export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-saffron-200 border-t-saffron-500 animate-spin" />
        <p className="text-sm text-neutral-400">Loading…</p>
      </div>
    </div>
  )
}
