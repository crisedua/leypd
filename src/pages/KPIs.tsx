import React from 'react'

const KPIs: React.FC = () => {
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">KPIs y Métricas</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="card"><div className="text-sm text-gray-600">Readiness Global</div><div className="text-2xl font-semibold">62%</div></div>
				<div className="card"><div className="text-sm text-gray-600">ARCO atendidas este mes</div><div className="text-2xl font-semibold">12</div></div>
				<div className="card"><div className="text-sm text-gray-600">Tiempo medio respuesta incidente</div><div className="text-2xl font-semibold">8h</div></div>
				<div className="card"><div className="text-sm text-gray-600">% contratos revisados</div><div className="text-2xl font-semibold">54%</div></div>
			</div>
			<div className="card">
				<h2 className="font-semibold mb-2">Alertas</h2>
				<ul className="list-disc pl-5 text-sm text-gray-700">
					<li>PIA pendiente en Sistema RRHH</li>
					<li>Contrato de proveedor de Marketing expira en 30 días</li>
				</ul>
			</div>
		</div>
	)
}

export default KPIs


