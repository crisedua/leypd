import React, { useMemo, useState } from 'react'

type ChecklistPhase =
	| 'Diagnóstico y Preparación Inicial'
	| 'Políticas y Procedimientos'
	| 'Organización y Responsabilidades'
	| 'Seguridad de la Información'
	| 'Transferencias Internacionales y Gestión de Proveedores'
	| 'Monitoreo Continuo y Cultura Organizacional'
type ItemStatus = 'to_do' | 'in_progress' | 'blocked' | 'done'

interface ChecklistItem {
	id: string
	phase: ChecklistPhase
	title: string
	assignee?: string
	dueDate?: string
	completedDate?: string
	status: ItemStatus
	notes?: string
	evidence?: { url?: string; fileName?: string; note?: string }
	priority?: 'high' | 'medium' | 'low'
}

const seed: ChecklistItem[] = [
	// Fase 1: Diagnóstico y Preparación Inicial
	{ id: 'f1-1', phase: 'Diagnóstico y Preparación Inicial', title: 'Identificar todos los flujos de datos personales en la empresa (clientes, empleados, proveedores, etc.)', status: 'to_do', priority: 'high' },
	{ id: 'f1-2', phase: 'Diagnóstico y Preparación Inicial', title: 'Elaborar un inventario completo de bases de datos y sistemas que almacenan datos personales', status: 'to_do', priority: 'high' },
	{ id: 'f1-3', phase: 'Diagnóstico y Preparación Inicial', title: 'Mapear procesos asociados al tratamiento de datos personales', status: 'to_do', priority: 'high' },
	{ id: 'f1-4', phase: 'Diagnóstico y Preparación Inicial', title: 'Realizar análisis de brechas de cumplimiento respecto a la nueva ley', status: 'to_do', priority: 'high' },
	{ id: 'f1-5', phase: 'Diagnóstico y Preparación Inicial', title: 'Crear y documentar el Registro de Actividades de Tratamiento (RAT)', status: 'to_do', priority: 'high' },
	
	// Additional Diagnostic Items (Opcional)
	{ id: 'f1-6', phase: 'Diagnóstico y Preparación Inicial', title: 'Evaluar base legal para cada flujo de datos (consentimiento, interés legítimo, obligación contractual, etc.)', status: 'to_do', priority: 'low' },
	{ id: 'f1-7', phase: 'Diagnóstico y Preparación Inicial', title: 'Mapear cómo cada proceso permite el ejercicio de derechos ARCO+ (acceso, rectificación, supresión, oposición, portabilidad)', status: 'to_do', priority: 'low' },
	{ id: 'f1-8', phase: 'Diagnóstico y Preparación Inicial', title: 'Inventariar todos los proveedores y procesadores de datos externos', status: 'to_do', priority: 'low' },
	{ id: 'f1-9', phase: 'Diagnóstico y Preparación Inicial', title: 'Evaluar transferencias internacionales de datos y cumplimiento de requisitos de transferencia', status: 'to_do', priority: 'low' },
	{ id: 'f1-10', phase: 'Diagnóstico y Preparación Inicial', title: 'Realizar Evaluación de Impacto en Protección de Datos (DPIA) para tratamientos de alto riesgo', status: 'to_do', priority: 'low' },
	{ id: 'f1-11', phase: 'Diagnóstico y Preparación Inicial', title: 'Analizar políticas de retención de datos y alinearlas con requisitos legales y de negocio', status: 'to_do', priority: 'low' },

	// Fase 2: Políticas y Procedimientos
	{ id: 'f2-1', phase: 'Políticas y Procedimientos', title: 'Redactar o actualizar la Política de Privacidad (alineada a la ley)', status: 'to_do', priority: 'high' },
	{ id: 'f2-2', phase: 'Políticas y Procedimientos', title: 'Publicar política de privacidad en todos los canales relevantes', status: 'to_do', priority: 'high' },
	{ id: 'f2-3', phase: 'Políticas y Procedimientos', title: 'Establecer procedimientos para gestión de derechos ARCO y portabilidad', status: 'to_do', priority: 'high' },
	{ id: 'f2-4', phase: 'Políticas y Procedimientos', title: 'Desarrollar protocolo para notificación y gestión de incidentes de seguridad', status: 'to_do', priority: 'high' },
	{ id: 'f2-5', phase: 'Políticas y Procedimientos', title: 'Elaborar manual interno de tratamiento de datos y instructivos para empleados', status: 'to_do', priority: 'medium' },
	{ id: 'f2-6', phase: 'Políticas y Procedimientos', title: 'Implementar procesos para obtención y gestión del consentimiento informado (libre, específico, informado y explícito)', status: 'to_do', priority: 'low' },
	{ id: 'f2-7', phase: 'Políticas y Procedimientos', title: 'Establecer mecanismos para registro y revocación de consentimientos en cualquier momento', status: 'to_do', priority: 'low' },
	{ id: 'f2-8', phase: 'Políticas y Procedimientos', title: 'Crear procedimientos para actualización periódica de políticas ante cambios legales o regulatorios', status: 'to_do', priority: 'low' },
	{ id: 'f2-9', phase: 'Políticas y Procedimientos', title: 'Implementar sistema de registros de cumplimiento para evidencia documental de auditorías', status: 'to_do', priority: 'low' },
	{ id: 'f2-10', phase: 'Políticas y Procedimientos', title: 'Establecer procedimientos para principio de minimización y limitación de finalidad del tratamiento', status: 'to_do', priority: 'low' },
	{ id: 'f2-11', phase: 'Políticas y Procedimientos', title: 'Desarrollar protocolos para atención de requerimientos de la Agencia de Protección de Datos', status: 'to_do', priority: 'low' },
	{ id: 'f2-12', phase: 'Políticas y Procedimientos', title: 'Implementar políticas de privacidad desde el diseño (Privacy by Design) en nuevos productos y procesos', status: 'to_do', priority: 'low' },

	// Fase 3: Organización y Responsabilidades
	{ id: 'f3-1', phase: 'Organización y Responsabilidades', title: 'Designar al Delegado de Protección de Datos (DPO), si corresponde', status: 'to_do', priority: 'high' },
	{ id: 'f3-2', phase: 'Organización y Responsabilidades', title: 'Notificar formalmente la designación del DPO y sus roles', status: 'to_do', priority: 'high' },
	{ id: 'f3-3', phase: 'Organización y Responsabilidades', title: 'Formar equipo interno responsable de cumplimiento', status: 'to_do', priority: 'high' },
	{ id: 'f3-4', phase: 'Organización y Responsabilidades', title: 'Capacitar a todo el personal en protección de datos y su rol', status: 'to_do', priority: 'medium' },
	{ id: 'f3-5', phase: 'Organización y Responsabilidades', title: 'Revisar, actualizar y firmar contratos con proveedores y encargados de tratamiento', status: 'to_do', priority: 'high' },
	{ id: 'f3-6', phase: 'Organización y Responsabilidades', title: 'Documentar el proceso de elección del DPO o fundamentos para no designarlo (para justificar ante fiscalización)', status: 'to_do', priority: 'high' },
	{ id: 'f3-7', phase: 'Organización y Responsabilidades', title: 'Definir roles y responsabilidades diferenciadas del equipo de cumplimiento por escrito', status: 'to_do', priority: 'high' },
	{ id: 'f3-8', phase: 'Organización y Responsabilidades', title: 'Implementar sistema de registro de capacitaciones realizadas y sus contenidos', status: 'to_do', priority: 'medium' },
	{ id: 'f3-9', phase: 'Organización y Responsabilidades', title: 'Establecer medidas para fomentar cultura de protección de datos en todos los niveles organizacionales', status: 'to_do', priority: 'medium' },
	{ id: 'f3-10', phase: 'Organización y Responsabilidades', title: 'Desarrollar plan de auditorías internas periódicas como mecanismo preventivo ante fiscalización', status: 'to_do', priority: 'medium' },
	{ id: 'f3-11', phase: 'Organización y Responsabilidades', title: 'Establecer gestión de subencargados con obligaciones contractuales alineadas a la Ley 21.719', status: 'to_do', priority: 'high' },

	// Fase 4: Seguridad de la Información
	{ id: 'f4-1', phase: 'Seguridad de la Información', title: 'Implementar medidas técnicas (cifrado, backups, control de accesos)', status: 'to_do', priority: 'high' },
	{ id: 'f4-2', phase: 'Seguridad de la Información', title: 'Definir medidas organizativas de seguridad y procedimientos estándar', status: 'to_do', priority: 'high' },
	{ id: 'f4-3', phase: 'Seguridad de la Información', title: 'Realizar pruebas de vulnerabilidad y análisis de riesgos periódicos', status: 'to_do', priority: 'medium' },
	{ id: 'f4-4', phase: 'Seguridad de la Información', title: 'Desarrollar y probar un plan de respuesta ante incidentes', status: 'to_do', priority: 'high' },
	{ id: 'f4-5', phase: 'Seguridad de la Información', title: 'Evaluar la necesidad de realizar Evaluaciones de Impacto (PIA) sobre privacidad', status: 'to_do', priority: 'medium' },
	{ id: 'f4-6', phase: 'Seguridad de la Información', title: 'Implementar anonimización y pseudonimización de datos para limitar riesgos', status: 'to_do', priority: 'low' },
	{ id: 'f4-7', phase: 'Seguridad de la Información', title: 'Documentar simulacros/pruebas realizadas y mantener registro de incidentes y acciones tomadas', status: 'to_do', priority: 'low' },
	{ id: 'f4-8', phase: 'Seguridad de la Información', title: 'Establecer monitoreo continuo y actualización constante de medidas frente a nuevas amenazas', status: 'to_do', priority: 'low' },
	{ id: 'f4-9', phase: 'Seguridad de la Información', title: 'Verificar que el plan incluya notificación en menos de 72h a autoridad y titulares', status: 'to_do', priority: 'low' },
	{ id: 'f4-10', phase: 'Seguridad de la Información', title: 'Implementar protección desde el diseño y por defecto en la concepción de sistemas', status: 'to_do', priority: 'low' },
	{ id: 'f4-11', phase: 'Seguridad de la Información', title: 'Establecer gestión documental de políticas, capacitaciones, pruebas y planes para auditoría', status: 'to_do', priority: 'low' },

	// Fase 5: Transferencias y Proveedores
	{ id: 'f5-1', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Identificar todas las transferencias internacionales de datos y proveedores externos', status: 'to_do', priority: 'high' },
	{ id: 'f5-2', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Revisar contratos y asegurarse que cuentan con cláusulas de protección de datos válidas', status: 'to_do', priority: 'high' },
	{ id: 'f5-3', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Adaptar procesos para cumplir restricciones y requisitos legales de transferencia internacional', status: 'to_do', priority: 'high' },
	{ id: 'f5-4', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Asegurar que los proveedores cumplen la Ley 21.719 y otras normativas relevantes', status: 'to_do', priority: 'high' },
	{ id: 'f5-5', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Documentar fundamento legal de cada transferencia (nivel de protección, cláusulas, legitimación)', status: 'to_do', priority: 'low' },
	{ id: 'f5-6', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Mantener evidencia documental de revisiones, acuerdos firmados y auditorías a proveedores', status: 'to_do', priority: 'low' },
	{ id: 'f5-7', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Establecer procesos para monitorear periódicamente a proveedores ante cambios de riesgos y normativas', status: 'to_do', priority: 'low' },
	{ id: 'f5-8', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Prever mecanismos para manejo y notificación de incidentes por parte de proveedores externos', status: 'to_do', priority: 'low' },
	{ id: 'f5-9', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Implementar procedimientos para destrucción/retorno seguro de datos al finalizar servicios', status: 'to_do', priority: 'low' },

	// Fase 6: Monitoreo y Cultura
	{ id: 'f6-1', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Realizar auditorías internas periódicas del cumplimiento', status: 'to_do', priority: 'medium' },
	{ id: 'f6-2', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Monitorear novedades legales y adaptar procesos cuando existan cambios', status: 'to_do', priority: 'medium' },
	{ id: 'f6-3', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Mantener registros y evidencia objetiva de cumplimiento actualizados', status: 'to_do', priority: 'medium' },
	{ id: 'f6-4', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Promover campañas internas de sensibilización y actualización sobre privacidad', status: 'to_do', priority: 'medium' },
	{ id: 'f6-5', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Mejorar continuamente los procesos según hallazgos de auditoría', status: 'to_do', priority: 'low' }
]

const statusOptions: { value: ItemStatus; label: string }[] = [
	{ value: 'to_do', label: 'Por hacer' },
	{ value: 'in_progress', label: 'En progreso' },
	{ value: 'blocked', label: 'Bloqueado' },
	{ value: 'done', label: 'Hecho' }
]

const phases: ChecklistPhase[] = [
	'Diagnóstico y Preparación Inicial',
	'Políticas y Procedimientos',
	'Organización y Responsabilidades',
	'Seguridad de la Información',
	'Transferencias Internacionales y Gestión de Proveedores',
	'Monitoreo Continuo y Cultura Organizacional'
]

const Checklists: React.FC = () => {
	const [items, setItems] = useState<ChecklistItem[]>(seed)
	const [activePhase, setActivePhase] = useState<ChecklistPhase>('Diagnóstico y Preparación Inicial')

	const filtered = useMemo(() => items.filter(i => i.phase === activePhase), [items, activePhase])

	const updateItem = (id: string, patch: Partial<ChecklistItem>) => {
		setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)))
	}

	const toggleItem = (id: string) => {
		const item = items.find(i => i.id === id)
		if (item) {
			const newStatus = item.status === 'done' ? 'to_do' : 'done'
			const completedDate = newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
			updateItem(id, { status: newStatus, completedDate })
		}
	}

	const getPriorityColor = (priority?: string) => {
		switch (priority) {
			case 'high': return 'text-red-600'
			case 'medium': return 'text-yellow-600'
			case 'low': return 'text-green-600'
			default: return 'text-gray-600'
		}
	}

	const getPriorityLabel = (priority?: string) => {
		switch (priority) {
			case 'high': return 'Alta'
			case 'medium': return 'Media'
			case 'low': return 'Baja'
			default: return 'Sin prioridad'
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Checklists de Cumplimiento</h1>
					<p className="text-gray-600">Seguimiento de tareas organizadas por fases del programa</p>
				</div>
				<div className="flex gap-2">
					{phases.map(p => (
						<button 
							key={p} 
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								activePhase === p 
									? 'bg-primary-600 text-white' 
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`} 
							onClick={() => setActivePhase(p)}
						>
							{p}
						</button>
					))}
				</div>
			</div>

			{/* Progress Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-gray-900">{filtered.length}</div>
					<div className="text-sm text-gray-600">Total Tareas</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">
						{filtered.filter(i => i.status === 'done').length}
					</div>
					<div className="text-sm text-gray-600">Completadas</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-yellow-600">
						{filtered.filter(i => i.status === 'in_progress').length}
					</div>
					<div className="text-sm text-gray-600">En Progreso</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-red-600">
						{filtered.filter(i => i.status === 'to_do').length}
					</div>
					<div className="text-sm text-gray-600">Pendientes</div>
				</div>
			</div>

			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">{activePhase}</h2>
					<div className="space-y-3">
						{filtered.map(i => (
							<div key={i.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
								<div className="flex-shrink-0 mt-1">
									<input
										type="checkbox"
										checked={i.status === 'done'}
										onChange={() => toggleItem(i.id)}
										className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className={`text-sm font-medium ${i.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
												{i.title}
											</h3>
											<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
												<span className={getPriorityColor(i.priority)}>
													Prioridad: {getPriorityLabel(i.priority)}
												</span>
												{i.assignee && (
													<span>Asignado: {i.assignee}</span>
												)}
											</div>
										</div>
										<div className="flex items-center gap-4 text-xs text-gray-500">
											{i.dueDate && (
												<div>
													<span className="font-medium">Vence:</span> {i.dueDate}
												</div>
											)}
											{i.completedDate && i.status === 'done' && (
												<div>
													<span className="font-medium">Completada:</span> {i.completedDate}
												</div>
											)}
										</div>
									</div>
									
									{/* Additional fields */}
									<div className="flex items-center gap-4 mt-3">
										<input
											type="text"
											placeholder="Asignar a..."
											value={i.assignee || ''}
											onChange={(e) => updateItem(i.id, { assignee: e.target.value })}
											className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
										/>
										<input
											type="date"
											value={i.dueDate || ''}
											onChange={(e) => updateItem(i.id, { dueDate: e.target.value })}
											className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
										/>
										<select
											value={i.status}
											onChange={(e) => updateItem(i.id, { status: e.target.value as ItemStatus })}
											className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
										>
											{statusOptions.map(s => (
												<option key={s.value} value={s.value}>{s.label}</option>
											))}
										</select>
									</div>
								</div>
							</div>
						))}
					</div>
					
					{filtered.length === 0 && (
						<div className="text-center py-12">
							<div className="text-gray-500">No hay tareas en esta fase</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Checklists


