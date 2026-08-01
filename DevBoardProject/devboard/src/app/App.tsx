import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/app/Layout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { IncidentsPage } from '@/features/incidents/pages/IncidentsPage'
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}