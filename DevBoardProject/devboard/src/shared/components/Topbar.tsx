export function Topbar() {
  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950 text-gray-100 flex items-center px-4 justify-between">
      <div className="text-sm text-gray-400">Incident Command Center</div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-700" aria-label="User avatar" />
      </div>
    </header>
  )
}