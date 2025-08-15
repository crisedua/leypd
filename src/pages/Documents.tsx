import React, { useState, useMemo } from 'react'
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	DocumentArrowDownIcon,
	EyeIcon,
	TrashIcon,
	DocumentTextIcon,
	ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Document {
	id: string
	name: string
	description: string
	category: 'policy' | 'contract' | 'report' | 'dpia' | 'consent' | 'incident' | 'audit' | 'template' | 'evidence' | 'manual' | 'ropa'
	status: 'active' | 'draft' | 'archived' | 'pending_review' | 'under_review' | 'approved' | 'rejected'
	version: string
	uploadDate: string
	lastModified: string
	uploadedBy: string
	fileSize: string
	fileType: string
	expiryDate?: string
	tags: string[]
	evidenceType?: 'legal' | 'pending' | 'audit_ready' | 'compliance'
	accessLevel: 'owner' | 'dpo' | 'auditor' | 'user'
	downloadCount: number
	viewCount: number
	stageId?: string
	stageName?: string
	lifecycleStatus: 'created' | 'in_review' | 'approved' | 'published' | 'archived'
	reviewer?: string
	reviewDate?: string
	reviewNotes?: string
	nextReviewDate?: string
	complianceStatus: 'compliant' | 'non_compliant' | 'pending_assessment' | 'requires_updates'
}

const mockDocuments: Document[] = [
	{
		id: '1',
		name: 'Política de Privacidad v2.1',
		description: 'Política de privacidad actualizada según Ley 21.719',
		category: 'policy',
		status: 'approved',
		version: '2.1',
		uploadDate: '2024-01-15',
		lastModified: '2024-01-15',
		uploadedBy: 'Ana Silva',
		fileSize: '2.3 MB',
		fileType: 'PDF',
		expiryDate: '2025-01-15',
		tags: ['privacidad', 'ley 21.719', 'clientes'],
		evidenceType: 'legal',
		accessLevel: 'user',
		downloadCount: 45,
		viewCount: 120,
		stageId: 'fase0',
		stageName: 'Fase 0 - Gobernanza & Arranque',
		lifecycleStatus: 'published',
		reviewer: 'Carlos DPO',
		reviewDate: '2024-01-14',
		complianceStatus: 'compliant'
	},
	{
		id: '2',
		name: 'DPIA - Sistema CRM',
		description: 'Evaluación de impacto en la protección de datos para CRM',
		category: 'dpia',
		status: 'under_review',
		version: '1.0',
		uploadDate: '2024-01-10',
		lastModified: '2024-01-10',
		uploadedBy: 'Carlos Rodríguez',
		fileSize: '5.7 MB',
		fileType: 'PDF',
		tags: ['dpia', 'crm', 'transferencias'],
		evidenceType: 'audit_ready',
		accessLevel: 'dpo',
		downloadCount: 12,
		viewCount: 35,
		stageId: 'fase3',
		stageName: 'Fase 3 - DPIA & Consentimiento',
		lifecycleStatus: 'in_review',
		reviewer: 'Ana Silva',
		reviewDate: '2024-01-12',
		reviewNotes: 'Requiere actualización de medidas de mitigación',
		complianceStatus: 'requires_updates'
	},
	{
		id: '3',
		name: 'Contrato DPA - Proveedor Brasil',
		description: 'Acuerdo de procesamiento de datos con proveedor en Brasil',
		category: 'contract',
		status: 'approved',
		version: '1.2',
		uploadDate: '2024-01-08',
		lastModified: '2024-01-12',
		uploadedBy: 'Laura Martínez',
		fileSize: '1.8 MB',
		fileType: 'PDF',
		expiryDate: '2026-01-08',
		tags: ['dpa', 'brasil', 'transferencias'],
		evidenceType: 'legal',
		accessLevel: 'dpo',
		downloadCount: 8,
		viewCount: 22,
		stageId: 'fase4',
		stageName: 'Fase 4 - Incidentes & Vendors',
		lifecycleStatus: 'published',
		reviewer: 'Carlos DPO',
		reviewDate: '2024-01-11',
		complianceStatus: 'compliant'
	},
	{
		id: '4',
		name: 'Registro de Actividades de Tratamiento',
		description: 'RoPA completo de la organización',
		category: 'ropa',
		status: 'draft',
		version: '1.0',
		uploadDate: '2024-01-20',
		lastModified: '2024-01-20',
		uploadedBy: 'Carlos Rodríguez',
		fileSize: '3.2 MB',
		fileType: 'PDF',
		tags: ['ropa', 'tratamiento', 'datos'],
		evidenceType: 'compliance',
		accessLevel: 'dpo',
		downloadCount: 5,
		viewCount: 18,
		stageId: 'fase1',
		stageName: 'Fase 1 - Descubrimiento & RoPA',
		lifecycleStatus: 'created',
		complianceStatus: 'pending_assessment'
	},
	{
		id: '5',
		name: 'Manual DPO',
		description: 'Guía de procedimientos para el Delegado de Protección de Datos',
		category: 'manual',
		status: 'approved',
		version: '1.0',
		uploadDate: '2024-01-05',
		lastModified: '2024-01-05',
		uploadedBy: 'Ana Silva',
		fileSize: '1.5 MB',
		fileType: 'PDF',
		tags: ['dpo', 'procedimientos', 'manual'],
		evidenceType: 'compliance',
		accessLevel: 'dpo',
		downloadCount: 25,
		viewCount: 67,
		stageId: 'fase0',
		stageName: 'Fase 0 - Gobernanza & Arranque',
		lifecycleStatus: 'published',
		reviewer: 'Carlos DPO',
		reviewDate: '2024-01-04',
		complianceStatus: 'compliant'
	}
]

