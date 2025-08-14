import React from 'react'

const Timeline: React.FC = () => {
	const phases = [
		{ name: 'Diagnóstico', start: '2025-02-01', end: '2025-04-30' },
		{ name: 'Políticas', start: '2025-05-01', end: '2025-06-30' },
		{ name: 'Seguridad', start: '2025-07-01', end: '2025-08-31' },
		{ name: 'Transferencias', start: '2025-09-01', end: '2025-10-15' },
		{ name: 'Monitoreo', start: '2025-10-16', end: '2025-12-01' }
	]

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Línea de Tiempo</h1>
			<div className="card">
				<div className="space-y-3">
					{phases.map(p => (
						<div key={p.name} className="flex items-center gap-4">
							<div className="w-40 font-medium">{p.name}</div>
							<div className="flex-1 h-2 bg-gray-200 rounded-full relative">
								<div className="absolute left-0 top-0 h-2 bg-primary-600 rounded-full" style={{ width: '40%' }}></div>
							</div>
							<div className="w-56 text-sm text-gray-600">{new Date(p.start).toLocaleDateString('es-CL')} → {new Date(p.end).toLocaleDateString('es-CL')}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Timeline


