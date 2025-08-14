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
	status: ItemStatus
	notes?: string
	evidence?: { url?: string; fileName?: string; note?: string }
}

const seed: ChecklistItem[] = [
	// Fase 1: Diagnóstico y Preparación Inicial
	{ id: 'f1-1', phase: 'Diagnóstico y Preparación Inicial', title: 'Identificar todos los flujos de datos personales en la empresa (clientes, empleados, proveedores, etc.)', status: 'to_do' },
	{ id: 'f1-2', phase: 'Diagnóstico y Preparación Inicial', title: 'Elaborar un inventario completo de bases de datos y sistemas que almacenan datos personales', status: 'to_do' },
	{ id: 'f1-3', phase: 'Diagnóstico y Preparación Inicial', title: 'Mapear procesos asociados al tratamiento de datos personales', status: 'to_do' },
	{ id: 'f1-4', phase: 'Diagnóstico y Preparación Inicial', title: 'Realizar análisis de brechas de cumplimiento respecto a la nueva ley', status: 'to_do' },
	{ id: 'f1-5', phase: 'Diagnóstico y Preparación Inicial', title: 'Crear y documentar el Registro de Actividades de Tratamiento (RAT)', status: 'to_do' },

	// Fase 2: Políticas y Procedimientos
	{ id: 'f2-1', phase: 'Políticas y Procedimientos', title: 'Redactar o actualizar la Política de Privacidad (alineada a la ley)', status: 'to_do' },
	{ id: 'f2-2', phase: 'Políticas y Procedimientos', title: 'Publicar política de privacidad en todos los canales relevantes', status: 'to_do' },
	{ id: 'f2-3', phase: 'Políticas y Procedimientos', title: 'Establecer procedimientos para gestión de derechos ARCO y portabilidad', status: 'to_do' },
	{ id: 'f2-4', phase: 'Políticas y Procedimientos', title: 'Desarrollar protocolo para notificación y gestión de incidentes de seguridad', status: 'to_do' },
	{ id: 'f2-5', phase: 'Políticas y Procedimientos', title: 'Elaborar manual interno de tratamiento de datos y instructivos para empleados', status: 'to_do' },

	// Fase 3: Organización y Responsabilidades
	{ id: 'f3-1', phase: 'Organización y Responsabilidades', title: 'Designar al Delegado de Protección de Datos (DPO), si corresponde', status: 'to_do' },
	{ id: 'f3-2', phase: 'Organización y Responsabilidades', title: 'Notificar formalmente la designación del DPO y sus roles', status: 'to_do' },
	{ id: 'f3-3', phase: 'Organización y Responsabilidades', title: 'Formar equipo interno responsable de cumplimiento', status: 'to_do' },
	{ id: 'f3-4', phase: 'Organización y Responsabilidades', title: 'Capacitar a todo el personal en protección de datos y su rol', status: 'to_do' },
	{ id: 'f3-5', phase: 'Organización y Responsabilidades', title: 'Revisar, actualizar y firmar contratos con proveedores y encargados de tratamiento', status: 'to_do' },

	// Fase 4: Seguridad de la Información
	{ id: 'f4-1', phase: 'Seguridad de la Información', title: 'Implementar medidas técnicas (cifrado, backups, control de accesos)', status: 'to_do' },
	{ id: 'f4-2', phase: 'Seguridad de la Información', title: 'Definir medidas organizativas de seguridad y procedimientos estándar', status: 'to_do' },
	{ id: 'f4-3', phase: 'Seguridad de la Información', title: 'Realizar pruebas de vulnerabilidad y análisis de riesgos periódicos', status: 'to_do' },
	{ id: 'f4-4', phase: 'Seguridad de la Información', title: 'Desarrollar y probar un plan de respuesta ante incidentes', status: 'to_do' },
	{ id: 'f4-5', phase: 'Seguridad de la Información', title: 'Evaluar la necesidad de realizar Evaluaciones de Impacto (PIA) sobre privacidad', status: 'to_do' },

	// Fase 5: Transferencias y Proveedores
	{ id: 'f5-1', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Identificar todas las transferencias internacionales de datos y proveedores externos', status: 'to_do' },
	{ id: 'f5-2', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Revisar contratos y asegurarse que cuentan con cláusulas de protección de datos válidas', status: 'to_do' },
	{ id: 'f5-3', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Adaptar procesos para cumplir restricciones y requisitos legales de transferencia internacional', status: 'to_do' },
	{ id: 'f5-4', phase: 'Transferencias Internacionales y Gestión de Proveedores', title: 'Asegurar que los proveedores cumplen la Ley 21.719 y otras normativas relevantes', status: 'to_do' },

	// Fase 6: Monitoreo y Cultura
	{ id: 'f6-1', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Realizar auditorías internas periódicas del cumplimiento', status: 'to_do' },
	{ id: 'f6-2', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Monitorear novedades legales y adaptar procesos cuando existan cambios', status: 'to_do' },
	{ id: 'f6-3', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Mantener registros y evidencia objetiva de cumplimiento actualizados', status: 'to_do' },
	{ id: 'f6-4', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Promover campañas internas de sensibilización y actualización sobre privacidad', status: 'to_do' },
	{ id: 'f6-5', phase: 'Monitoreo Continuo y Cultura Organizacional', title: 'Mejorar continuamente los procesos según hallazgos de auditoría', status: 'to_do' }
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

	const addEvidence = (id: string) => {
		const note = prompt('Describe la evidencia o pega un enlace:') || ''
		updateItem(id, { evidence: { note } })
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Checklists de Cumplimiento</h1>
				<div className="flex gap-2">
					{phases.map(p => (
						<button key={p} className={`btn-secondary ${activePhase === p ? 'ring-2 ring-primary-500' : ''}`} onClick={() => setActivePhase(p)}>
							{p}
						</button>
					))}
				</div>
			</div>

			<div className="card">
				<table className="w-full text-sm">
					<thead className="text-left text-gray-600">
						<tr>
							<th className="py-2">Tarea</th>
							<th className="py-2">Asignado a</th>
							<th className="py-2">Vence</th>
							<th className="py-2">Estado</th>
							<th className="py-2">Evidencia</th>
							<th className="py-2"></th>
						</tr>
					</thead>
					<tbody>
						{filtered.map(i => (
							<tr key={i.id} className="border-t">
								<td className="py-2 pr-2">{i.title}</td>
								<td className="py-2 pr-2">
									<input className="input-field" placeholder="Nombre" value={i.assignee || ''} onChange={(e) => updateItem(i.id, { assignee: e.target.value })} />
								</td>
								<td className="py-2 pr-2">
									<input type="date" className="input-field" value={i.dueDate || ''} onChange={(e) => updateItem(i.id, { dueDate: e.target.value })} />
								</td>
								<td className="py-2 pr-2">
									<select className="input-field" value={i.status} onChange={(e) => updateItem(i.id, { status: e.target.value as ItemStatus })}>
										{statusOptions.map(s => (
											<option key={s.value} value={s.value}>{s.label}</option>
										))}
									</select>
								</td>
								<td className="py-2 pr-2 text-gray-600">
									{i.evidence?.note ? <span className="status-success">Cargada</span> : <span className="status-warning">Pendiente</span>}
								</td>
								<td className="py-2 text-right">
									<button className="btn-secondary" onClick={() => addEvidence(i.id)}>Añadir evidencia</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Checklists


