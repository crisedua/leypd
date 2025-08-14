import React, { useEffect, useState, useMemo } from 'react'
import { ProgramStage } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const ProgramGuide: React.FC = () => {
	const { user } = useAuth()
	const [stages, setStages] = useState<ProgramStage[]>([])
	const [loading, setLoading] = useState(true)
	const [expanded, setExpanded] = useState<string | null>(null)

	const defaults = useMemo((): ProgramStage[] => [
		{
			id: 'fase0',
			name: 'Fase 0 – Gobernanza & Arranque',
			description: 'Establecimiento de estructura organizacional y roles para cumplimiento',
			phase: '0',
			start_date: '2025-01-01',
			end_date: '2025-02-15',
			status: 'in_progress',
			deliverables: [
				'Nombramiento formal del DPO',
				'Matriz RACI de responsabilidades',
				'Política de privacidad actualizada',
				'Plan anual DPO 2025',
				'Comité de privacidad establecido'
			],
			acceptance_criteria: [
				'DPO certificado y notificado a la autoridad',
				'Políticas aprobadas por dirección',
				'Personal clave capacitado en roles y responsabilidades'
			],
			dpo_approved: false
		},
		{
			id: 'fase1',
			name: 'Fase 1 – Diagnóstico y Preparación Inicial',
			description: 'Inventario completo de datos y análisis de brechas de cumplimiento',
			phase: '1',
			start_date: '2025-02-16',
			end_date: '2025-04-30',
			status: 'pending',
			deliverables: [
				'Inventario de datos personales (empleados, clientes, proveedores)',
				'Análisis de brechas vs. requisitos legales',
				'Registro de Actividades de Tratamiento (RAT) completo',
				'Mapa de flujos de datos por proceso',
				'Identificación de datos sensibles y riesgos'
			],
			acceptance_criteria: [
				'100% de sistemas inventariados con base legal',
				'RAT documentado para todos los tratamientos',
				'Brechas identificadas y priorizadas',
				'Reporte de diagnóstico aprobado por DPO'
			],
			dpo_approved: false
		},
		{
			id: 'fase2',
			name: 'Fase 2 – Políticas y Procedimientos',
			description: 'Desarrollo e implementación de marco normativo interno',
			phase: '2',
			start_date: '2025-05-01',
			end_date: '2025-06-30',
			status: 'pending',
			deliverables: [
				'Política de privacidad actualizada (licitud, finalidad, proporcionalidad)',
				'Procedimientos ARCO y portabilidad operativos',
				'Protocolo de gestión de incidentes y brechas',
				'Avisos de privacidad por canal de captura',
				'Contratos con encargados actualizados'
			],
			acceptance_criteria: [
				'Políticas alineadas con principios de la ley',
				'Procedimientos ARCO con SLA ≤ 30 días',
				'Protocolo de incidentes con tiempos de respuesta definidos',
				'100% de contratos con cláusulas de protección de datos'
			],
			dpo_approved: false
		},
		{
			id: 'fase3',
			name: 'Fase 3 – Seguridad y Evaluaciones de Impacto',
			description: 'Implementación de medidas de seguridad y evaluaciones PIA',
			phase: '3',
			start_date: '2025-07-01',
			end_date: '2025-08-31',
			status: 'pending',
			deliverables: [
				'Medidas de seguridad técnicas (cifrado, control de acceso)',
				'Evaluaciones de Impacto (PIA) para tratamientos de alto riesgo',
				'Sistema de monitoreo y detección de incidentes',
				'Respaldos y planes de continuidad actualizados',
				'Anonimización y seudonimización implementadas'
			],
			acceptance_criteria: [
				'Medidas de seguridad proporcionales al riesgo',
				'PIAs completadas para datos sensibles',
				'Sistema de monitoreo operativo 24/7',
				'Pruebas de respaldo exitosas'
			],
			dpo_approved: false
		},
		{
			id: 'fase4',
			name: 'Fase 4 – Transferencias y Proveedores',
			description: 'Gestión de transferencias internacionales y terceros',
			phase: '4',
			start_date: '2025-09-01',
			end_date: '2025-10-15',
			status: 'pending',
			deliverables: [
				'Inventario de transferencias internacionales',
				'Evaluación de adecuación de países destino',
				'Cláusulas contractuales estándar implementadas',
				'Due diligence de proveedores críticos',
				'Registro de subencargados actualizado'
			],
			acceptance_criteria: [
				'100% transferencias con base legal adecuada',
				'Contratos con cláusulas de protección apropiadas',
				'Evaluación de riesgos de proveedores completada',
				'Mecanismos de transferencia validados'
			],
			dpo_approved: false
		},
		{
			id: 'fase5',
			name: 'Fase 5 – Cultura y Monitoreo Continuo',
			description: 'Consolidación de cultura organizacional y auditoría interna',
			phase: '5',
			start_date: '2025-10-16',
			end_date: '2025-12-01',
			status: 'pending',
			deliverables: [
				'Programa de capacitación por rol implementado',
				'Auditoría interna de cumplimiento',
				'Cultura organizacional de privacidad establecida',
				'Sistema de monitoreo continuo operativo',
				'Plan de mejora continua 2026'
			],
			acceptance_criteria: [
				'95% del personal capacitado en privacidad',
				'Auditoría interna sin hallazgos críticos',
				'Indicadores de cultura de privacidad positivos',
				'Certificación de cumplimiento emitida'
			],
			dpo_approved: false
		}
	], [])

	useEffect(() => {
		setStages(defaults)
		setLoading(false)
	}, [defaults])

	if (loading) return <div>Cargando…</div>

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h1 className="text-2xl font-semibold">Mapa de Cumplimiento - Ley 21.719</h1>
				<div className="card">
					<h2 className="text-lg font-semibold mb-3">Marco de Cumplimiento Integral</h2>
					<p className="text-gray-600 mb-4">
						Hoja de ruta estructurada para implementar el cumplimiento de la Ley de Protección de Datos Personales de Chile, 
						desde el diagnóstico inicial hasta la operación continua.
					</p>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
						<div className="p-3 bg-blue-50 rounded-lg">
							<div className="font-medium text-blue-900">🏛️ Gobernanza</div>
							<div className="text-sm text-blue-700">Estructura organizacional y roles</div>
						</div>
						<div className="p-3 bg-green-50 rounded-lg">
							<div className="font-medium text-green-900">📊 Diagnóstico</div>
							<div className="text-sm text-green-700">Inventario y análisis de brechas</div>
						</div>
						<div className="p-3 bg-purple-50 rounded-lg">
							<div className="font-medium text-purple-900">📋 Políticas</div>
							<div className="text-sm text-purple-700">Marco normativo interno</div>
						</div>
						<div className="p-3 bg-orange-50 rounded-lg">
							<div className="font-medium text-orange-900">🔒 Seguridad</div>
							<div className="text-sm text-orange-700">Medidas técnicas y PIA</div>
						</div>
						<div className="p-3 bg-red-50 rounded-lg">
							<div className="font-medium text-red-900">🌐 Transferencias</div>
							<div className="text-sm text-red-700">Proveedores e internacional</div>
						</div>
						<div className="p-3 bg-indigo-50 rounded-lg">
							<div className="font-medium text-indigo-900">🎯 Cultura</div>
							<div className="text-sm text-indigo-700">Monitoreo continuo</div>
						</div>
					</div>

					<div className="border-t pt-4">
						<h3 className="font-semibold mb-2">Principios Fundamentales de la Ley:</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
							<div>• <strong>Licitud:</strong> Base legal válida para cada tratamiento</div>
							<div>• <strong>Finalidad:</strong> Propósitos específicos y legítimos</div>
							<div>• <strong>Proporcionalidad:</strong> Datos mínimos necesarios</div>
							<div>• <strong>Calidad:</strong> Datos exactos y actualizados</div>
							<div>• <strong>Seguridad:</strong> Medidas apropiadas de protección</div>
							<div>• <strong>Transparencia:</strong> Información clara a los titulares</div>
						</div>
					</div>
				</div>
			</div>
			<div className="space-y-4">
				{stages.map((s, index) => {
					const getStatusColor = (status: string) => {
						switch (status) {
							case 'completed': return 'bg-green-100 text-green-800'
							case 'in_progress': return 'bg-blue-100 text-blue-800'
							case 'pending': return 'bg-gray-100 text-gray-600'
							default: return 'bg-gray-100 text-gray-600'
						}
					}
					
					const getStatusIcon = (status: string) => {
						switch (status) {
							case 'completed': return '✅'
							case 'in_progress': return '🔄'
							case 'pending': return '⏳'
							default: return '⏳'
						}
					}

					return (
						<div key={s.id} className="card border-l-4 border-l-primary-500">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<span className="text-2xl">{getStatusIcon(s.status)}</span>
										<div>
											<div className="text-lg font-semibold">{s.name}</div>
											<div className="text-sm text-gray-600">{s.description}</div>
										</div>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-500">
										<span>📅 {new Date(s.start_date).toLocaleDateString('es-CL')} - {new Date(s.end_date).toLocaleDateString('es-CL')}</span>
										<span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(s.status)}`}>
											{s.status === 'completed' ? 'Completado' : s.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
										</span>
									</div>
								</div>
								<button className="btn-secondary" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
									{expanded === s.id ? '🔽 Ocultar' : '▶️ Ver detalles'}
								</button>
							</div>
							
							{expanded === s.id && (
								<div className="mt-6 border-t pt-4">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										<div>
											<h4 className="font-semibold mb-3 flex items-center gap-2">
												📋 Entregables ({s.deliverables.length})
											</h4>
											<ul className="space-y-2">
												{s.deliverables.map((d, i) => (
													<li key={i} className="flex items-start gap-2 text-sm">
														<span className="text-primary-500 mt-1">•</span>
														<span>{d}</span>
													</li>
												))}
											</ul>
										</div>
										
										<div>
											<h4 className="font-semibold mb-3 flex items-center gap-2">
												✅ Criterios de Aceptación ({s.acceptance_criteria.length})
											</h4>
											<ul className="space-y-2">
												{s.acceptance_criteria.map((c, i) => (
													<li key={i} className="flex items-start gap-2 text-sm">
														<span className="text-green-500 mt-1">✓</span>
														<span>{c}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
									
									{user?.role === 'DPO' && (
										<div className="mt-6 pt-4 border-t">
											<button className="btn-primary">
												📝 Marcar Fase como Completa (Requiere Aprobación DPO)
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ProgramGuide


