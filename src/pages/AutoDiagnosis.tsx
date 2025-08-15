import React, { useState, useMemo } from 'react'
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	XCircleIcon,
	QuestionMarkCircleIcon,
	DocumentTextIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	GlobeAltIcon,
	AcademicCapIcon,
	ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

interface DiagnosisQuestion {
	id: string
	category: string
	question: string
	weight: number
	phase: string
	priority: 'high' | 'medium' | 'low'
}

interface DiagnosisResult {
	overallScore: number
	phaseScores: Record<string, number>
	recommendations: string[]
	priorityActions: string[]
	complianceLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
}

const diagnosisQuestions: DiagnosisQuestion[] = [
	// Diagnóstico y Preparación Inicial
	{
		id: 'd1',
		category: 'Diagnóstico y Preparación Inicial',
		question: '¿Ha identificado todos los flujos de datos personales en su empresa?',
		weight: 10,
		phase: 'Diagnóstico y Preparación Inicial',
		priority: 'high'
	},
	{
		id: 'd2',
		category: 'Diagnóstico y Preparación Inicial',
		question: '¿Tiene un inventario completo de bases de datos y sistemas?',
		weight: 10,
		phase: 'Diagnóstico y Preparación Inicial',
		priority: 'high'
	},
	{
		id: 'd3',
		category: 'Diagnóstico y Preparación Inicial',
		question: '¿Ha mapeado los procesos de tratamiento de datos personales?',
		weight: 8,
		phase: 'Diagnóstico y Preparación Inicial',
		priority: 'high'
	},
	{
		id: 'd4',
		category: 'Diagnóstico y Preparación Inicial',
		question: '¿Ha realizado análisis de brechas de cumplimiento?',
		weight: 8,
		phase: 'Diagnóstico y Preparación Inicial',
		priority: 'high'
	},
	{
		id: 'd5',
		category: 'Diagnóstico y Preparación Inicial',
		question: '¿Tiene un Registro de Actividades de Tratamiento (RAT)?',
		weight: 10,
		phase: 'Diagnóstico y Preparación Inicial',
		priority: 'high'
	},

	// Políticas y Procedimientos
	{
		id: 'p1',
		category: 'Políticas y Procedimientos',
		question: '¿Tiene una Política de Privacidad actualizada y alineada a la ley?',
		weight: 10,
		phase: 'Políticas y Procedimientos',
		priority: 'high'
	},
	{
		id: 'p2',
		category: 'Políticas y Procedimientos',
		question: '¿Ha publicado la política de privacidad en todos los canales relevantes?',
		weight: 8,
		phase: 'Políticas y Procedimientos',
		priority: 'high'
	},
	{
		id: 'p3',
		category: 'Políticas y Procedimientos',
		question: '¿Tiene procedimientos para gestión de derechos ARCO?',
		weight: 10,
		phase: 'Políticas y Procedimientos',
		priority: 'high'
	},
	{
		id: 'p4',
		category: 'Políticas y Procedimientos',
		question: '¿Tiene protocolo para gestión de incidentes de seguridad?',
		weight: 8,
		phase: 'Políticas y Procedimientos',
		priority: 'high'
	},
	{
		id: 'p5',
		category: 'Políticas y Procedimientos',
		question: '¿Tiene manual interno de tratamiento de datos?',
		weight: 6,
		phase: 'Políticas y Procedimientos',
		priority: 'medium'
	},

	// Organización y Responsabilidades
	{
		id: 'o1',
		category: 'Organización y Responsabilidades',
		question: '¿Ha designado un Delegado de Protección de Datos (DPO)?',
		weight: 10,
		phase: 'Organización y Responsabilidades',
		priority: 'high'
	},
	{
		id: 'o2',
		category: 'Organización y Responsabilidades',
		question: '¿Ha notificado formalmente la designación del DPO?',
		weight: 8,
		phase: 'Organización y Responsabilidades',
		priority: 'high'
	},
	{
		id: 'o3',
		category: 'Organización y Responsabilidades',
		question: '¿Tiene un equipo interno responsable de cumplimiento?',
		weight: 8,
		phase: 'Organización y Responsabilidades',
		priority: 'high'
	},
	{
		id: 'o4',
		category: 'Organización y Responsabilidades',
		question: '¿Ha capacitado al personal en protección de datos?',
		weight: 6,
		phase: 'Organización y Responsabilidades',
		priority: 'medium'
	},
	{
		id: 'o5',
		category: 'Organización y Responsabilidades',
		question: '¿Ha revisado contratos con proveedores?',
		weight: 8,
		phase: 'Organización y Responsabilidades',
		priority: 'high'
	},

	// Seguridad de la Información
	{
		id: 's1',
		category: 'Seguridad de la Información',
		question: '¿Ha implementado medidas técnicas de seguridad (cifrado, backups)?',
		weight: 10,
		phase: 'Seguridad de la Información',
		priority: 'high'
	},
	{
		id: 's2',
		category: 'Seguridad de la Información',
		question: '¿Tiene medidas organizativas de seguridad definidas?',
		weight: 8,
		phase: 'Seguridad de la Información',
		priority: 'high'
	},
	{
		id: 's3',
		category: 'Seguridad de la Información',
		question: '¿Realiza pruebas de vulnerabilidad periódicas?',
		weight: 6,
		phase: 'Seguridad de la Información',
		priority: 'medium'
	},
	{
		id: 's4',
		category: 'Seguridad de la Información',
		question: '¿Tiene un plan de respuesta ante incidentes?',
		weight: 8,
		phase: 'Seguridad de la Información',
		priority: 'high'
	},
	{
		id: 's5',
		category: 'Seguridad de la Información',
		question: '¿Ha evaluado la necesidad de realizar DPIA?',
		weight: 6,
		phase: 'Seguridad de la Información',
		priority: 'medium'
	},

	// Transferencias Internacionales
	{
		id: 't1',
		category: 'Transferencias Internacionales',
		question: '¿Ha identificado todas las transferencias internacionales?',
		weight: 10,
		phase: 'Transferencias Internacionales y Gestión de Proveedores',
		priority: 'high'
	},
	{
		id: 't2',
		category: 'Transferencias Internacionales',
		question: '¿Tienen cláusulas de protección de datos válidas?',
		weight: 8,
		phase: 'Transferencias Internacionales y Gestión de Proveedores',
		priority: 'high'
	},
	{
		id: 't3',
		category: 'Transferencias Internacionales',
		question: '¿Cumple requisitos legales de transferencia internacional?',
		weight: 8,
		phase: 'Transferencias Internacionales y Gestión de Proveedores',
		priority: 'high'
	},
	{
		id: 't4',
		category: 'Transferencias Internacionales',
		question: '¿Sus proveedores cumplen la Ley 21.719?',
		weight: 8,
		phase: 'Transferencias Internacionales y Gestión de Proveedores',
		priority: 'high'
	},

	// Monitoreo Continuo
	{
		id: 'm1',
		category: 'Monitoreo Continuo',
		question: '¿Realiza auditorías internas periódicas?',
		weight: 6,
		phase: 'Monitoreo Continuo y Cultura Organizacional',
		priority: 'medium'
	},
	{
		id: 'm2',
		category: 'Monitoreo Continuo',
		question: '¿Monitorea novedades legales?',
		weight: 6,
		phase: 'Monitoreo Continuo y Cultura Organizacional',
		priority: 'medium'
	},
	{
		id: 'm3',
		category: 'Monitoreo Continuo',
		question: '¿Mantiene registros de cumplimiento actualizados?',
		weight: 6,
		phase: 'Monitoreo Continuo y Cultura Organizacional',
		priority: 'medium'
	},
	{
		id: 'm4',
		category: 'Monitoreo Continuo',
		question: '¿Promueve campañas de sensibilización?',
		weight: 4,
		phase: 'Monitoreo Continuo y Cultura Organizacional',
		priority: 'medium'
	}
]

