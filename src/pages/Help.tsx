import React from 'react'

const Help: React.FC = () => {
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Ayuda y Recursos</h1>
			<div className="card">
				<h2 className="font-semibold mb-2">Guía rápida</h2>
				<ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
					<li>Revisa el Mapa de Cumplimiento y ajusta fechas</li>
					<li>Trabaja las Checklists por fase y adjunta evidencias</li>
					<li>Gestiona tareas en PM y genera reportes</li>
					<li>Monitorea KPIs y configura recordatorios</li>
				</ol>
			</div>
			<div className="card">
				<h2 className="font-semibold mb-2">Preguntas frecuentes</h2>
				<ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
					<li>¿Cuándo debo realizar un PIA? Cuando el tratamiento implique alto riesgo (datos sensibles, perfilamiento, etc.).</li>
					<li>¿Cuál es el plazo para responder ARCO? 30 días corridos + prórroga justificada.</li>
				</ul>
			</div>
		</div>
	)
}

export default Help


