import React, { useState } from 'react'
import { 
	ExclamationTriangleIcon, 
	CheckCircleIcon, 
	ClockIcon,
	GlobeAltIcon,
	ArrowDownTrayIcon,
	PlayIcon,
	StopIcon,
	EyeIcon,
	DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ComplianceRequirement {
	id: string
	category: string
	requirement: string
	description: string
	priority: 'high' | 'medium' | 'low'
	status: 'implemented' | 'missing' | 'partial'
	location?: string
	notes?: string
	lawReference?: string
}

interface ScrapingResult {
	totalRequirements: number
	implemented: number
	missing: number
	partial: number
	complianceScore: number
	highPriorityMissing: number
	mediumPriorityMissing: number
	lowPriorityMissing: number
}

const WebScraper: React.FC = () => {
	const [isScanning, setIsScanning] = useState(false)
	const [scanProgress, setScanProgress] = useState(0)
	const [results, setResults] = useState<ScrapingResult | null>(null)
	const [requirements, setRequirements] = useState<ComplianceRequirement[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [selectedPriority, setSelectedPriority] = useState<string>('all')
	const [selectedStatus, setSelectedStatus] = useState<string>('all')

	// Comprehensive compliance requirements based on Ley 21.719
	const complianceRequirements: ComplianceRequirement[] = [
		// Gobernanza y Estructura
		{
			id: 'gov-001',
			category: 'Gobernanza',
			requirement: 'Designación de DPO',
			description: 'Delegado de Protección de Datos designado y registrado',
			priority: 'high',
			status: 'implemented',
			location: '/gobernanza',
			lawReference: 'Art. 15'
		},
		{
			id: 'gov-002',
			category: 'Gobernanza',
			requirement: 'Política de Privacidad',
			description: 'Política de privacidad actualizada conforme a Ley 21.719',
			priority: 'high',
			status: 'implemented',
			location: '/documentos',
			lawReference: 'Art. 8'
		},
		{
			id: 'gov-003',
			category: 'Gobernanza',
			requirement: 'Plan Anual DPO',
			description: 'Plan anual de actividades del DPO',
			priority: 'medium',
			status: 'missing',
			lawReference: 'Art. 15'
		},
		{
			id: 'gov-004',
			category: 'Gobernanza',
			requirement: 'Registro de Tratamientos (RoPA)',
			description: 'Registro de Actividades de Tratamiento completo',
			priority: 'high',
			status: 'implemented',
			location: '/ropa',
			lawReference: 'Art. 12'
		},

		// Derechos ARCO+
		{
			id: 'arco-001',
			category: 'Derechos ARCO+',
			requirement: 'Portal de Ejercicio de Derechos',
			description: 'Sistema para ejercicio de derechos ARCO+',
			priority: 'high',
			status: 'implemented',
			location: '/dsar',
			lawReference: 'Art. 13'
		},
		{
			id: 'arco-002',
			category: 'Derechos ARCO+',
			requirement: 'SLA 30+30 días',
			description: 'Plazos de respuesta de 30 días + 30 días de prórroga',
			priority: 'high',
			status: 'implemented',
			location: '/dsar',
			lawReference: 'Art. 13'
		},
		{
			id: 'arco-003',
			category: 'Derechos ARCO+',
			requirement: 'Derecho de Portabilidad',
			description: 'Mecanismo para transferencia de datos a otro responsable',
			priority: 'medium',
			status: 'partial',
			location: '/dsar',
			lawReference: 'Art. 13'
		},
		{
			id: 'arco-004',
			category: 'Derechos ARCO+',
			requirement: 'Derecho de Oposición',
			description: 'Mecanismo para oponerse al tratamiento',
			priority: 'high',
			status: 'implemented',
			location: '/dsar',
			lawReference: 'Art. 13'
		},

		// Evaluación de Impacto
		{
			id: 'dpia-001',
			category: 'Evaluación de Impacto',
			requirement: 'Metodología DPIA',
			description: 'Metodología para evaluaciones de impacto',
			priority: 'high',
			status: 'implemented',
			location: '/dpia',
			lawReference: 'Art. 14'
		},
		{
			id: 'dpia-002',
			category: 'Evaluación de Impacto',
			requirement: 'Evaluación de Riesgos',
			description: 'Sistema de evaluación de riesgos automatizado',
			priority: 'medium',
			status: 'implemented',
			location: '/dpia',
			lawReference: 'Art. 14'
		},
		{
			id: 'dpia-003',
			category: 'Evaluación de Impacto',
			requirement: 'Mitigación de Riesgos',
			description: 'Sistema de seguimiento de medidas de mitigación',
			priority: 'medium',
			status: 'partial',
			location: '/dpia',
			lawReference: 'Art. 14'
		},

		// Incidentes y Brechas
		{
			id: 'inc-001',
			category: 'Incidentes',
			requirement: 'Plan de Respuesta a Incidentes',
			description: 'Procedimientos para respuesta a brechas de seguridad',
			priority: 'high',
			status: 'implemented',
			location: '/incidentes',
			lawReference: 'Art. 16'
		},
		{
			id: 'inc-002',
			category: 'Incidentes',
			requirement: 'Notificación a la Agencia',
			description: 'Mecanismo de notificación de incidentes a la Agencia',
			priority: 'high',
			status: 'implemented',
			location: '/incidentes',
			lawReference: 'Art. 16'
		},
		{
			id: 'inc-003',
			category: 'Incidentes',
			requirement: 'Notificación a Titulares',
			description: 'Procedimiento de notificación a titulares afectados',
			priority: 'high',
			status: 'partial',
			location: '/incidentes',
			lawReference: 'Art. 16'
		},

		// Proveedores y Transferencias
		{
			id: 'prov-001',
			category: 'Proveedores',
			requirement: 'Registro de Encargados',
			description: 'Registro de encargados del tratamiento',
			priority: 'high',
			status: 'implemented',
			location: '/proveedores',
			lawReference: 'Art. 9'
		},
		{
			id: 'prov-002',
			category: 'Proveedores',
			requirement: 'Contratos de Encargo',
			description: 'Contratos de encargo del tratamiento',
			priority: 'high',
			status: 'implemented',
			location: '/proveedores',
			lawReference: 'Art. 9'
		},
		{
			id: 'prov-003',
			category: 'Proveedores',
			requirement: 'Transferencias Internacionales',
			description: 'Mecanismos para transferencias internacionales',
			priority: 'medium',
			status: 'missing',
			lawReference: 'Art. 10'
		},

		// Consentimiento
		{
			id: 'cons-001',
			category: 'Consentimiento',
			requirement: 'Gestión de Consentimientos',
			description: 'Sistema de gestión y registro de consentimientos',
			priority: 'high',
			status: 'implemented',
			location: '/consentimiento',
			lawReference: 'Art. 6'
		},
		{
			id: 'cons-002',
			category: 'Consentimiento',
			requirement: 'Consentimiento de Menores',
			description: 'Procedimientos especiales para menores de 14 años',
			priority: 'high',
			status: 'missing',
			lawReference: 'Art. 6'
		},
		{
			id: 'cons-003',
			category: 'Consentimiento',
			requirement: 'Retiro de Consentimiento',
			description: 'Mecanismo para retiro de consentimiento',
			priority: 'medium',
			status: 'partial',
			location: '/consentimiento',
			lawReference: 'Art. 6'
		},

		// Seguridad
		{
			id: 'sec-001',
			category: 'Seguridad',
			requirement: 'Medidas de Seguridad',
			description: 'Medidas técnicas y organizativas de seguridad',
			priority: 'high',
			status: 'implemented',
			location: '/ropa',
			lawReference: 'Art. 11'
		},
		{
			id: 'sec-002',
			category: 'Seguridad',
			requirement: 'Cifrado de Datos',
			description: 'Cifrado de datos personales sensibles',
			priority: 'high',
			status: 'missing',
			lawReference: 'Art. 11'
		},
		{
			id: 'sec-003',
			category: 'Seguridad',
			requirement: 'Pseudonimización',
			description: 'Técnicas de pseudonimización',
			priority: 'medium',
			status: 'missing',
			lawReference: 'Art. 11'
		},

		// Formación y Concienciación
		{
			id: 'train-001',
			category: 'Formación',
			requirement: 'Programa de Formación',
			description: 'Programa de formación en protección de datos',
			priority: 'medium',
			status: 'implemented',
			location: '/gobernanza',
			lawReference: 'Art. 15'
		},
		{
			id: 'train-002',
			category: 'Formación',
			requirement: 'Capacitación por Roles',
			description: 'Capacitación específica por roles y responsabilidades',
			priority: 'medium',
			status: 'missing',
			lawReference: 'Art. 15'
		},

		// Auditoría y Monitoreo
		{
			id: 'audit-001',
			category: 'Auditoría',
			requirement: 'Auditorías Internas',
			description: 'Programa de auditorías internas de cumplimiento',
			priority: 'medium',
			status: 'missing',
			lawReference: 'Art. 15'
		},
		{
			id: 'audit-002',
			category: 'Auditoría',
			requirement: 'Logs de Auditoría',
			description: 'Registro de actividades y decisiones',
			priority: 'high',
			status: 'implemented',
			location: '/documentos',
			lawReference: 'Art. 12'
		},

		// Contenido Faltante Identificado
		{
			id: 'missing-001',
			category: 'Contenido Faltante',
			requirement: 'Guías de Implementación',
			description: 'Guías paso a paso para implementación de cada fase',
			priority: 'high',
			status: 'missing',
			notes: 'Necesario para facilitar la implementación práctica'
		},
		{
			id: 'missing-002',
			category: 'Contenido Faltante',
			requirement: 'Plantillas de Documentos',
			description: 'Plantillas editables para todos los documentos requeridos',
			priority: 'high',
			status: 'partial',
			location: '/documentos',
			notes: 'Faltan plantillas específicas para cada tipo de documento'
		},
		{
			id: 'missing-003',
			category: 'Contenido Faltante',
			requirement: 'Checklist de Cumplimiento',
			description: 'Checklist detallado por artículo de la ley',
			priority: 'high',
			status: 'partial',
			location: '/checklists',
			notes: 'Necesario checklist específico por artículo'
		},
		{
			id: 'missing-004',
			category: 'Contenido Faltante',
			requirement: 'Simulador de Sanciones',
			description: 'Calculadora de sanciones según infracciones',
			priority: 'medium',
			status: 'missing',
			notes: 'Herramienta útil para evaluar riesgos'
		},
		{
			id: 'missing-005',
			category: 'Contenido Faltante',
			requirement: 'Mapeo de Sistemas',
			description: 'Herramienta para mapeo detallado de sistemas y flujos de datos',
			priority: 'high',
			status: 'missing',
			notes: 'Fundamental para el RoPA'
		}
	]

	const startScan = async () => {
		setIsScanning(true)
		setScanProgress(0)
		setResults(null)

		// Simulate scanning process
		for (let i = 0; i <= 100; i += 10) {
			setScanProgress(i)
			await new Promise(resolve => setTimeout(resolve, 100))
		}

		// Analyze requirements
		const totalRequirements = complianceRequirements.length
		const implemented = complianceRequirements.filter(r => r.status === 'implemented').length
		const missing = complianceRequirements.filter(r => r.status === 'missing').length
		const partial = complianceRequirements.filter(r => r.status === 'partial').length
		const highPriorityMissing = complianceRequirements.filter(r => r.status === 'missing' && r.priority === 'high').length
		const mediumPriorityMissing = complianceRequirements.filter(r => r.status === 'missing' && r.priority === 'medium').length
		const lowPriorityMissing = complianceRequirements.filter(r => r.status === 'missing' && r.priority === 'low').length

		const complianceScore = Math.round((implemented / totalRequirements) * 100)

		const scanResults: ScrapingResult = {
			totalRequirements,
			implemented,
			missing,
			partial,
			complianceScore,
			highPriorityMissing,
			mediumPriorityMissing,
			lowPriorityMissing
		}

		setResults(scanResults)
		setRequirements(complianceRequirements)
		setIsScanning(false)
		toast.success('Análisis de cumplimiento completado')
	}

	const stopScan = () => {
		setIsScanning(false)
		setScanProgress(0)
		toast.error('Análisis interrumpido')
	}

	const exportReport = () => {
		const report = {
			timestamp: new Date().toISOString(),
			results,
			requirements: requirements.filter(r => r.status !== 'implemented'),
			summary: `Análisis de Cumplimiento Ley 21.719 - Score: ${results?.complianceScore}%`
		}

		const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `compliance-analysis-${new Date().toISOString().split('T')[0]}.json`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success('Reporte exportado')
	}

	const filteredRequirements = requirements.filter(req => {
		const categoryMatch = selectedCategory === 'all' || req.category === selectedCategory
		const priorityMatch = selectedPriority === 'all' || req.priority === selectedPriority
		const statusMatch = selectedStatus === 'all' || req.status === selectedStatus
		return categoryMatch && priorityMatch && statusMatch
	})

	const categories = Array.from(new Set(complianceRequirements.map(r => r.category)))

	const getStatusBadge = (status: string) => {
		const config = {
			implemented: { color: 'bg-green-100 text-green-800', text: 'Implementado', icon: CheckCircleIcon },
			missing: { color: 'bg-red-100 text-red-800', text: 'Faltante', icon: ExclamationTriangleIcon },
			partial: { color: 'bg-yellow-100 text-yellow-800', text: 'Parcial', icon: ClockIcon }
		}
		const statusConfig = config[status as keyof typeof config] || config.missing
		const Icon = statusConfig.icon
		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
				<Icon className="h-3 w-3 mr-1" />
				{statusConfig.text}
			</span>
		)
	}

	const getPriorityBadge = (priority: string) => {
		const config = {
			high: { color: 'bg-red-100 text-red-800', text: 'Alta' },
			medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
			low: { color: 'bg-blue-100 text-blue-800', text: 'Baja' }
		}
		const priorityConfig = config[priority as keyof typeof config] || config.medium
		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
				{priorityConfig.text}
			</span>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Web Scraper - Análisis de Cumplimiento</h1>
				<p className="text-gray-600">
					Analiza el contenido de la plataforma para identificar gaps de cumplimiento con la Ley 21.719
				</p>
			</div>

			{/* Scan Controls */}
			<div className="card mb-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Análisis de Cumplimiento</h2>
					<div className="flex space-x-3">
						{!isScanning ? (
							<button
								onClick={startScan}
								className="btn-primary flex items-center"
							>
								<PlayIcon className="h-4 w-4 mr-2" />
								Iniciar Análisis
							</button>
						) : (
							<button
								onClick={stopScan}
								className="btn-danger flex items-center"
							>
								<StopIcon className="h-4 w-4 mr-2" />
								Detener
							</button>
						)}
						{results && (
							<button
								onClick={exportReport}
								className="btn-secondary flex items-center"
							>
								<ArrowDownTrayIcon className="h-4 w-4 mr-2" />
								Exportar Reporte
							</button>
						)}
					</div>
				</div>

				{isScanning && (
					<div className="mb-4">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-gray-700">Progreso del análisis...</span>
							<span className="text-sm text-gray-500">{scanProgress}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-primary-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${scanProgress}%` }}
							></div>
						</div>
					</div>
				)}
			</div>

			{/* Results Summary */}
			{results && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="card">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckCircleIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Score de Cumplimiento</p>
								<p className="text-2xl font-bold text-gray-900">{results.complianceScore}%</p>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckCircleIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Implementados</p>
								<p className="text-2xl font-bold text-gray-900">{results.implemented}</p>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="flex items-center">
							<div className="p-2 bg-red-100 rounded-lg">
								<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Faltantes</p>
								<p className="text-2xl font-bold text-gray-900">{results.missing}</p>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<ClockIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Parciales</p>
								<p className="text-2xl font-bold text-gray-900">{results.partial}</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Filters */}
			{results && (
				<div className="card mb-6">
					<div className="flex flex-wrap gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="input-field"
							>
								<option value="all">Todas las categorías</option>
								{categories.map(category => (
									<option key={category} value={category}>{category}</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
							<select
								value={selectedPriority}
								onChange={(e) => setSelectedPriority(e.target.value)}
								className="input-field"
							>
								<option value="all">Todas las prioridades</option>
								<option value="high">Alta</option>
								<option value="medium">Media</option>
								<option value="low">Baja</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="input-field"
							>
								<option value="all">Todos los estados</option>
								<option value="implemented">Implementado</option>
								<option value="missing">Faltante</option>
								<option value="partial">Parcial</option>
							</select>
						</div>
					</div>
				</div>
			)}

			{/* Requirements List */}
			{results && (
				<div className="card">
					<h3 className="text-lg font-semibold mb-4">Requerimientos de Cumplimiento</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Requerimiento</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredRequirements.map((req) => (
									<tr key={req.id} className="hover:bg-gray-50">
										<td className="px-4 py-4">
											<div className="text-sm font-medium text-gray-900">{req.requirement}</div>
											<div className="text-sm text-gray-500">{req.description}</div>
											{req.notes && (
												<div className="text-xs text-orange-600 mt-1">
													<ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
													{req.notes}
												</div>
											)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-900">{req.category}</span>
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											{getPriorityBadge(req.priority)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											{getStatusBadge(req.status)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											{req.location ? (
												<a href={req.location} className="text-primary-600 hover:text-primary-800 text-sm">
													<EyeIcon className="h-4 w-4 inline mr-1" />
													Ver
												</a>
											) : (
												<span className="text-gray-400 text-sm">No implementado</span>
											)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											{req.lawReference ? (
												<span className="text-sm text-gray-900 font-mono">{req.lawReference}</span>
											) : (
												<span className="text-gray-400 text-sm">-</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Recommendations */}
			{results && results.missing > 0 && (
				<div className="card mt-8">
					<h3 className="text-lg font-semibold mb-4 text-red-800">Recomendaciones Críticas</h3>
					<div className="space-y-4">
						{results.highPriorityMissing > 0 && (
							<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
								<div className="flex items-center">
									<ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
									<span className="font-medium text-red-800">
										{results.highPriorityMissing} requerimientos de alta prioridad faltantes
									</span>
								</div>
								<p className="text-red-700 mt-1">
									Estos elementos son críticos para el cumplimiento de la Ley 21.719 y deben implementarse prioritariamente.
								</p>
							</div>
						)}

						{results.mediumPriorityMissing > 0 && (
							<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
								<div className="flex items-center">
									<ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
									<span className="font-medium text-yellow-800">
										{results.mediumPriorityMissing} requerimientos de prioridad media pendientes
									</span>
								</div>
								<p className="text-yellow-700 mt-1">
									Estos elementos deben implementarse en el corto plazo para fortalecer el programa de cumplimiento.
								</p>
							</div>
						)}

						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-center">
								<DocumentMagnifyingGlassIcon className="h-5 w-5 text-blue-600 mr-2" />
								<span className="font-medium text-blue-800">Próximos pasos recomendados</span>
							</div>
							<ul className="text-blue-700 mt-2 space-y-1">
								<li>• Implementar contenido faltante de alta prioridad</li>
								<li>• Completar plantillas y guías de implementación</li>
								<li>• Desarrollar simulador de sanciones</li>
								<li>• Crear mapeo detallado de sistemas</li>
								<li>• Implementar procedimientos para menores</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default WebScraper
