import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../lib/supabase'

const Login: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [role, setRole] = useState<UserRole>('Soporte')
	const [loading, setLoading] = useState(false)
	const { signIn, signUp } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		if (isLogin) {
			await signIn(email, password)
		} else {
			await signUp(email, password, name, role)
		}
		setLoading(false)
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
			<div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
				<h1 className="mb-6 text-center text-xl font-semibold">{isLogin ? 'Ingresar' : 'Crear cuenta'}</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<div>
							<label className="mb-1 block text-sm font-medium">Nombre</label>
							<input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
						</div>
					)}
					<div>
						<label className="mb-1 block text-sm font-medium">Email</label>
						<input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium">Contraseña</label>
						<input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					{!isLogin && (
						<div>
							<label className="mb-1 block text-sm font-medium">Rol</label>
							<select className="input-field" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
								<option>DPO</option>
								<option>Legal/Compliance</option>
								<option>Seguridad/IT</option>
								<option>Data Owner</option>
								<option>Soporte</option>
								<option>Auditor lectura</option>
								<option>Titular externo</option>
							</select>
						</div>
					)}
					<button className="btn-primary w-full" disabled={loading}>
						{loading ? 'Procesando…' : isLogin ? 'Ingresar' : 'Registrarse'}
					</button>
				</form>
				<div className="mt-4 text-center text-sm">
					<button className="text-primary-700 hover:underline" onClick={() => setIsLogin((v) => !v)}>
						{isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Login


