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
	category: 'policy' | 'contract' | 'report' | 'dpia' | 'consent' | 'incident' | 'audit' | 'template' | 'evidence'
	status: 'active' | 'draft' | 'archived' | 'pending_review'
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
}

const mockDocuments: Document[] = [
	{
		id: '1',
		name: 'Política de Privacidad v2.1',
		description: 'Política de privacidad actualizada según Ley 21.719',
		category: 'policy',
		status: 'active',
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
		viewCount: 120
	},
	{
		id: '2',
		name: 'DPIA - Sistema CRM',
		description: 'Evaluación de impacto en la protección de datos para CRM',
		category: 'dpia',
		status: 'active',
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
		viewCount: 35
	},
	{
		id: '3',
		name: 'Contrato DPA - Proveedor Brasil',
		description: 'Acuerdo de procesamiento de datos con proveedor en Brasil',
		category: 'contract',
		status: 'active',
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
		viewCount: 22
	}
]

const Documents: React.FC = () => {
	const [documents, setDocuments] = useState<Document[]>(mockDocuments)
	const [searchTerm, setSearchTerm] = useState('')
	const [categoryFilter, setCategoryFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [showUploadModal, setShowUploadModal] = useState(false)
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

	const filteredDocuments = useMemo(() => {
		return documents.filter(doc => {
			const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
			const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
			const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
			return matchesSearch && matchesCategory && matchesStatus
		})
	}, [documents, searchTerm, categoryFilter, statusFilter])

	const stats = useMemo(() => {
		const total = documents.length
		const active = documents.filter(d => d.status === 'active').length
		const expiring = documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
		const evidenceReady = documents.filter(d => d.evidenceType === 'audit_ready').length
		return { total, active, expiring, evidenceReady }
	}, [documents])

	const handleDeleteDocument = (id: string) => {
		setDocuments(prev => prev.filter(doc => doc.id !== id))
		toast.success('Documento eliminado')
	}

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			active: { color: 'bg-green-100 text-green-800', text: 'Activo' },
			draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Borrador' },
			archived: { color: 'bg-gray-100 text-gray-800', text: 'Archivado' },
			pending_review: { color: 'bg-orange-100 text-orange-800', text: 'Pendiente' }
		}
		const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
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
			evidence: 'Evidencia'
		}
		return categoryLabels[category as keyof typeof categoryLabels] || category
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
					<p className="text-gray-600">Repositorio centralizado de documentos de privacidad y protección de datos</p>
				</div>
				<button
					onClick={() => setShowUploadModal(true)}
					className="btn-primary inline-flex items-center gap-2"
				>
					<ArrowUpTrayIcon className="h-4 w-4" />
					Subir Documento
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-900">{stats.total}</div>
					<div className="text-sm text-gray-600">Total Documentos</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					<div className="text-sm text-gray-600">Activos</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-orange-600">{stats.expiring}</div>
					<div className="text-sm text-gray-600">Por Vencer (30 días)</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-blue-600">{stats.evidenceReady}</div>
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
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todos los estados</option>
							<option value="active">Activo</option>
							<option value="draft">Borrador</option>
							<option value="archived">Archivado</option>
							<option value="pending_review">Pendiente</option>
						</select>
					</div>
				</div>
			</div>

			{/* Documents List */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
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
										<div className="text-sm text-gray-900">{getCategoryLabel(doc.category)}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(doc.status)}
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
												<dt className="text-sm font-medium text-gray-500">Categoría</dt>
												<dd className="text-sm text-gray-900">{getCategoryLabel(selectedDocument.category)}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Estado</dt>
												<dd className="text-sm text-gray-900">{getStatusBadge(selectedDocument.status)}</dd>
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