const AutoDiagnosis: React.FC = () => {
	const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'partial'>>({})
	const [showResults, setShowResults] = useState(false)

	const updateAnswer = (questionId: string, answer: 'yes' | 'no' | 'partial') => {
		setAnswers(prev => ({ ...prev, [questionId]: answer }))
	}

	const calculateResults = useMemo((): DiagnosisResult => {
		const totalWeight = diagnosisQuestions.reduce((sum, q) => sum + q.weight, 0)
		let totalScore = 0
		const phaseScores: Record<string, { score: number; weight: number }> = {}

		diagnosisQuestions.forEach(question => {
			const answer = answers[question.id]
			let score = 0

			if (answer === 'yes') score = question.weight
			else if (answer === 'partial') score = question.weight * 0.5
			else score = 0

			totalScore += score

			if (!phaseScores[question.phase]) {
				phaseScores[question.phase] = { score: 0, weight: 0 }
			}
			phaseScores[question.phase].score += score
			phaseScores[question.phase].weight += question.weight
		})

		const overallScore = Math.round((totalScore / totalWeight) * 100)
		const phasePercentages: Record<string, number> = {}

		Object.keys(phaseScores).forEach(phase => {
			const { score, weight } = phaseScores[phase]
			phasePercentages[phase] = Math.round((score / weight) * 100)
		})

		// Determine compliance level
		let complianceLevel: DiagnosisResult['complianceLevel'] = 'critical'
		if (overallScore >= 90) complianceLevel = 'excellent'
		else if (overallScore >= 75) complianceLevel = 'good'
		else if (overallScore >= 50) complianceLevel = 'fair'
		else if (overallScore >= 25) complianceLevel = 'poor'

		// Generate recommendations
		const recommendations: string[] = []
		const priorityActions: string[] = []

		if (overallScore < 90) {
			recommendations.push('Implemente un plan de acción prioritario para alcanzar el cumplimiento completo.')
		}

		// Phase-specific recommendations
		Object.entries(phasePercentages).forEach(([phase, score]) => {
			if (score < 70) {
				recommendations.push(`Priorice la fase "${phase}" - actualmente en ${score}% de cumplimiento.`)
			}
		})

		// Priority actions based on low scores
		const lowScoreQuestions = diagnosisQuestions.filter(q => {
			const answer = answers[q.id]
			return answer === 'no' && q.priority === 'high'
		})

		lowScoreQuestions.slice(0, 5).forEach(q => {
			priorityActions.push(q.question)
		})

		return {
			overallScore,
			phaseScores: phasePercentages,
			recommendations,
			priorityActions,
			complianceLevel
		}
	}, [answers])

	const getComplianceColor = (level: DiagnosisResult['complianceLevel']) => {
		switch (level) {
			case 'excellent': return 'text-green-600 bg-green-50'
			case 'good': return 'text-blue-600 bg-blue-50'
			case 'fair': return 'text-yellow-600 bg-yellow-50'
			case 'poor': return 'text-orange-600 bg-orange-50'
			case 'critical': return 'text-red-600 bg-red-50'
		}
	}

	const getComplianceIcon = (level: DiagnosisResult['complianceLevel']) => {
		switch (level) {
			case 'excellent': return CheckCircleIcon
			case 'good': return CheckCircleIcon
			case 'fair': return ExclamationTriangleIcon
			case 'poor': return ExclamationTriangleIcon
			case 'critical': return XCircleIcon
		}
	}

	const getPhaseIcon = (phase: string) => {
		switch (phase) {
			case 'Diagnóstico y Preparación Inicial': return DocumentTextIcon
			case 'Políticas y Procedimientos': return ClipboardDocumentIcon
			case 'Organización y Responsabilidades': return UserGroupIcon
			case 'Seguridad de la Información': return ShieldCheckIcon
			case 'Transferencias Internacionales y Gestión de Proveedores': return GlobeAltIcon
			case 'Monitoreo Continuo y Cultura Organizacional': return AcademicCapIcon
			default: return QuestionMarkCircleIcon
		}
	}

	const handleSubmit = () => {
		setShowResults(true)
	}

	const handleReset = () => {
		setAnswers({})
		setShowResults(false)
	}

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900">Auto-Diagnóstico de Cumplimiento</h1>
				<p className="mt-2 text-gray-600">
					Evalúe su estado actual de cumplimiento con la Ley 21.719 de Protección de Datos Personales
				</p>
			</div>

			{!showResults ? (
				<div className="space-y-8">
					{/* Instructions */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• <strong>Sí:</strong> La medida está completamente implementada</li>
							<li>• <strong>Parcial:</strong> La medida está en proceso o parcialmente implementada</li>
							<li>• <strong>No:</strong> La medida no está implementada</li>
						</ul>
					</div>

					{/* Questions by Phase */}
					{Array.from(new Set(diagnosisQuestions.map(q => q.phase))).map(phase => {
						const phaseQuestions = diagnosisQuestions.filter(q => q.phase === phase)
						const PhaseIcon = getPhaseIcon(phase)

						return (
							<div key={phase} className="bg-white rounded-lg border p-6">
								<div className="flex items-center gap-3 mb-6">
									<PhaseIcon className="h-6 w-6 text-primary-600" />
									<h2 className="text-xl font-semibold text-gray-900">{phase}</h2>
								</div>

								<div className="space-y-4">
									{phaseQuestions.map(question => (
										<div key={question.id} className="border rounded-lg p-4">
											<div className="flex items-start justify-between mb-3">
												<p className="font-medium text-gray-900">{question.question}</p>
												<span className={`ml-2 px-2 py-1 text-xs rounded-full ${
													question.priority === 'high' ? 'bg-red-100 text-red-800' :
													question.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
													'bg-green-100 text-green-800'
												}`}>
													{question.priority === 'high' ? 'Alta' : 
													 question.priority === 'medium' ? 'Media' : 'Baja'}
												</span>
											</div>

											<div className="flex gap-3">
												<button
													onClick={() => updateAnswer(question.id, 'yes')}
													className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
														answers[question.id] === 'yes'
															? 'bg-green-600 text-white'
															: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
													}`}
												>
													Sí
												</button>
												<button
													onClick={() => updateAnswer(question.id, 'partial')}
													className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
														answers[question.id] === 'partial'
															? 'bg-yellow-600 text-white'
															: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
													}`}
												>
													Parcial
												</button>
												<button
													onClick={() => updateAnswer(question.id, 'no')}
													className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
														answers[question.id] === 'no'
															? 'bg-red-600 text-white'
															: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
													}`}
												>
													No
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)
					})}

					{/* Submit Button */}
					<div className="text-center">
						<button
							onClick={handleSubmit}
							disabled={Object.keys(answers).length < diagnosisQuestions.length}
							className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Generar Diagnóstico
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					{/* Overall Score */}
					<div className="bg-white rounded-lg border p-6">
						<div className="text-center">
							<div className="flex items-center justify-center gap-3 mb-4">
								{React.createElement(getComplianceIcon(calculateResults.complianceLevel), {
									className: `h-8 w-8 ${getComplianceColor(calculateResults.complianceLevel).split(' ')[0]}`
								})}
								<h2 className="text-2xl font-bold text-gray-900">
									Puntuación General: {calculateResults.overallScore}%
								</h2>
							</div>
							<div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getComplianceColor(calculateResults.complianceLevel)}`}>
								Nivel de Cumplimiento: {
									calculateResults.complianceLevel === 'excellent' ? 'Excelente' :
									calculateResults.complianceLevel === 'good' ? 'Bueno' :
									calculateResults.complianceLevel === 'fair' ? 'Regular' :
									calculateResults.complianceLevel === 'poor' ? 'Pobre' : 'Crítico'
								}
							</div>
						</div>
					</div>

					{/* Phase Scores */}
					<div className="bg-white rounded-lg border p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Puntuación por Fases</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(calculateResults.phaseScores).map(([phase, score]) => {
								const PhaseIcon = getPhaseIcon(phase)
								const getScoreColor = (score: number) => {
									if (score >= 80) return 'text-green-600'
									if (score >= 60) return 'text-yellow-600'
									return 'text-red-600'
								}

								return (
									<div key={phase} className="flex items-center gap-3 p-3 border rounded-lg">
										<PhaseIcon className="h-5 w-5 text-primary-600" />
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">{phase}</p>
											<p className={`text-lg font-bold ${getScoreColor(score)}`}>{score}%</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>

					{/* Recommendations */}
					<div className="bg-white rounded-lg border p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
						<div className="space-y-3">
							{calculateResults.recommendations.map((rec, index) => (
								<div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
									<ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
									<p className="text-sm text-blue-900">{rec}</p>
								</div>
							))}
						</div>
					</div>

					{/* Priority Actions */}
					{calculateResults.priorityActions.length > 0 && (
						<div className="bg-white rounded-lg border p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Prioritarias</h3>
							<div className="space-y-3">
								{calculateResults.priorityActions.map((action, index) => (
									<div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
										<XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
										<p className="text-sm text-red-900">{action}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="text-center space-x-4">
						<button onClick={handleReset} className="btn-secondary px-6 py-2">
							Realizar Nuevo Diagnóstico
						</button>
						<button 
							onClick={() => window.print()} 
							className="btn-primary px-6 py-2"
						>
							Imprimir Reporte
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default AutoDiagnosis