const Documents: React.FC = () => {
	const [documents, setDocuments] = useState<Document[]>(mockDocuments)
	const [searchTerm, setSearchTerm] = useState('')
	const [categoryFilter, setCategoryFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [stageFilter, setStageFilter] = useState<string>('all')
	const [lifecycleFilter, setLifecycleFilter] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'list' | 'stages'>('list')
	const [showUploadModal, setShowUploadModal] = useState(false)
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
	const [showStageModal, setShowStageModal] = useState(false)

	const filteredDocuments = useMemo(() => {
		return documents.filter(doc => {
			const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
			const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
			const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
			const matchesStage = stageFilter === 'all' || doc.stageId === stageFilter
			const matchesLifecycle = lifecycleFilter === 'all' || doc.lifecycleStatus === lifecycleFilter
			return matchesSearch && matchesCategory && matchesStatus && matchesStage && matchesLifecycle
		})
	}, [documents, searchTerm, categoryFilter, statusFilter, stageFilter, lifecycleFilter])

	const stats = useMemo(() => {
		const total = documents.length
		const active = documents.filter(d => d.status === 'approved' || d.status === 'active').length
		const expiring = documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
		const evidenceReady = documents.filter(d => d.evidenceType === 'audit_ready').length
		const inReview = documents.filter(d => d.lifecycleStatus === 'in_review').length
		const compliant = documents.filter(d => d.complianceStatus === 'compliant').length
		return { total, active, expiring, evidenceReady, inReview, compliant }
	}, [documents])

	const stages = useMemo(() => {
		const stageMap = new Map<string, { name: string; documents: Document[]; count: number }>()
		documents.forEach(doc => {
			if (doc.stageId && doc.stageName) {
				if (!stageMap.has(doc.stageId)) {
					stageMap.set(doc.stageId, { name: doc.stageName, documents: [], count: 0 })
				}
				stageMap.get(doc.stageId)!.documents.push(doc)
				stageMap.get(doc.stageId)!.count++
			}
		})
		return Array.from(stageMap.values())
	}, [documents])

	const handleDeleteDocument = (id: string) => {
		setDocuments(prev => prev.filter(doc => doc.id !== id))
		toast.success('Documento eliminado')
	}

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			approved: { color: 'bg-green-100 text-green-800', text: 'Aprobado' },
			draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Borrador' },
			archived: { color: 'bg-gray-100 text-gray-800', text: 'Archivado' },
			pending_review: { color: 'bg-orange-100 text-orange-800', text: 'Pendiente' },
			under_review: { color: 'bg-blue-100 text-blue-800', text: 'En Revisión' },
			rejected: { color: 'bg-red-100 text-red-800', text: 'Rechazado' }
		}
		const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
		return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>
	}

	const getCategoryLabel = (category: string) => {
		const categoryLabels = {
			policy: 'Política',
			contract: 'Contrato',
			report: 'Reporte',
			dpia: 'DPIA',
			consent: 'Consentimiento',
			incident: 'Incidente',
			audit: 'Auditoría',
			template: 'Plantilla',
			evidence: 'Evidencia',
			manual: 'Manual',
			ropa: 'RoPA'
		}
		return categoryLabels[category as keyof typeof categoryLabels] || category
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
					<p className="text-gray-600">Repositorio centralizado de documentos organizados por etapas del programa</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex items-center bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode('list')}
							className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
								viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
							}`}
						>
							Lista
						</button>
						<button
							onClick={() => setViewMode('stages')}
							className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
								viewMode === 'stages' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
							}`}
						>
							Por Etapas
						</button>
					</div>
					<button
						onClick={() => setShowUploadModal(true)}
						className="btn-primary inline-flex items-center gap-2"
					>
						<ArrowUpTrayIcon className="h-4 w-4" />
						Subir Documento
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-900">{stats.total}</div>
					<div className="text-sm text-gray-600">Total Documentos</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					<div className="text-sm text-gray-600">Aprobados</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
					<div className="text-sm text-gray-600">En Revisión</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-purple-600">{stats.compliant}</div>
					<div className="text-sm text-gray-600">Cumplientes</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-orange-600">{stats.expiring}</div>
					<div className="text-sm text-gray-600">Por Vencer (30 días)</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-indigo-600">{stats.evidenceReady}</div>
					<div className="text-sm text-gray-600">Listos para Auditoría</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar por nombre, descripción o etiquetas..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<FunnelIcon className="h-4 w-4 text-gray-400" />
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todas las categorías</option>
							<option value="policy">Política</option>
							<option value="contract">Contrato</option>
							<option value="report">Reporte</option>
							<option value="dpia">DPIA</option>
							<option value="consent">Consentimiento</option>
							<option value="incident">Incidente</option>
							<option value="audit">Auditoría</option>
							<option value="template">Plantilla</option>
							<option value="evidence">Evidencia</option>
							<option value="manual">Manual</option>
							<option value="ropa">RoPA</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todos los estados</option>
							<option value="approved">Aprobado</option>
							<option value="draft">Borrador</option>
							<option value="archived">Archivado</option>
							<option value="pending_review">Pendiente</option>
							<option value="under_review">En Revisión</option>
							<option value="rejected">Rechazado</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={stageFilter}
							onChange={(e) => setStageFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todas las etapas</option>
							<option value="fase0">Fase 0 - Gobernanza</option>
							<option value="fase1">Fase 1 - Descubrimiento</option>
							<option value="fase2">Fase 2 - DSAR Hub</option>
							<option value="fase3">Fase 3 - DPIA</option>
							<option value="fase4">Fase 4 - Incidentes</option>
							<option value="fase5">Fase 5 - Formación</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={lifecycleFilter}
							onChange={(e) => setLifecycleFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todo el ciclo de vida</option>
							<option value="created">Creado</option>
							<option value="in_review">En Revisión</option>
							<option value="approved">Aprobado</option>
							<option value="published">Publicado</option>
							<option value="archived">Archivado</option>
						</select>
					</div>
				</div>
			</div>

			{/* Stage-based View */}
			{viewMode === 'stages' && (
				<div className="space-y-6">
					{stages.map((stage) => (
						<div key={stage.name} className="bg-white rounded-lg border overflow-hidden">
							<div className="bg-gray-50 px-6 py-4 border-b">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
										<p className="text-sm text-gray-600">{stage.count} documentos</p>
									</div>
									<button
										onClick={() => setShowStageModal(true)}
										className="text-primary-600 hover:text-primary-800 text-sm font-medium"
									>
										Ver todos
									</button>
								</div>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{stage.documents.slice(0, 6).map((doc) => (
										<div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
											<div className="flex items-start justify-between mb-2">
												<div className="flex-shrink-0 h-8 w-8">
													<div className="h-8 w-8 rounded bg-primary-100 flex items-center justify-center">
														<DocumentTextIcon className="h-4 w-4 text-primary-600" />
													</div>
												</div>
												{getStatusBadge(doc.status)}
											</div>
											<h4 className="font-medium text-gray-900 text-sm mb-1">{doc.name}</h4>
											<p className="text-xs text-gray-500 mb-2">{doc.description}</p>
											<div className="flex items-center justify-between text-xs text-gray-500">
												<span>v{doc.version}</span>
												<span>{doc.lifecycleStatus}</span>
											</div>
											<div className="flex items-center gap-2 mt-3">
												<button
													onClick={() => setSelectedDocument(doc)}
													className="text-primary-600 hover:text-primary-800 text-xs"
												>
													<EyeIcon className="h-3 w-3 inline mr-1" />
													Ver
												</button>
												<button className="text-green-600 hover:text-green-800 text-xs">
													<DocumentArrowDownIcon className="h-3 w-3 inline mr-1" />
													Descargar
												</button>
											</div>
										</div>
									))}
								</div>
								{stage.documents.length > 6 && (
									<div className="text-center mt-4">
										<button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
											Ver {stage.documents.length - 6} documentos más
										</button>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Documents List */}
			{viewMode === 'list' && (
				<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo de Vida</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Modificación</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredDocuments.map((doc) => (
								<tr key={doc.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
													<DocumentTextIcon className="h-5 w-5 text-primary-600" />
												</div>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{doc.name}</div>
												<div className="text-sm text-gray-500">{doc.description}</div>
												<div className="flex flex-wrap gap-1 mt-1">
													{doc.tags.slice(0, 2).map((tag, index) => (
														<span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
															{tag}
														</span>
													))}
													{doc.tags.length > 2 && (
														<span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
															+{doc.tags.length - 2}
														</span>
													)}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{doc.stageName ? (
											<span className="text-sm text-gray-900">{doc.stageName}</span>
										) : (
											<span className="text-sm text-gray-400">Sin etapa</span>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{getCategoryLabel(doc.category)}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(doc.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
											doc.lifecycleStatus === 'published' ? 'bg-green-100 text-green-800' :
											doc.lifecycleStatus === 'in_review' ? 'bg-blue-100 text-blue-800' :
											doc.lifecycleStatus === 'approved' ? 'bg-purple-100 text-purple-800' :
											doc.lifecycleStatus === 'created' ? 'bg-gray-100 text-gray-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
											{doc.lifecycleStatus === 'published' ? 'Publicado' :
											 doc.lifecycleStatus === 'in_review' ? 'En Revisión' :
											 doc.lifecycleStatus === 'approved' ? 'Aprobado' :
											 doc.lifecycleStatus === 'created' ? 'Creado' : 'Archivado'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										v{doc.version}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{doc.lastModified}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => setSelectedDocument(doc)}
												className="text-primary-600 hover:text-primary-900"
												title="Ver detalles"
											>
												<EyeIcon className="h-4 w-4" />
											</button>
											<button
												className="text-green-600 hover:text-green-900"
												title="Descargar"
											>
												<DocumentArrowDownIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteDocument(doc.id)}
												className="text-red-600 hover:text-red-900"
												title="Eliminar"
											>
												<TrashIcon className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filteredDocuments.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-500">No se encontraron documentos</div>
					</div>
				)}
			</div>
			)}

			{/* Upload Modal */}
			{showUploadModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-lg font-semibold mb-4">Subir Nuevo Documento</h2>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Documento</label>
										<input
											type="text"
											className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											placeholder="Ej: Política de Privacidad"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
										<select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
											<option value="policy">Política</option>
											<option value="contract">Contrato</option>
											<option value="report">Reporte</option>
											<option value="dpia">DPIA</option>
											<option value="consent">Consentimiento</option>
											<option value="incident">Incidente</option>
											<option value="audit">Auditoría</option>
											<option value="template">Plantilla</option>
											<option value="evidence">Evidencia</option>
											<option value="manual">Manual</option>
											<option value="ropa">RoPA</option>
										</select>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Etapa del Programa</label>
										<select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
											<option value="">Seleccionar etapa</option>
											<option value="fase0">Fase 0 - Gobernanza & Arranque</option>
											<option value="fase1">Fase 1 - Descubrimiento & RoPA</option>
											<option value="fase2">Fase 2 - DSAR Hub MVP</option>
											<option value="fase3">Fase 3 - DPIA & Consentimiento</option>
											<option value="fase4">Fase 4 - Incidentes & Vendors</option>
											<option value="fase5">Fase 5 - Formación & Auditoría</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
										<select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
											<option value="draft">Borrador</option>
											<option value="pending_review">Pendiente de Revisión</option>
											<option value="under_review">En Revisión</option>
										</select>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
									<textarea
										rows={3}
										className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										placeholder="Descripción del documento..."
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
										<div className="mt-2">
											<span className="text-sm text-gray-600">Arrastra y suelta el archivo aquí, o</span>
											<button className="text-primary-600 hover:text-primary-500 font-medium">selecciona un archivo</button>
										</div>
									</div>
								</div>
								<div className="flex justify-end gap-3 pt-4">
									<button
										onClick={() => setShowUploadModal(false)}
										className="btn-secondary"
									>
										Cancelar
									</button>
									<button className="btn-primary">
										Subir Documento
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Stage Modal */}
			{showStageModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-start mb-6">
								<h2 className="text-xl font-semibold">Documentos por Etapas</h2>
								<button
									onClick={() => setShowStageModal(false)}
									className="text-gray-400 hover:text-gray-600"
								>
									×
								</button>
							</div>
							<div className="space-y-6">
								{stages.map((stage) => (
									<div key={stage.name} className="border rounded-lg overflow-hidden">
										<div className="bg-gray-50 px-4 py-3 border-b">
											<h3 className="text-lg font-medium text-gray-900">{stage.name}</h3>
											<p className="text-sm text-gray-600">{stage.count} documentos</p>
										</div>
										<div className="p-4">
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{stage.documents.map((doc) => (
													<div key={doc.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
														<div className="flex items-start justify-between mb-2">
															<div className="flex-shrink-0 h-6 w-6">
																<div className="h-6 w-6 rounded bg-primary-100 flex items-center justify-center">
																	<DocumentTextIcon className="h-3 w-3 text-primary-600" />
																</div>
															</div>
															{getStatusBadge(doc.status)}
														</div>
														<h4 className="font-medium text-gray-900 text-sm mb-1">{doc.name}</h4>
														<p className="text-xs text-gray-500 mb-2">{doc.description}</p>
														<div className="flex items-center justify-between text-xs text-gray-500 mb-2">
															<span>v{doc.version}</span>
															<span>{doc.lifecycleStatus}</span>
														</div>
														<div className="flex items-center gap-2">
															<button
																onClick={() => {
																	setSelectedDocument(doc)
																	setShowStageModal(false)
																}}
																className="text-primary-600 hover:text-primary-800 text-xs"
															>
																<EyeIcon className="h-3 w-3 inline mr-1" />
																Ver
															</button>
															<button className="text-green-600 hover:text-green-800 text-xs">
																<DocumentArrowDownIcon className="h-3 w-3 inline mr-1" />
																Descargar
															</button>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* View Document Modal */}
			{selectedDocument && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-start mb-4">
								<h2 className="text-lg font-semibold">Detalles del Documento</h2>
								<button
									onClick={() => setSelectedDocument(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									×
								</button>
							</div>
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
										<dl className="space-y-3">
											<div>
												<dt className="text-sm font-medium text-gray-500">Nombre</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.name}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Descripción</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.description}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Etapa</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.stageName || 'Sin etapa asignada'}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Categoría</dt>
												<dd className="text-sm text-gray-900">{getCategoryLabel(selectedDocument.category)}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Estado</dt>
												<dd className="text-sm text-gray-900">{getStatusBadge(selectedDocument.status)}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Ciclo de Vida</dt>
												<dd className="text-sm text-gray-900">
													<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
														selectedDocument.lifecycleStatus === 'published' ? 'bg-green-100 text-green-800' :
														selectedDocument.lifecycleStatus === 'in_review' ? 'bg-blue-100 text-blue-800' :
														selectedDocument.lifecycleStatus === 'approved' ? 'bg-purple-100 text-purple-800' :
														selectedDocument.lifecycleStatus === 'created' ? 'bg-gray-100 text-gray-800' :
														'bg-yellow-100 text-yellow-800'
													}`}>
														{selectedDocument.lifecycleStatus === 'published' ? 'Publicado' :
														 selectedDocument.lifecycleStatus === 'in_review' ? 'En Revisión' :
														 selectedDocument.lifecycleStatus === 'approved' ? 'Aprobado' :
														 selectedDocument.lifecycleStatus === 'created' ? 'Creado' : 'Archivado'}
													</span>
												</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Estado de Cumplimiento</dt>
												<dd className="text-sm text-gray-900">
													<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
														selectedDocument.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
														selectedDocument.complianceStatus === 'non_compliant' ? 'bg-red-100 text-red-800' :
														selectedDocument.complianceStatus === 'pending_assessment' ? 'bg-yellow-100 text-yellow-800' :
														'bg-orange-100 text-orange-800'
													}`}>
														{selectedDocument.complianceStatus === 'compliant' ? 'Cumpliente' :
														 selectedDocument.complianceStatus === 'non_compliant' ? 'No Cumpliente' :
														 selectedDocument.complianceStatus === 'pending_assessment' ? 'Pendiente de Evaluación' :
														 'Requiere Actualizaciones'}
													</span>
												</dd>
											</div>
										</dl>
									</div>
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">Metadatos</h3>
										<dl className="space-y-3">
											<div>
												<dt className="text-sm font-medium text-gray-500">Versión</dt>
												<dd className="text-sm text-gray-900">v{selectedDocument.version}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Subido por</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.uploadedBy}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Fecha de Subida</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.uploadDate}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Última Modificación</dt>
												<dd className="text-sm text-gray-900">{selectedDocument.lastModified}</dd>
											</div>
											{selectedDocument.reviewer && (
												<div>
													<dt className="text-sm font-medium text-gray-500">Revisor</dt>
													<dd className="text-sm text-gray-900">{selectedDocument.reviewer}</dd>
												</div>
											)}
											{selectedDocument.reviewDate && (
												<div>
													<dt className="text-sm font-medium text-gray-500">Fecha de Revisión</dt>
													<dd className="text-sm text-gray-900">{selectedDocument.reviewDate}</dd>
												</div>
											)}
											{selectedDocument.nextReviewDate && (
												<div>
													<dt className="text-sm font-medium text-gray-500">Próxima Revisión</dt>
													<dd className="text-sm text-gray-900">{selectedDocument.nextReviewDate}</dd>
												</div>
											)}
										</dl>
									</div>
								</div>
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h3>
									<div className="flex flex-wrap gap-2">
										{selectedDocument.tags.map((tag, index) => (
											<span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
												{tag}
											</span>
										))}
									</div>
								</div>
								{selectedDocument.reviewNotes && (
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">Notas de Revisión</h3>
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
											<p className="text-sm text-yellow-800">{selectedDocument.reviewNotes}</p>
										</div>
									</div>
								)}
								<div className="flex justify-between items-center pt-4 border-t">
									<div className="flex items-center gap-4 text-sm text-gray-500">
										<span>Descargas: {selectedDocument.downloadCount}</span>
										<span>Vistas: {selectedDocument.viewCount}</span>
									</div>
									<div className="flex gap-2">
										<button className="btn-secondary inline-flex items-center gap-2">
											<DocumentArrowDownIcon className="h-4 w-4" />
											Descargar
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Documents


