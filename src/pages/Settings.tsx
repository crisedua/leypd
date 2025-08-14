import React, { useState } from 'react'

const Settings: React.FC = () => {
    const [locale, setLocale] = useState<'es-CL' | 'en-US'>('es-CL')
    const [emailReminders, setEmailReminders] = useState(true)
    const [slackWebHook, setSlackWebHook] = useState('')

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Configuración</h1>
            <div className="card space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Idioma/Localización</label>
                    <select className="input-field max-w-xs" value={locale} onChange={(e) => setLocale(e.target.value as 'es-CL' | 'en-US')}>
                        <option value="es-CL">Español (Chile)</option>
                        <option value="en-US">English (US)</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <input id="reminders" type="checkbox" className="h-4 w-4" checked={emailReminders} onChange={(e) => setEmailReminders(e.target.checked)} />
                    <label htmlFor="reminders" className="text-sm">Enviar recordatorios por correo</label>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Integración (Webhook Slack / Teams)</label>
                    <input className="input-field" placeholder="https://hooks.slack.com/..." value={slackWebHook} onChange={(e) => setSlackWebHook(e.target.value)} />
                </div>
                <div>
                    <button className="btn-primary">Guardar cambios</button>
                </div>
            </div>
        </div>
    )
}

export default Settings


