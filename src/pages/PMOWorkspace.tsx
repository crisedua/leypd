import React, { useMemo, useState } from 'react'

type Status = 'todo' | 'in_progress' | 'blocked' | 'done'

interface PMTask {
    id: string
    title: string
    owner?: string
    dueDate?: string
    status: Status
}

const seedTasks: PMTask[] = [
    { id: 't1', title: 'Definir alcance del programa de cumplimiento', status: 'in_progress', owner: 'DPO', dueDate: '2025-09-20' },
    { id: 't2', title: 'Completar inventario de sistemas (RAT base)', status: 'todo', owner: 'IT', dueDate: '2025-10-05' },
    { id: 't3', title: 'Actualizar política de privacidad', status: 'todo', owner: 'Legal', dueDate: '2025-10-15' },
    { id: 't4', title: 'Diseñar flujo ARCO y portabilidad', status: 'blocked', owner: 'Soporte', dueDate: '2025-10-10' },
    { id: 't5', title: 'Plan de respuesta a incidentes', status: 'todo', owner: 'Seguridad', dueDate: '2025-10-08' },
    { id: 't6', title: 'Revisión de contratos con proveedores', status: 'in_progress', owner: 'Compras', dueDate: '2025-10-25' },
]

const PMOWorkspace: React.FC = () => {
    const [tasks, setTasks] = useState<PMTask[]>(seedTasks)
    const columns: { key: Status; title: string }[] = [
        { key: 'todo', title: 'Por hacer' },
        { key: 'in_progress', title: 'En progreso' },
        { key: 'blocked', title: 'Bloqueado' },
        { key: 'done', title: 'Hecho' }
    ]

    const grouped = useMemo(() => {
        return columns.reduce((acc, col) => {
            acc[col.key] = tasks.filter(t => t.status === col.key)
            return acc
        }, {} as Record<Status, PMTask[]>)
    }, [tasks])

    const move = (id: string, to: Status) => {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, status: to } : t)))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">PM Tareas (Kanban)</h1>
                <button className="btn-secondary" onClick={() => setTasks(prev => [...prev, { id: `t${prev.length + 1}`, title: 'Nueva tarea', status: 'todo' }])}>Nueva tarea</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map(col => (
                    <div key={col.key} className="card">
                        <div className="mb-3 font-semibold">{col.title}</div>
                        <div className="space-y-2">
                            {grouped[col.key].map(t => (
                                <div key={t.id} className="rounded border border-gray-200 bg-white p-3 shadow-sm">
                                    <div className="font-medium">{t.title}</div>
                                    <div className="mt-1 text-xs text-gray-600">{t.owner || 'Sin asignar'} • {t.dueDate || 'Sin fecha'}</div>
                                    <div className="mt-2 flex gap-2">
                                        {columns.map(c => (
                                            c.key !== t.status && (
                                                <button key={c.key} className="btn-secondary text-xs" onClick={() => move(t.id, c.key)}>
                                                    Mover a {c.title}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PMOWorkspace


