import React, { useState, useMemo } from 'react'
import {
	PlusIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	DocumentArrowDownIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	ClockIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	DocumentTextIcon,
	UserIcon,
	EnvelopeIcon,
	PhoneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface DSARRequest {
	id: string
	requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
	status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold'
	priority: 'low' | 'medium' | 'high' | 'urgent'
	subjectName: string
	subjectEmail: string
	subjectPhone?: string
	subjectRUT?: string
	requestDate: string
	dueDate: string
	assignedTo?: string
	description: string
	requestedData?: string[]
	responseNotes?: string
	completionDate?: string
	evidenceFiles?: string[]
	legalBasis?: string
	verificationMethod?: string
	responseTemplate?: string
}

// Helper mappers & UI badges available module-wide
const getRequestTypeLabel = (type: string) => {
    const typeLabels = {
        access: 'Acceso',
        rectification: 'Rectificación',
        erasure: 'Eliminación',
        portability: 'Portabilidad',
        restriction: 'Limitación',
        objection: 'Oposición'
    }
    return (typeLabels as any)[type] || type
}

const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
        low: { color: 'bg-gray-100 text-gray-800', text: 'Baja' },
        medium: { color: 'bg-blue-100 text-blue-800', text: 'Media' },
        high: { color: 'bg-orange-100 text-orange-800', text: 'Alta' },
        urgent: { color: 'bg-red-100 text-red-800', text: 'Urgente' }
    }
    const config = (priorityConfig as any)[priority] || priorityConfig.medium
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>
}

const getStatusBadge = (status: string) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: ClockIcon },
        in_progress: { color: 'bg-blue-100 text-blue-800', text: 'En Progreso', icon: PencilIcon },
        completed: { color: 'bg-green-100 text-green-800', text: 'Completado', icon: CheckCircleIcon },
        rejected: { color: 'bg-red-100 text-red-800', text: 'Rechazado', icon: ExclamationTriangleIcon },
        on_hold: { color: 'bg-gray-100 text-gray-800', text: 'En Espera', icon: ClockIcon }
    }
    const config = (statusConfig as any)[status] || statusConfig.pending
    const Icon = config.icon
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
            <Icon className="h-3 w-3" />
            {config.text}
        </span>
    )
}

const mockDSARRequests: DSARRequest[] = [
	{
		id: '1',
		requestType: 'access',
		status: 'in_progress',
		priority: 'high',
		subjectName: 'María González',
		subjectEmail: 'maria.gonzalez@email.com',
		subjectPhone: '+56 9 1234 5678',
		subjectRUT: '12.345.678-9',
		requestDate: '2024-01-15',
		dueDate: '2024-02-14',
		assignedTo: 'Ana Silva',
		description: 'Solicita acceso a todos los datos personales almacenados en el sistema CRM',
		requestedData: ['Datos de contacto', 'Historial de compras', 'Preferencias'],
		verificationMethod: 'Verificación por email',
		responseTemplate: 'template_access_response'
	},
	{
		id: '2',
		requestType: 'rectification',
		status: 'pending',
		priority: 'medium',
		subjectName: 'Carlos Rodríguez',
		subjectEmail: 'carlos.rodriguez@email.com',
		subjectRUT: '98.765.432-1',
		requestDate: '2024-01-16',
		dueDate: '2024-02-15',
		description: 'Solicita corrección de dirección postal en el sistema de facturación',
		verificationMethod: 'Verificación por documento',
		responseTemplate: 'template_rectification_response'
	},
	{
		id: '3',
		requestType: 'erasure',
		status: 'completed',
		priority: 'urgent',
		subjectName: 'Laura Martínez',
		subjectEmail: 'laura.martinez@email.com',
		subjectPhone: '+56 9 8765 4321',
		requestDate: '2024-01-10',
		dueDate: '2024-02-09',
		assignedTo: 'Ana Silva',
		completionDate: '2024-01-25',
		description: 'Solicita eliminación completa de datos personales por cese de relación comercial',
		legalBasis: 'Derecho al olvido - Artículo 12 Ley 21.719',
		verificationMethod: 'Verificación por email',
		responseTemplate: 'template_erasure_response',
		evidenceFiles: ['erasure_confirmation.pdf', 'data_deletion_log.pdf']
	}
]

