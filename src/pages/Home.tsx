import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { CalendarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface KPIData {
	ropaCoverage: number
	dsarHealth: number
	dpiaHealth: number
	incidentMttr: number
}

const Home: React.FC = () => {
	const { user } = useAuth()
	const [kpiData, setKpiData] = useState<KPIData>({
		ropaCoverage: 60,
		dsarHealth: 70,
		dpiaHealth: 55,
		incidentMttr: 48
	})

	useEffect(() => {
		// Placeholder for fetching KPIs from Supabase
		setKpiData((k) => ({ ...k }))
	}, [])

	const readiness = Math.round(
		0.25 * kpiData.ropaCoverage + 0.25 * kpiData.dsarHealth + 0.25 * kpiData.dpiaHealth +
		0.25 * Math.max(0, 100 - kpiData.incidentMttr)
	)

	return (
		<div className="space-y-6">
			<div className="flex items-end justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Hola{user?.name ? `, ${user.name}` : ''}</h1>
					<p className="text-gray-600">Panel principal: progreso, próximos hitos y accesos rápidos</p>
				</div>
				<div className="card">
					<div className="text-sm text-gray-600">Readiness</div>
					<div className="text-3xl font-bold">{readiness}%</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="card">
					<div className="text-sm text-gray-600">Cobertura RoPA</div>
					<div className="text-2xl font-semibold">{kpiData.ropaCoverage}%</div>
				</div>
				<div className="card">
					<div className="text-sm text-gray-600">DSAR Health</div>
					<div className="text-2xl font-semibold">{kpiData.dsarHealth}%</div>
				</div>
				<div className="card">
					<div className="text-sm text-gray-600">DPIA Health</div>
					<div className="text-2xl font-semibold">{kpiData.dpiaHealth}%</div>
				</div>
				<div className="card">
					<div className="text-sm text-gray-600">Incidente MTTR</div>
					<div className="text-2xl font-semibold">{kpiData.incidentMttr}h</div>
				</div>
			</div>

			<div className="card">
				<h2 className="mb-3 text-lg font-semibold">Acciones rápidas</h2>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<a href="/programa" className="btn-primary">Ver Roadmap</a>
					<a href="/checklists" className="btn-secondary">Abrir Checklists</a>
					<a href="/reportes" className="btn-secondary">Generar Reporte</a>
				</div>
			</div>

			{/* Roadmap Timeline */}
			<div className="card">
				<h2 className="mb-4 text-lg font-semibold">Resumen visual del Roadmap</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Paso</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Acción clave</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Deadline recomendado</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{
									step: 1,
									action: 'Inventario y diagnóstico',
									deadline: 'Septiembre 2025',
									status: 'completed',
									description: 'Mapeo de sistemas y tratamientos de datos personales'
								},
								{
									step: 2,
									action: 'Nuevas políticas y procedimientos',
									deadline: 'Diciembre 2025',
									status: 'in_progress',
									description: 'Desarrollo de políticas de privacidad y procedimientos internos'
								},
								{
									step: 3,
									action: 'Designación de DPO y capacitación',
									deadline: 'Febrero 2026',
									status: 'pending',
									description: 'Nombramiento del Delegado de Protección de Datos y formación del equipo'
								},
								{
									step: 4,
									action: 'Seguridad y PIA',
									deadline: 'Abril 2026',
									status: 'pending',
									description: 'Implementación de medidas de seguridad y evaluaciones de impacto'
								},
								{
									step: 5,
									action: 'Contratos y transferencias',
									deadline: 'Junio 2026',
									status: 'pending',
									description: 'Actualización de contratos con proveedores y gestión de transferencias'
								},
								{
									step: 6,
									action: 'Monitoreo y actualización',
									deadline: 'Hasta diciembre 2026 y continuo',
									status: 'pending',
									description: 'Sistema de monitoreo continuo y actualizaciones periódicas'
								}
							].map((item) => (
								<tr key={item.step} className="hover:bg-gray-50">
									<td className="px-4 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
												<span className="text-sm font-medium text-primary-800">{item.step}</span>
											</div>
										</div>
									</td>
									<td className="px-4 py-4">
										<div className="text-sm font-medium text-gray-900">{item.action}</div>
										<div className="text-sm text-gray-500">{item.description}</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap">
										<div className="flex items-center text-sm text-gray-900">
											<CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
											{item.deadline}
										</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap">
										{getStatusBadge(item.status)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

const getStatusBadge = (status: string) => {
	const statusConfig = {
		completed: { 
			color: 'bg-green-100 text-green-800', 
			text: 'Completado',
			icon: CheckCircleIcon
		},
		in_progress: { 
			color: 'bg-blue-100 text-blue-800', 
			text: 'En progreso',
			icon: ClockIcon
		},
		pending: { 
			color: 'bg-gray-100 text-gray-800', 
			text: 'Pendiente',
			icon: ClockIcon
		}
	}
	const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
	const Icon = config.icon
	return (
		<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
			<Icon className="h-3 w-3 mr-1" />
			{config.text}
		</span>
	)
}

export default Home


