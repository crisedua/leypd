import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProgramGuide from './pages/ProgramGuide'
import PMOWorkspace from './pages/PMOWorkspace'
import Checklists from './pages/Checklists'
import Reports from './pages/Reports'
import KPIs from './pages/KPIs'
import Timeline from './pages/Timeline'
import Users from './pages/Users'
import Help from './pages/Help'
import Settings from './pages/Settings'
import Documents from './pages/Documents'
import RoPA from './pages/RoPA'
import DSARHub from './pages/DSARHub'
import DPIACopilot from './pages/DPIACopilot'
import IncidentManager from './pages/IncidentManager'
import Vendors from './pages/Vendors'
import Consent from './pages/Consent'
import Governance from './pages/Governance'
import Dashboards from './pages/Dashboards'
import WebScraper from './pages/WebScraper'
import AutoDiagnosis from './pages/AutoDiagnosis'
import './index.css'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useAuth()
	if (loading) return <div className="p-6">Cargando…</div>
	return user ? <>{children}</> : <Navigate to="/login" />
}

const App: React.FC = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Toaster position="top-right" />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Layout>
									<Home />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/roadmap"
						element={
							<ProtectedRoute>
								<Layout>
									<ProgramGuide />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route path="/pm-tareas" element={<ProtectedRoute><Layout><PMOWorkspace /></Layout></ProtectedRoute>} />
					<Route path="/checklists" element={<ProtectedRoute><Layout><Checklists /></Layout></ProtectedRoute>} />
					<Route path="/reportes" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
					<Route path="/kpis" element={<ProtectedRoute><Layout><KPIs /></Layout></ProtectedRoute>} />
					<Route path="/timeline" element={<ProtectedRoute><Layout><Timeline /></Layout></ProtectedRoute>} />
					<Route path="/usuarios" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
					<Route path="/ayuda" element={<ProtectedRoute><Layout><Help /></Layout></ProtectedRoute>} />
					<Route path="/configuracion" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
					<Route path="/documentos" element={<ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
					<Route path="/ropa" element={<ProtectedRoute><Layout><RoPA /></Layout></ProtectedRoute>} />
					<Route path="/dsar" element={<ProtectedRoute><Layout><DSARHub /></Layout></ProtectedRoute>} />
					<Route path="/dpia" element={<ProtectedRoute><Layout><DPIACopilot /></Layout></ProtectedRoute>} />
					<Route path="/incidentes" element={<ProtectedRoute><Layout><IncidentManager /></Layout></ProtectedRoute>} />
					<Route path="/proveedores" element={<ProtectedRoute><Layout><Vendors /></Layout></ProtectedRoute>} />
					<Route path="/consentimiento" element={<ProtectedRoute><Layout><Consent /></Layout></ProtectedRoute>} />
					<Route path="/gobernanza" element={<ProtectedRoute><Layout><Governance /></Layout></ProtectedRoute>} />
					<Route path="/dashboards" element={<ProtectedRoute><Layout><Dashboards /></Layout></ProtectedRoute>} />
					<Route path="/web-scraper" element={<ProtectedRoute><Layout><WebScraper /></Layout></ProtectedRoute>} />
					<Route path="/auto-diagnostico" element={<ProtectedRoute><Layout><AutoDiagnosis /></Layout></ProtectedRoute>} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
