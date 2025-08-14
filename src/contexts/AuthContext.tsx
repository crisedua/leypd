import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, User, UserRole, isDemoEnv } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
	user: User | null
	session: Session | null
	loading: boolean
	signIn: (email: string, password: string) => Promise<void>
	signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>
	signOut: () => Promise<void>
	updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const init = async () => {
			if (isDemoEnv) {
				// Demo mode: auto-login a mock user
				setUser({
					id: 'demo-user',
					email: 'demo@example.com',
					name: 'Usuario Demo',
					role: 'Soporte',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				})
				setLoading(false)
				return
			}
			const { data } = await supabase.auth.getSession()
			setSession(data.session)
			if (data.session?.user) {
				await fetchUserProfile(data.session.user.id)
			}
			setLoading(false)
		}
		init()

		if (!isDemoEnv) {
			const { data: listener } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, newSession: Session | null) => {
				setSession(newSession)
				if (newSession?.user) {
					await fetchUserProfile(newSession.user.id)
				} else {
					setUser(null)
				}
			})
			return () => {
				listener.subscription.unsubscribe()
			}
		}
		return () => {}
	}, [])

	const fetchUserProfile = async (userId: string) => {
		const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
		if (error) {
			console.error(error)
			return
		}
		setUser(data as User)
	}

	const signIn = async (email: string, password: string) => {
		setLoading(true)
		if (isDemoEnv) {
			setUser({
				id: 'demo-user',
				email,
				name: 'Usuario Demo',
				role: 'Soporte',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			setLoading(false)
			return
		}
		const { error } = await supabase.auth.signInWithPassword({ email, password })
		if (error) toast.error(error.message)
		setLoading(false)
	}

	const signUp = async (email: string, password: string, name: string, role: UserRole) => {
		setLoading(true)
		if (isDemoEnv) {
			setUser({
				id: 'demo-user',
				email,
				name: name || 'Usuario Demo',
				role,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			setLoading(false)
			return
		}
		const { data, error } = await supabase.auth.signUp({ email, password })
		if (error || !data.user) {
			toast.error(error?.message || 'No se pudo registrar')
			setLoading(false)
			return
		}
		await supabase.from('users').insert({ id: data.user.id, email, name, role })
		toast.success('Cuenta creada. Revisa tu correo para confirmar')
		setLoading(false)
	}

	const signOut = async () => {
		if (!isDemoEnv) {
			await supabase.auth.signOut()
		}
		setUser(null)
	}

	const updateProfile = async (updates: Partial<User>) => {
		if (!user) return
		if (!isDemoEnv) {
			const { error } = await supabase.from('users').update(updates).eq('id', user.id)
			if (error) {
				toast.error(error.message)
				return
			}
		}
		toast.success('Perfil actualizado')
		setUser({ ...user, ...updates })
	}

	const value: AuthContextType = {
		user,
		session,
		loading,
		signIn,
		signUp,
		signOut,
		updateProfile
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


