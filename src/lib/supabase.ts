import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || ''
export const isDemoEnv = !SUPABASE_URL || !SUPABASE_ANON_KEY

export const supabase = isDemoEnv
	// Create a dummy client pointing to a non-existing host to avoid accidental calls in demo
	? ({} as any)
	: createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: true
			}
		})

export type UserRole =
	| 'DPO'
	| 'Legal/Compliance'
	| 'Seguridad/IT'
	| 'Data Owner'
	| 'Soporte'
	| 'Auditor lectura'
	| 'Titular externo'

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	created_at: string
	updated_at: string
}

export interface ProgramStage {
	id: string
	name: string
	description: string
	phase: string
	start_date: string
	end_date: string
	status: 'pending' | 'in_progress' | 'completed'
	deliverables: string[]
	acceptance_criteria: string[]
	dpo_approved: boolean
	created_at?: string
	updated_at?: string
}

export interface Task {
	id: string
	title: string
	description?: string
	owner: string
	status: 'todo' | 'in_progress' | 'blocked' | 'done'
	priority: 'low' | 'medium' | 'high'
	start_date?: string
	due_date?: string
	percent_complete?: number
	dependencies?: string[]
	created_at?: string
	updated_at?: string
}

export interface RoPAEntry {
	id: string
	name: string
	// Responsable del Tratamiento
	organizationName: string
	organizationContact: {
		email: string
		phone: string
	}
	legalRepresentative: {
		name: string
		email: string
		phone: string
	}
	dpoInfo?: {
		name: string
		email: string
		phone: string
	}
	// Finalidad del Tratamiento
	purpose: string
	legalBasis: string
	consentWithdrawal?: string
	// Categorías de Titulares
	dataSubjects: string[]
	// Tipos de Datos Tratados
	dataCategories: string[]
	sensitiveData?: string[]
	// Origen/Fuente de los Datos
	dataSource: 'direct' | 'public' | 'third_party'
	dataSourceDescription?: string
	// Transferencias Internacionales
	internationalTransfers: boolean
	transferDestinations?: string[]
	contractualMeasures?: string[]
	// Plazo de Conservación
	retentionPeriod: string
	// Medidas de Seguridad
	securityMeasures: string[]
	organizationalMeasures?: string[]
	// Decisiones Automatizadas/Perfiles
	automatedDecisions: boolean
	automatedDecisionsDescription?: string
	// Historial de Cambios
	changeHistory: Array<{
		date: string
		user: string
		description: string
	}>
	// Evidencia Adjunta
	attachedDocuments?: string[]
	// Comentarios/Notas Internas
	internalNotes?: string
	// Estado y metadatos
	status: 'active' | 'inactive' | 'pending_review'
	lastUpdated: string
	owner: string
}

export interface DSARRequest {
	id: string
	requestor_name: string
	requestor_email: string
	type: 'acceso' | 'rectificacion' | 'supresion' | 'oposicion' | 'portabilidad' | 'bloqueo'
	description?: string
	status: 'nuevo' | 'verificacion' | 'en_proceso' | 'aprobacion' | 'completado'
	due_date: string
	created_at?: string
	updated_at?: string
}

export interface DPIACase {
	id: string
	title: string
	description?: string
	purpose: string
	context?: string
	profiling?: boolean
	sensitive_data?: boolean
	status: 'nuevo' | 'evaluacion' | 'mitigacion' | 'aprobacion' | 'cerrado'
	risk_score: number
	created_at?: string
	updated_at?: string
}

export interface Incident {
	id: string
	title: string
	severity: 'low' | 'medium' | 'high'
	status: 'open' | 'investigating' | 'resolved'
	created_at?: string
	updated_at?: string
}

export interface Vendor {
	id: string
	name: string
	location?: string
	transfer_mechanism?: string
	risk_score?: number
	created_at?: string
	updated_at?: string
}

export interface ConsentPoint {
	id: string
	channel: string
	notice_version: string
	proof?: string
	created_at?: string
	updated_at?: string
}

export interface Policy {
	id: string
	title: string
	version: string
	owner?: string
	created_at?: string
	updated_at?: string
}

export interface AuditLog {
	id: string
	action: string
	actor_id: string
	entity: string
	entity_id: string
	before?: any
	after?: any
	created_at: string
}


