import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Incidents', path: '/incidents', icon: '🚨' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-gray-800 bg-gray-950 text-gray-100 flex flex-col">
      <div className="px-4 py-5 text-lg font-semibold tracking-tight">
        DevBoard
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
              }`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
