import React from 'react'

const Users: React.FC = () => {
	const roles = [
		{ role: 'Project Owner', permisos: 'Total' },
		{ role: 'DPO', permisos: 'Cumplimiento, reportes, auditoría' },
		{ role: 'Team Member', permisos: 'Ver/editar tareas' },
		{ role: 'External Auditor', permisos: 'Sólo lectura de reportes y evidencias' }
	]

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Usuarios y Permisos</h1>
			<div className="card">
				<table className="w-full text-sm">
					<thead className="text-left text-gray-600">
						<tr>
							<th className="py-2">Rol</th>
							<th className="py-2">Permisos</th>
						</tr>
					</thead>
					<tbody>
						{roles.map(r => (
							<tr key={r.role} className="border-t">
								<td className="py-2">{r.role}</td>
								<td className="py-2 text-gray-700">{r.permisos}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Users


