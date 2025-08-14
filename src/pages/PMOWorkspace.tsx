import React, { useState } from 'react'
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface PhaseTask {
    id: string
    title: string
    description: string
    phase: string
    owner: string
    dueDate: string
    completed: boolean
    completedDate?: string
    priority: 'low' | 'medium' | 'high'
    category: string
}

const phaseTasks: PhaseTask[] = [
    // Fase 1: Inventario y diagnóstico
    {
        id: '1.1',
        title: 'Mapear sistemas que procesan datos personales',
        description: 'Identificar todos los sistemas, aplicaciones y procesos que manejan datos personales',
        phase: 'Fase 1: Inventario y diagnóstico',
        owner: 'IT / Data Owner',
        dueDate: '2025-09-30',
        completed: true,
        completedDate: '2025-09-15',
        priority: 'high',
        category: 'Sistemas'
    },
    {
        id: '1.2',
        title: 'Inventariar tipos de datos personales',
        description: 'Clasificar datos según categorías: personales, sensibles, de menores',
        phase: 'Fase 1: Inventario y diagnóstico',
        owner: 'DPO',
        dueDate: '2025-10-15',
        completed: false,
        priority: 'high',
        category: 'Clasificación'
    },
    {
        id: '1.3',
        title: 'Identificar bases legales para cada tratamiento',
        description: 'Documentar la base legal para cada actividad de procesamiento',
        phase: 'Fase 1: Inventario y diagnóstico',
        owner: 'Legal',
        dueDate: '2025-10-30',
        completed: false,
        priority: 'high',
        category: 'Legal'
    },
    {
        id: '1.4',
        title: 'Mapear transferencias internacionales',
        description: 'Identificar transferencias de datos a terceros países',
        phase: 'Fase 1: Inventario y diagnóstico',
        owner: 'DPO',
        dueDate: '2025-11-15',
        completed: false,
        priority: 'medium',
        category: 'Transferencias'
    },

    // Fase 2: Nuevas políticas y procedimientos
    {
        id: '2.1',
        title: 'Redactar política de privacidad',
        description: 'Crear política de privacidad conforme a Ley 21.719',
        phase: 'Fase 2: Nuevas políticas y procedimientos',
        owner: 'Legal',
        dueDate: '2025-12-31',
        completed: false,
        priority: 'high',
        category: 'Políticas'
    },
    {
        id: '2.2',
        title: 'Desarrollar procedimientos ARCO',
        description: 'Procedimientos para acceso, rectificación, cancelación y oposición',
        phase: 'Fase 2: Nuevas políticas y procedimientos',
        owner: 'DPO',
        dueDate: '2026-01-15',
        completed: false,
        priority: 'high',
        category: 'Procedimientos'
    },
    {
        id: '2.3',
        title: 'Crear política de retención de datos',
        description: 'Definir períodos de retención por tipo de dato',
        phase: 'Fase 2: Nuevas políticas y procedimientos',
        owner: 'Legal',
        dueDate: '2026-01-30',
        completed: false,
        priority: 'medium',
        category: 'Políticas'
    },
    {
        id: '2.4',
        title: 'Establecer procedimientos de consentimiento',
        description: 'Procedimientos para obtención y gestión de consentimiento',
        phase: 'Fase 2: Nuevas políticas y procedimientos',
        owner: 'DPO',
        dueDate: '2026-02-15',
        completed: false,
        priority: 'medium',
        category: 'Procedimientos'
    },

    // Fase 3: Designación de DPO y capacitación
    {
        id: '3.1',
        title: 'Designar Delegado de Protección de Datos',
        description: 'Nombrar DPO interno o contratar externo',
        phase: 'Fase 3: Designación de DPO y capacitación',
        owner: 'RRHH',
        dueDate: '2026-02-28',
        completed: true,
        completedDate: '2025-12-01',
        priority: 'high',
        category: 'Organización'
    },
    {
        id: '3.2',
        title: 'Capacitar equipo en protección de datos',
        description: 'Formación obligatoria para personal que maneja datos personales',
        phase: 'Fase 3: Designación de DPO y capacitación',
        owner: 'DPO',
        dueDate: '2026-03-31',
        completed: false,
        priority: 'high',
        category: 'Capacitación'
    },
    {
        id: '3.3',
        title: 'Establecer canales de comunicación DPO',
        description: 'Definir canales para contacto con titulares de datos',
        phase: 'Fase 3: Designación de DPO y capacitación',
        owner: 'DPO',
        dueDate: '2026-03-15',
        completed: false,
        priority: 'medium',
        category: 'Comunicación'
    },

    // Fase 4: Seguridad y PIA
    {
        id: '4.1',
        title: 'Implementar medidas técnicas de seguridad',
        description: 'Cifrado, control de acceso, backups seguros',
        phase: 'Fase 4: Seguridad y PIA',
        owner: 'IT / Seguridad',
        dueDate: '2026-04-30',
        completed: false,
        priority: 'high',
        category: 'Seguridad'
    },
    {
        id: '4.2',
        title: 'Realizar evaluaciones de impacto (PIA)',
        description: 'Evaluar riesgos para tratamientos de alto riesgo',
        phase: 'Fase 4: Seguridad y PIA',
        owner: 'DPO',
        dueDate: '2026-05-31',
        completed: false,
        priority: 'high',
        category: 'Evaluación'
    },
    {
        id: '4.3',
        title: 'Implementar medidas organizacionales',
        description: 'Políticas de acceso, auditorías, controles internos',
        phase: 'Fase 4: Seguridad y PIA',
        owner: 'DPO',
        dueDate: '2026-05-15',
        completed: false,
        priority: 'medium',
        category: 'Organización'
    },

    // Fase 5: Contratos y transferencias
    {
        id: '5.1',
        title: 'Revisar contratos con proveedores',
        description: 'Actualizar contratos para incluir cláusulas de protección de datos',
        phase: 'Fase 5: Contratos y transferencias',
        owner: 'Legal / Compras',
        dueDate: '2026-06-30',
        completed: false,
        priority: 'high',
        category: 'Contratos'
    },
    {
        id: '5.2',
        title: 'Establecer acuerdos de procesamiento de datos',
        description: 'DPAs con proveedores que procesan datos personales',
        phase: 'Fase 5: Contratos y transferencias',
        owner: 'Legal',
        dueDate: '2026-07-31',
        completed: false,
        priority: 'high',
        category: 'Contratos'
    },
    {
        id: '5.3',
        title: 'Implementar mecanismos de transferencia internacional',
        description: 'Cláusulas estándar, decisiones de adecuación',
        phase: 'Fase 5: Contratos y transferencias',
        owner: 'Legal',
        dueDate: '2026-07-15',
        completed: false,
        priority: 'medium',
        category: 'Transferencias'
    },

    // Fase 6: Monitoreo y actualización
    {
        id: '6.1',
        title: 'Implementar sistema de monitoreo continuo',
        description: 'Monitoreo de cumplimiento y detección de incidentes',
        phase: 'Fase 6: Monitoreo y actualización',
        owner: 'DPO',
        dueDate: '2026-12-31',
        completed: false,
        priority: 'high',
        category: 'Monitoreo'
    },
    {
        id: '6.2',
        title: 'Establecer auditorías internas periódicas',
        description: 'Programa de auditorías para verificar cumplimiento',
        phase: 'Fase 6: Monitoreo y actualización',
        owner: 'Auditoría Interna',
        dueDate: '2026-11-30',
        completed: false,
        priority: 'medium',
        category: 'Auditoría'
    },
    {
        id: '6.3',
        title: 'Crear plan de actualización continua',
        description: 'Proceso para mantener políticas y procedimientos actualizados',
        phase: 'Fase 6: Monitoreo y actualización',
        owner: 'DPO',
        dueDate: '2026-12-31',
        completed: false,
        priority: 'medium',
        category: 'Mantenimiento'
    }
]

