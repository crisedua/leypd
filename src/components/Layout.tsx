import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
	HomeIcon,
	MapIcon,
	ClipboardDocumentListIcon,
	QueueListIcon,
	UserGroupIcon,
	ShieldCheckIcon,
	BuildingStorefrontIcon,
	DocumentDuplicateIcon,
	ChartBarIcon,
	ArrowLeftOnRectangleIcon,
	Bars3Icon,
	ClipboardDocumentIcon,
	UsersIcon,
	QuestionMarkCircleIcon,
	ClockIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
	ExclamationTriangleIcon,
	HandRaisedIcon,
	AcademicCapIcon,
	PresentationChartLineIcon,
	GlobeAltIcon
} from '@heroicons/react/24/outline'

interface LayoutProps { children: React.ReactNode }

const navigation = [
	{ name: 'Inicio', href: '/', icon: HomeIcon },
	{ name: 'Roadmap', href: '/roadmap', icon: MapIcon },
	{ name: 'Checklists', href: '/checklists', icon: ClipboardDocumentIcon },
	{ name: 'RoPA', href: '/ropa', icon: QueueListIcon },
	{ name: 'DSAR Hub', href: '/dsar', icon: UserGroupIcon },
	{ name: 'DPIA Copilot', href: '/dpia', icon: ShieldCheckIcon },
	{ name: 'Gobernanza', href: '/gobernanza', icon: AcademicCapIcon },
	{ name: 'Web Scraper', href: '/web-scraper', icon: GlobeAltIcon }
]

const gestionNavigation = [
	{ name: 'Reportes', href: '/reportes', icon: DocumentDuplicateIcon },
	{ name: 'KPIs', href: '/kpis', icon: ChartBarIcon },
	{ name: 'Usuarios', href: '/usuarios', icon: UsersIcon },
	{ name: 'Documentos', href: '/documentos', icon: DocumentTextIcon },
	{ name: 'Tareas por Fase', href: '/pm-tareas', icon: ClipboardDocumentListIcon }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { user, signOut } = useAuth()
	const location = useLocation()

	const handleSignOut = async () => {
		await signOut()
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile top bar */}
			<div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-white px-4 py-3 shadow-sm lg:hidden">
				<button className="btn-secondary" onClick={() => setSidebarOpen((s) => !s)}>
					<Bars3Icon className="h-5 w-5" />
				</button>
				<div className="font-semibold">Chile DP Law Pilot + PMO</div>
			</div>

			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white p-4 shadow-lg transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="mb-6 text-lg font-semibold">Chile DP Law Pilot + PMO</div>
				<nav className="space-y-1">
					{navigation.map((item) => {
						const isActive = location.pathname === item.href
						const Icon = item.icon
						return (
							<Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
								<Icon className="h-5 w-5" />
								{item.name}
							</Link>
						)
					})}
				</nav>
				
				{/* Gestión Section */}
				<div className="mt-6 border-t pt-4">
					<div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Gestión</div>
					<nav className="space-y-1">
						{gestionNavigation.map((item) => {
							const isActive = location.pathname === item.href
							const Icon = item.icon
							return (
								<Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
									<Icon className="h-5 w-5" />
									{item.name}
								</Link>
							)
						})}
					</nav>
				</div>
				<div className="mt-8 border-t pt-4 text-sm text-gray-600">
					<div className="mb-2">{user?.name || user?.email}</div>
					<button onClick={handleSignOut} className="btn-secondary inline-flex items-center gap-2">
						<ArrowLeftOnRectangleIcon className="h-4 w-4" />
						Salir
					</button>
				</div>
			</div>

			{/* Main */}
			<div className="lg:pl-64">
				<main className="p-4 sm:p-6 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	)
}

export default Layout


