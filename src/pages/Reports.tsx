import React, { useMemo } from 'react'

const Reports: React.FC = () => {
	const dateStr = useMemo(() => new Date().toLocaleString('es-CL'), [])

	const exportPdf = () => {
		alert('Exportar a PDF (placeholder). En producción usaría una librería como jsPDF/Print).')
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Reportes y Documentación</h1>
			<div className="card">
				<div className="mb-4 text-sm text-gray-600">Reporte generado: {dateStr}</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="card">
						<h2 className="font-semibold mb-2">Estado de Cumplimiento</h2>
						<ul className="text-sm text-gray-700 list-disc pl-5">
							<li>Readiness global: 62%</li>
							<li>Riesgos abiertos: 3</li>
							<li>Tareas vencidas: 4</li>
						</ul>
					</div>
					<div className="card">
						<h2 className="font-semibold mb-2">Documentos Clave (plantillas)</h2>
						<ul className="text-sm text-primary-700 list-disc pl-5">
							<li>RAT / Registro de Actividades</li>
							<li>Política de Privacidad</li>
							<li>Notificación de Incidentes</li>
							<li>Cláusulas con Encargados</li>
						</ul>
					</div>
				</div>
				<div className="mt-4">
					<button className="btn-primary" onClick={exportPdf}>Exportar PDF</button>
				</div>
			</div>
		</div>
	)
}

export default Reports