const DSARHub: React.FC = () => {
	const [requests, setRequests] = useState<DSARRequest[]>(mockDSARRequests)
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [typeFilter, setTypeFilter] = useState<string>('all')
	const [priorityFilter, setPriorityFilter] = useState<string>('all')
	const [showAddModal, setShowAddModal] = useState(false)
	const [selectedRequest, setSelectedRequest] = useState<DSARRequest | null>(null)

	const filteredRequests = useMemo(() => {
		return requests.filter(request => {
			const matchesSearch = request.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.subjectEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.description.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesStatus = statusFilter === 'all' || request.status === statusFilter
			const matchesType = typeFilter === 'all' || request.requestType === typeFilter
			const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
			return matchesSearch && matchesStatus && matchesType && matchesPriority
		})
	}, [requests, searchTerm, statusFilter, typeFilter, priorityFilter])

	const stats = useMemo(() => {
		const total = requests.length
		const pending = requests.filter(r => r.status === 'pending').length
		const inProgress = requests.filter(r => r.status === 'in_progress').length
		const completed = requests.filter(r => r.status === 'completed').length
		const overdue = requests.filter(r => new Date(r.dueDate) < new Date() && r.status !== 'completed').length
		return { total, pending, inProgress, completed, overdue }
	}, [requests])

	const handleAddRequest = (newRequest: Omit<DSARRequest, 'id' | 'requestDate'>) => {
		const request: DSARRequest = {
			...newRequest,
			id: Date.now().toString(),
			requestDate: new Date().toISOString().split('T')[0]
		}
		setRequests(prev => [...prev, request])
		setShowAddModal(false)
		toast.success('Solicitud DSAR creada exitosamente')
	}

	const handleUpdateStatus = (id: string, status: DSARRequest['status']) => {
		setRequests(prev => prev.map(req => 
			req.id === id 
				? { ...req, status, completionDate: status === 'completed' ? new Date().toISOString().split('T')[0] : req.completionDate }
				: req
		))
		toast.success('Estado actualizado')
	}

	const handleDeleteRequest = (id: string) => {
		setRequests(prev => prev.filter(request => request.id !== id))
		toast.success('Solicitud DSAR eliminada')
	}

	const generateEvidenceBundle = (request: DSARRequest) => {
		// Simulate evidence bundle generation
		toast.success('Bundle de evidencia generado exitosamente')
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">DSAR Hub - Solicitudes de Derechos ARCO</h1>
					<p className="text-gray-600">Gestiona las solicitudes de derechos de acceso, rectificación, cancelación y oposición</p>
				</div>
				<button
					onClick={() => setShowAddModal(true)}
					className="btn-primary inline-flex items-center gap-2"
				>
					<PlusIcon className="h-4 w-4" />
					Nueva Solicitud
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-900">{stats.total}</div>
					<div className="text-sm text-gray-600">Total Solicitudes</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
					<div className="text-sm text-gray-600">Pendientes</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
					<div className="text-sm text-gray-600">En Progreso</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">{stats.completed}</div>
					<div className="text-sm text-gray-600">Completadas</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
					<div className="text-sm text-gray-600">Vencidas</div>
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
								placeholder="Buscar por nombre, email o descripción..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<FunnelIcon className="h-4 w-4 text-gray-400" />
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todos los estados</option>
							<option value="pending">Pendiente</option>
							<option value="in_progress">En Progreso</option>
							<option value="completed">Completado</option>
							<option value="rejected">Rechazado</option>
							<option value="on_hold">En Espera</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todos los tipos</option>
							<option value="access">Acceso</option>
							<option value="rectification">Rectificación</option>
							<option value="erasure">Eliminación</option>
							<option value="portability">Portabilidad</option>
							<option value="restriction">Limitación</option>
							<option value="objection">Oposición</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={priorityFilter}
							onChange={(e) => setPriorityFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="all">Todas las prioridades</option>
							<option value="low">Baja</option>
							<option value="medium">Media</option>
							<option value="high">Alta</option>
							<option value="urgent">Urgente</option>
						</select>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredRequests.map((request) => (
								<tr key={request.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
													<UserIcon className="h-5 w-5 text-primary-600" />
												</div>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{request.subjectName}</div>
												<div className="text-sm text-gray-500">{request.subjectEmail}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{getRequestTypeLabel(request.requestType)}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(request.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getPriorityBadge(request.priority)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{request.dueDate}</div>
										{new Date(request.dueDate) < new Date() && request.status !== 'completed' && (
											<div className="text-xs text-red-600">Vencida</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{request.assignedTo || 'Sin asignar'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => setSelectedRequest(request)}
												className="text-primary-600 hover:text-primary-900"
												title="Ver detalles"
											>
												<EyeIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => generateEvidenceBundle(request)}
												className="text-green-600 hover:text-green-900"
												title="Generar bundle de evidencia"
											>
												<DocumentArrowDownIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteRequest(request.id)}
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
				{filteredRequests.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-500">No se encontraron solicitudes DSAR</div>
					</div>
				)}
			</div>

			{/* Add Request Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-lg font-semibold mb-4">Nueva Solicitud DSAR</h2>
							<AddRequestForm onSubmit={handleAddRequest} onCancel={() => setShowAddModal(false)} />
						</div>
					</div>
				</div>
			)}

			{/* View Request Modal */}
			{selectedRequest && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-start mb-4">
								<h2 className="text-lg font-semibold">Detalles de la Solicitud DSAR</h2>
								<button
									onClick={() => setSelectedRequest(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									×
								</button>
							</div>
							<ViewRequestDetails 
								request={selectedRequest} 
								onUpdateStatus={handleUpdateStatus}
								onGenerateBundle={generateEvidenceBundle}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

interface AddRequestFormProps {
	onSubmit: (request: Omit<DSARRequest, 'id' | 'requestDate'>) => void
	onCancel: () => void
}

const AddRequestForm: React.FC<AddRequestFormProps> = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		requestType: 'access' as DSARRequest['requestType'],
		priority: 'medium' as DSARRequest['priority'],
		subjectName: '',
		subjectEmail: '',
		subjectPhone: '',
		subjectRUT: '',
		dueDate: '',
		assignedTo: '',
		description: '',
		requestedData: '',
		verificationMethod: 'Verificación por email',
		responseTemplate: ''
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({
			...formData,
            status: 'pending',
			requestedData: formData.requestedData ? formData.requestedData.split(',').map(s => s.trim()) : undefined,
			responseTemplate: formData.responseTemplate || `template_${formData.requestType}_response`
		})
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Solicitud</label>
					<select
						required
						value={formData.requestType}
						onChange={(e) => setFormData(prev => ({ ...prev, requestType: e.target.value as any }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="access">Acceso</option>
						<option value="rectification">Rectificación</option>
						<option value="erasure">Eliminación</option>
						<option value="portability">Portabilidad</option>
						<option value="restriction">Limitación</option>
						<option value="objection">Oposición</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
					<select
						required
						value={formData.priority}
						onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="low">Baja</option>
						<option value="medium">Media</option>
						<option value="high">Alta</option>
						<option value="urgent">Urgente</option>
					</select>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Solicitante</label>
					<input
						type="text"
						required
						value={formData.subjectName}
						onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						required
						value={formData.subjectEmail}
						onChange={(e) => setFormData(prev => ({ ...prev, subjectEmail: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
					<input
						type="tel"
						value={formData.subjectPhone}
						onChange={(e) => setFormData(prev => ({ ...prev, subjectPhone: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">RUT (opcional)</label>
					<input
						type="text"
						value={formData.subjectRUT}
						onChange={(e) => setFormData(prev => ({ ...prev, subjectRUT: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
					<input
						type="date"
						required
						value={formData.dueDate}
						onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
					<input
						type="text"
						value={formData.assignedTo}
						onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Nombre del responsable"
					/>
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Solicitud</label>
				<textarea
					required
					rows={3}
					value={formData.description}
					onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Datos Solicitados (separados por comas)</label>
				<input
					type="text"
					value={formData.requestedData}
					onChange={(e) => setFormData(prev => ({ ...prev, requestedData: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					placeholder="Datos de contacto, Historial de compras, Preferencias"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Método de Verificación</label>
				<select
					required
					value={formData.verificationMethod}
					onChange={(e) => setFormData(prev => ({ ...prev, verificationMethod: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="Verificación por email">Verificación por email</option>
					<option value="Verificación por documento">Verificación por documento</option>
					<option value="Verificación por teléfono">Verificación por teléfono</option>
					<option value="Verificación presencial">Verificación presencial</option>
				</select>
			</div>
			<div className="flex justify-end gap-3 pt-4">
				<button
					type="button"
					onClick={onCancel}
					className="btn-secondary"
				>
					Cancelar
				</button>
				<button
					type="submit"
					className="btn-primary"
				>
					Crear Solicitud
				</button>
			</div>
		</form>
	)
}

interface ViewRequestDetailsProps {
	request: DSARRequest
	onUpdateStatus: (id: string, status: DSARRequest['status']) => void
	onGenerateBundle: (request: DSARRequest) => void
}

const ViewRequestDetails: React.FC<ViewRequestDetailsProps> = ({ request, onUpdateStatus, onGenerateBundle }) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Información del Solicitante</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-sm font-medium text-gray-500">Nombre</dt>
							<dd className="text-sm text-gray-900">{request.subjectName}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Email</dt>
							<dd className="text-sm text-gray-900 flex items-center gap-2">
								<EnvelopeIcon className="h-4 w-4" />
								{request.subjectEmail}
							</dd>
						</div>
						{request.subjectPhone && (
							<div>
								<dt className="text-sm font-medium text-gray-500">Teléfono</dt>
								<dd className="text-sm text-gray-900 flex items-center gap-2">
									<PhoneIcon className="h-4 w-4" />
									{request.subjectPhone}
								</dd>
							</div>
						)}
						{request.subjectRUT && (
							<div>
								<dt className="text-sm font-medium text-gray-500">RUT</dt>
								<dd className="text-sm text-gray-900">{request.subjectRUT}</dd>
							</div>
						)}
					</dl>
				</div>
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solicitud</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-sm font-medium text-gray-500">Tipo</dt>
							<dd className="text-sm text-gray-900">{getRequestTypeLabel(request.requestType)}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Estado</dt>
							<dd className="text-sm text-gray-900">{getStatusBadge(request.status)}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Prioridad</dt>
							<dd className="text-sm text-gray-900">{getPriorityBadge(request.priority)}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Fecha de Solicitud</dt>
							<dd className="text-sm text-gray-900">{request.requestDate}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Fecha Límite</dt>
							<dd className="text-sm text-gray-900">{request.dueDate}</dd>
						</div>
						{request.assignedTo && (
							<div>
								<dt className="text-sm font-medium text-gray-500">Asignado a</dt>
								<dd className="text-sm text-gray-900">{request.assignedTo}</dd>
							</div>
						)}
					</dl>
				</div>
			</div>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
				<p className="text-sm text-gray-900">{request.description}</p>
			</div>
			{request.requestedData && request.requestedData.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Datos Solicitados</h3>
					<div className="flex flex-wrap gap-2">
						{request.requestedData.map((data, index) => (
							<span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
								{data}
							</span>
						))}
					</div>
				</div>
			)}
			{request.verificationMethod && (
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Método de Verificación</h3>
					<p className="text-sm text-gray-900">{request.verificationMethod}</p>
				</div>
			)}
			{request.legalBasis && (
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Base Legal</h3>
					<p className="text-sm text-gray-900">{request.legalBasis}</p>
				</div>
			)}
			{request.evidenceFiles && request.evidenceFiles.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Archivos de Evidencia</h3>
					<div className="flex flex-wrap gap-2">
						{request.evidenceFiles.map((file, index) => (
							<span key={index} className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
								<DocumentTextIcon className="h-4 w-4" />
								{file}
							</span>
						))}
					</div>
				</div>
			)}
			<div className="flex justify-between items-center pt-4 border-t">
				<div className="flex gap-2">
					<select
						value={request.status}
						onChange={(e) => onUpdateStatus(request.id, e.target.value as DSARRequest['status'])}
						className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="pending">Pendiente</option>
						<option value="in_progress">En Progreso</option>
						<option value="completed">Completado</option>
						<option value="rejected">Rechazado</option>
						<option value="on_hold">En Espera</option>
					</select>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => onGenerateBundle(request)}
						className="btn-secondary inline-flex items-center gap-2"
					>
						<DocumentArrowDownIcon className="h-4 w-4" />
						Generar Bundle
					</button>
				</div>
			</div>
		</div>
	)
}

export default DSARHub


