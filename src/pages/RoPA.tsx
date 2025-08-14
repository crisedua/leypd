import React, { useState, useMemo } from 'react'
import {
	PlusIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	DocumentArrowDownIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { RoPAEntry } from '../lib/supabase'

const mockRoPAEntries: RoPAEntry[] = [
	{
		id: '1',
		name: 'Sistema de Nómina',
		organizationName: 'Empresa ABC Ltda.',
		organizationContact: {
			email: 'contacto@empresaabc.cl',
			phone: '+56 2 2345 6789'
		},
		legalRepresentative: {
			name: 'Juan Pérez González',
			email: 'juan.perez@empresaabc.cl',
			phone: '+56 9 8765 4321'
		},
		dpoInfo: {
			name: 'María Silva Rodríguez',
			email: 'dpo@empresaabc.cl',
			phone: '+56 9 1234 5678'
		},
		purpose: 'Gestión de remuneraciones y beneficios laborales',
		legalBasis: 'Ejecución de contrato laboral',
		consentWithdrawal: 'Los empleados pueden retirar su consentimiento en cualquier momento, lo que puede afectar la continuidad de la relación laboral',
		dataSubjects: ['Empleados', 'Ex-empleados'],
		dataCategories: ['Datos personales', 'Datos laborales', 'Datos financieros'],
		sensitiveData: ['Datos de salud (licencias médicas)'],
		dataSource: 'direct',
		dataSourceDescription: 'Datos proporcionados directamente por los empleados',
		internationalTransfers: false,
		retentionPeriod: '7 años post-terminación',
		securityMeasures: ['Encriptación', 'Acceso restringido', 'Backup diario'],
		organizationalMeasures: ['Política de acceso por roles', 'Capacitación anual en seguridad'],
		automatedDecisions: false,
		changeHistory: [
			{
				date: '2024-01-15',
				user: 'Ana Silva',
				description: 'Actualización de medidas de seguridad'
			}
		],
		attachedDocuments: ['politica_nomina.pdf', 'contrato_empleado_template.pdf'],
		internalNotes: 'Sistema crítico para operaciones. Requiere revisión trimestral.',
		status: 'active',
		lastUpdated: '2024-01-15',
		owner: 'RRHH'
	},
	{
		id: '2',
		name: 'CRM Clientes',
		organizationName: 'Empresa ABC Ltda.',
		organizationContact: {
			email: 'contacto@empresaabc.cl',
			phone: '+56 2 2345 6789'
		},
		legalRepresentative: {
			name: 'Juan Pérez González',
			email: 'juan.perez@empresaabc.cl',
			phone: '+56 9 8765 4321'
		},
		purpose: 'Gestión de relaciones con clientes y ventas',
		legalBasis: 'Interés legítimo',
		consentWithdrawal: 'Los clientes pueden retirar su consentimiento en cualquier momento a través del portal web',
		dataSubjects: ['Clientes', 'Prospectos'],
		dataCategories: ['Datos de contacto', 'Historial de compras', 'Preferencias'],
		sensitiveData: [],
		dataSource: 'direct',
		dataSourceDescription: 'Datos proporcionados por los clientes durante el proceso de compra',
		internationalTransfers: true,
		transferDestinations: ['Estados Unidos', 'Brasil'],
		contractualMeasures: ['Cláusulas estándar de protección de datos', 'Acuerdos de procesamiento de datos'],
		retentionPeriod: '5 años post-última interacción',
		securityMeasures: ['Encriptación', 'Acceso por roles', 'Auditoría'],
		organizationalMeasures: ['Política de privacidad', 'Capacitación en protección de datos'],
		automatedDecisions: true,
		automatedDecisionsDescription: 'Sistema de scoring para recomendaciones de productos basado en historial de compras',
		changeHistory: [
			{
				date: '2024-01-10',
				user: 'Carlos Rodríguez',
				description: 'Implementación de transferencias internacionales'
			}
		],
		attachedDocuments: ['politica_privacidad.pdf', 'dpa_brasil.pdf'],
		internalNotes: 'Sistema con transferencias internacionales. Requiere revisión anual.',
		status: 'active',
		lastUpdated: '2024-01-10',
		owner: 'Ventas'
	},
	{
		id: '3',
		name: 'Sistema de Facturación',
		organizationName: 'Empresa ABC Ltda.',
		organizationContact: {
			email: 'contacto@empresaabc.cl',
			phone: '+56 2 2345 6789'
		},
		legalRepresentative: {
			name: 'Juan Pérez González',
			email: 'juan.perez@empresaabc.cl',
			phone: '+56 9 8765 4321'
		},
		purpose: 'Emisión y gestión de facturas electrónicas',
		legalBasis: 'Cumplimiento legal',
		dataSubjects: ['Clientes', 'Proveedores'],
		dataCategories: ['Datos fiscales', 'Datos financieros', 'Datos de contacto'],
		sensitiveData: [],
		dataSource: 'direct',
		dataSourceDescription: 'Datos proporcionados por clientes y proveedores',
		internationalTransfers: false,
		retentionPeriod: '10 años (requerimiento SII)',
		securityMeasures: ['Encriptación', 'Firma digital', 'Backup en la nube'],
		organizationalMeasures: ['Política de retención documental', 'Auditoría fiscal anual'],
		automatedDecisions: false,
		changeHistory: [
			{
				date: '2024-01-05',
				user: 'Laura Martínez',
				description: 'Actualización de períodos de retención según SII'
			}
		],
		attachedDocuments: ['politica_facturacion.pdf', 'manual_sii.pdf'],
		internalNotes: 'Sistema regulado por SII. Cumplimiento crítico.',
		status: 'active',
		lastUpdated: '2024-01-05',
		owner: 'Finanzas'
	}
]

const RoPA: React.FC = () => {
	const [entries, setEntries] = useState<RoPAEntry[]>(mockRoPAEntries)
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [showAddModal, setShowAddModal] = useState(false)
	const [selectedEntry, setSelectedEntry] = useState<RoPAEntry | null>(null)

	const filteredEntries = useMemo(() => {
		return entries.filter(entry => {
			const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				entry.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
				entry.owner.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
			return matchesSearch && matchesStatus
		})
	}, [entries, searchTerm, statusFilter])

	const stats = useMemo(() => {
		const total = entries.length
		const active = entries.filter(e => e.status === 'active').length
		const inactive = entries.filter(e => e.status === 'inactive').length
		const pending = entries.filter(e => e.status === 'pending_review').length
		return { total, active, inactive, pending }
	}, [entries])

	const handleAddEntry = (newEntry: Omit<RoPAEntry, 'id' | 'lastUpdated'>) => {
		const entry: RoPAEntry = {
			...newEntry,
			id: Date.now().toString(),
			lastUpdated: new Date().toISOString().split('T')[0]
		}
		setEntries(prev => [...prev, entry])
		setShowAddModal(false)
		toast.success('Entrada RoPA agregada exitosamente')
	}

	const handleDeleteEntry = (id: string) => {
		setEntries(prev => prev.filter(entry => entry.id !== id))
		toast.success('Entrada RoPA eliminada')
	}

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			active: { color: 'bg-green-100 text-green-800', text: 'Activo' },
			inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactivo' },
			pending_review: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' }
		}
		const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
		return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Registro de Actividades de Tratamiento (RoPA)</h1>
					<p className="text-gray-600">Gestiona el registro de todas las actividades de procesamiento de datos personales</p>
				</div>
				<button
					onClick={() => setShowAddModal(true)}
					className="btn-primary inline-flex items-center gap-2"
				>
					<PlusIcon className="h-4 w-4" />
					Nueva Actividad
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-900">{stats.total}</div>
					<div className="text-sm text-gray-600">Total Actividades</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					<div className="text-sm text-gray-600">Activas</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
					<div className="text-sm text-gray-600">Inactivas</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
					<div className="text-sm text-gray-600">Pendientes</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar por nombre, propósito o responsable..."
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
							<option value="active">Activo</option>
							<option value="inactive">Inactivo</option>
							<option value="pending_review">Pendiente</option>
						</select>
					</div>
					<button className="btn-secondary inline-flex items-center gap-2">
						<DocumentArrowDownIcon className="h-4 w-4" />
						Exportar
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Legal</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Actualización</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredEntries.map((entry) => (
								<tr key={entry.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">{entry.name}</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900 max-w-xs truncate">{entry.purpose}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{entry.legalBasis}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{entry.owner}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(entry.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{entry.lastUpdated}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => setSelectedEntry(entry)}
												className="text-primary-600 hover:text-primary-900"
											>
												<EyeIcon className="h-4 w-4" />
											</button>
											<button className="text-gray-600 hover:text-gray-900">
												<PencilIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteEntry(entry.id)}
												className="text-red-600 hover:text-red-900"
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
				{filteredEntries.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-500">No se encontraron actividades de tratamiento</div>
					</div>
				)}
			</div>

			{/* Add Entry Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-lg font-semibold mb-4">Nueva Actividad de Tratamiento</h2>
							<AddEntryForm onSubmit={handleAddEntry} onCancel={() => setShowAddModal(false)} />
						</div>
					</div>
				</div>
			)}

			{/* View Entry Modal */}
			{selectedEntry && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-start mb-4">
								<h2 className="text-lg font-semibold">Detalles de la Actividad</h2>
								<button
									onClick={() => setSelectedEntry(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									×
								</button>
							</div>
							<ViewEntryDetails entry={selectedEntry} />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

interface AddEntryFormProps {
	onSubmit: (entry: Omit<RoPAEntry, 'id' | 'lastUpdated'>) => void
	onCancel: () => void
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		name: '',
		purpose: '',
		legalBasis: '',
		dataCategories: '',
		dataSubjects: '',
		retentionPeriod: '',
		securityMeasures: '',
		status: 'active' as const,
		owner: ''
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({
			...formData,
			dataCategories: formData.dataCategories.split(',').map(s => s.trim()),
			dataSubjects: formData.dataSubjects.split(',').map(s => s.trim()),
			securityMeasures: formData.securityMeasures.split(',').map(s => s.trim()),
			// Add required fields with default values
			organizationName: 'Organización Demo',
			organizationContact: {
				email: 'contacto@empresa.cl',
				phone: '+56912345678'
			},
			legalRepresentative: {
				name: 'Representante Legal',
				email: 'legal@empresa.cl',
				phone: '+56912345678'
			},
			dataSource: 'direct',
			internationalTransfers: false,
			automatedDecisions: false,
			changeHistory: []
		})
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Actividad</label>
					<input
						type="text"
						required
						value={formData.name}
						onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
					<input
						type="text"
						required
						value={formData.owner}
						onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Propósito del Tratamiento</label>
				<textarea
					required
					rows={3}
					value={formData.purpose}
					onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Base Legal</label>
				<select
					required
					value={formData.legalBasis}
					onChange={(e) => setFormData(prev => ({ ...prev, legalBasis: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Seleccionar base legal</option>
					<option value="Consentimiento">Consentimiento</option>
					<option value="Ejecución de contrato">Ejecución de contrato</option>
					<option value="Cumplimiento legal">Cumplimiento legal</option>
					<option value="Interés legítimo">Interés legítimo</option>
					<option value="Protección de intereses vitales">Protección de intereses vitales</option>
					<option value="Interés público">Interés público</option>
				</select>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Categorías de Datos (separadas por comas)</label>
					<input
						type="text"
						required
						value={formData.dataCategories}
						onChange={(e) => setFormData(prev => ({ ...prev, dataCategories: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Datos personales, Datos laborales, Datos financieros"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Sujetos de Datos (separados por comas)</label>
					<input
						type="text"
						required
						value={formData.dataSubjects}
						onChange={(e) => setFormData(prev => ({ ...prev, dataSubjects: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Empleados, Clientes, Proveedores"
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Período de Retención</label>
					<input
						type="text"
						required
						value={formData.retentionPeriod}
						onChange={(e) => setFormData(prev => ({ ...prev, retentionPeriod: e.target.value }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="5 años, 7 años post-terminación"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
					<select
						required
						value={formData.status}
						onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="active">Activo</option>
						<option value="inactive">Inactivo</option>
						<option value="pending_review">Pendiente de Revisión</option>
					</select>
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Medidas de Seguridad (separadas por comas)</label>
				<input
					type="text"
					required
					value={formData.securityMeasures}
					onChange={(e) => setFormData(prev => ({ ...prev, securityMeasures: e.target.value }))}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					placeholder="Encriptación, Acceso restringido, Backup diario"
				/>
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
					Crear Actividad
				</button>
			</div>
		</form>
	)
}

interface ViewEntryDetailsProps {
	entry: RoPAEntry
}

const ViewEntryDetails: React.FC<ViewEntryDetailsProps> = ({ entry }) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-sm font-medium text-gray-500">Nombre</dt>
							<dd className="text-sm text-gray-900">{entry.name}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Propósito</dt>
							<dd className="text-sm text-gray-900">{entry.purpose}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Base Legal</dt>
							<dd className="text-sm text-gray-900">{entry.legalBasis}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Responsable</dt>
							<dd className="text-sm text-gray-900">{entry.owner}</dd>
						</div>
					</dl>
				</div>
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">Detalles Técnicos</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-sm font-medium text-gray-500">Período de Retención</dt>
							<dd className="text-sm text-gray-900">{entry.retentionPeriod}</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Estado</dt>
							<dd className="text-sm text-gray-900">
								<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
									entry.status === 'active' ? 'bg-green-100 text-green-800' :
									entry.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
									'bg-yellow-100 text-yellow-800'
								}`}>
									{entry.status === 'active' ? 'Activo' : entry.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
								</span>
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
							<dd className="text-sm text-gray-900">{entry.lastUpdated}</dd>
						</div>
					</dl>
				</div>
			</div>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Categorías de Datos</h3>
				<div className="flex flex-wrap gap-2">
					{entry.dataCategories.map((category, index) => (
						<span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
							{category}
						</span>
					))}
				</div>
			</div>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Sujetos de Datos</h3>
				<div className="flex flex-wrap gap-2">
					{entry.dataSubjects.map((subject, index) => (
						<span key={index} className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
							{subject}
						</span>
					))}
				</div>
			</div>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Medidas de Seguridad</h3>
				<div className="flex flex-wrap gap-2">
					{entry.securityMeasures.map((measure, index) => (
						<span key={index} className="inline-flex px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
							{measure}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

export default RoPA