const PMOWorkspace: React.FC = () => {
    const [tasks, setTasks] = useState<PhaseTask[]>(phaseTasks)
    const [selectedPhase, setSelectedPhase] = useState<string>('all')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const phases = ['Fase 1: Inventario y diagnóstico', 'Fase 2: Nuevas políticas y procedimientos', 
                   'Fase 3: Designación de DPO y capacitación', 'Fase 4: Seguridad y PIA',
                   'Fase 5: Contratos y transferencias', 'Fase 6: Monitoreo y actualización']
    
    const categories = ['Sistemas', 'Clasificación', 'Legal', 'Transferencias', 'Políticas', 
                       'Procedimientos', 'Organización', 'Capacitación', 'Comunicación', 
                       'Seguridad', 'Evaluación', 'Contratos', 'Monitoreo', 'Auditoría', 'Mantenimiento']

    const filteredTasks = tasks.filter(task => {
        const phaseMatch = selectedPhase === 'all' || task.phase === selectedPhase
        const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory
        return phaseMatch && categoryMatch
    })

    const toggleTask = (taskId: string) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const completed = !task.completed
                return {
                    ...task,
                    completed,
                    completedDate: completed ? new Date().toISOString().split('T')[0] : undefined
                }
            }
            return task
        }))
        toast.success('Tarea actualizada')
    }

    const getProgressByPhase = (phase: string) => {
        const phaseTasks = tasks.filter(t => t.phase === phase)
        const completed = phaseTasks.filter(t => t.completed).length
        return phaseTasks.length > 0 ? Math.round((completed / phaseTasks.length) * 100) : 0
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
            case 'medium': return <ClockIcon className="h-4 w-4 text-yellow-500" />
            case 'low': return <CheckCircleIcon className="h-4 w-4 text-green-500" />
            default: return null
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500'
            case 'medium': return 'border-l-yellow-500'
            case 'low': return 'border-l-green-500'
            default: return 'border-l-gray-300'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tareas por Fase - Ley 21.719</h1>
                <p className="text-gray-600">Sistema de checklist para el cumplimiento de la Ley de Protección de Datos</p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phases.map(phase => {
                    const progress = getProgressByPhase(phase)
                    const phaseTasks = tasks.filter(t => t.phase === phase)
                    const completed = phaseTasks.filter(t => t.completed).length
                    const total = phaseTasks.length
                    
                    return (
                        <div key={phase} className="card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm">{phase.split(':')[0]}</h3>
                                <span className="text-sm text-gray-600">{completed}/{total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500">{progress}% completado</p>
                        </div>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Fase</label>
                        <select 
                            value={selectedPhase} 
                            onChange={(e) => setSelectedPhase(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">Todas las fases</option>
                            {phases.map(phase => (
                                <option key={phase} value={phase}>{phase}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Categoría</label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`card border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 ${
                            task.completed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className="flex-shrink-0 mt-1"
                            >
                                {task.completed ? (
                                    <CheckCircleSolidIcon className="h-6 w-6 text-green-600" />
                                ) : (
                                    <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-600" />
                                )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <UserIcon className="h-3 w-3" />
                                                {task.owner}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {task.dueDate}
                                            </div>
                                            {task.completed && task.completedDate && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircleIcon className="h-3 w-3" />
                                                    Completado: {task.completedDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        {getPriorityIcon(task.priority)}
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {task.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500">No se encontraron tareas con los filtros seleccionados</div>
                </div>
            )}
        </div>
    )
}

export default PMOWorkspace


