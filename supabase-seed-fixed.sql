-- Fixed Supabase Seed Script
-- Run this in Supabase SQL Editor

-- First, create extensions if not exists
create extension if not exists "pgcrypto";

-- Create a demo user in auth.users first
DO $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
  v_demo_email text := 'demo@empresa.cl';
  v_demo_password text := 'DemoPass123!';
BEGIN
  -- Create auth user if not exists
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    v_demo_email,
    crypt(v_demo_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING;

  -- Get the user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_demo_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create or find demo user';
  END IF;

  -- Create organization
  INSERT INTO organizations (name, address, contact_email, website)
  VALUES ('Organización Demo', 'Av. Providencia 1234, Santiago', 'contacto@empresa.cl', 'https://empresa.cl')
  ON CONFLICT (name) DO UPDATE SET 
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email
  RETURNING id INTO v_org_id;

  -- Create user profile
  INSERT INTO user_profiles (id, org_id, full_name, role, email, phone, department)
  VALUES (v_user_id, v_org_id, 'Usuario Demo', 'dpo', v_demo_email, '+56912345678', 'Legal')
  ON CONFLICT (id) DO UPDATE SET 
    org_id = EXCLUDED.org_id,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

  -- Create program stages
  INSERT INTO program_stages (org_id, name, description, status, order_index, due_date) VALUES
  (v_org_id, 'Fase 0 - Gobernanza & Arranque', 'Establecer estructura de gobierno, roles y políticas base', 'in_progress', 1, '2025-03-01'),
  (v_org_id, 'Fase 1 - Descubrimiento & RoPA', 'Mapeo de sistemas, tratamientos y bases legales', 'pending', 2, '2025-06-01'),
  (v_org_id, 'Fase 2 - DSAR Hub MVP', 'Implementación de gestión de derechos ARCO', 'pending', 3, '2025-09-01'),
  (v_org_id, 'Fase 3 - DPIA & Consentimiento', 'Evaluaciones de impacto y gestión de consentimiento', 'pending', 4, '2025-12-01'),
  (v_org_id, 'Fase 4 - Incidentes & Vendors', 'Gestión de incidentes y evaluación de proveedores', 'pending', 5, '2026-06-01'),
  (v_org_id, 'Fase 5 - Formación & Auditoría', 'Capacitación y preparación para auditoría', 'pending', 6, '2026-11-01');

  -- Create checklist items
  INSERT INTO checklist_items (org_id, phase, title, description, assignee, status, due_date) VALUES
  (v_org_id, 'diagnostico', 'Mapear sistemas que procesan datos personales', 'Identificar todos los sistemas, aplicaciones y procesos que manejan datos personales en la organización', v_user_id, 'completed', '2025-02-15'),
  (v_org_id, 'diagnostico', 'Inventariar tipos de datos personales', 'Clasificar datos según categorías: personales, sensibles, de menores', v_user_id, 'in_progress', '2025-02-28'),
  (v_org_id, 'politicas', 'Redactar política de privacidad', 'Crear política de privacidad conforme a Ley 21.719', v_user_id, 'pending', '2025-03-15'),
  (v_org_id, 'organizacion', 'Designar Delegado de Protección de Datos', 'Nombrar DPO interno o contratar externo', v_user_id, 'completed', '2025-01-31'),
  (v_org_id, 'seguridad', 'Implementar medidas técnicas de seguridad', 'Cifrado, control de acceso, backups seguros', v_user_id, 'pending', '2025-04-30'),
  (v_org_id, 'transferencias', 'Revisar contratos con proveedores', 'Actualizar contratos para incluir cláusulas de protección de datos', v_user_id, 'pending', '2025-05-31');

  -- Create sample RoPA entries
  INSERT INTO ropa_entries (
    org_id, created_by, activity_name, purpose, data_categories, data_subjects,
    legal_basis, retention_period, recipients, international_transfers,
    security_measures, status
  ) VALUES
  (v_org_id, v_user_id, 'Gestión de Clientes CRM', 'Administración de relaciones comerciales', 
   '{"nombres", "emails", "teléfonos", "direcciones"}', '{"clientes", "prospectos"}',
   'Ejecución de contrato', '5 años desde última interacción', 
   '{"equipo comercial", "soporte técnico"}', false,
   '{"cifrado en tránsito", "control de acceso", "backups"}', 'active'),
  
  (v_org_id, v_user_id, 'Recursos Humanos', 'Gestión de personal y nóminas',
   '{"datos personales", "datos laborales", "datos bancarios"}', '{"empleados", "candidatos"}',
   'Obligación legal', '10 años según legislación laboral',
   '{"RRHH", "contabilidad", "AFP", "ISAPRE"}', false,
   '{"cifrado de base de datos", "acceso restringido"}', 'active');

  -- Create sample DSAR requests
  INSERT INTO dsar_requests (
    org_id, created_by, request_type, status, priority, subject_name, subject_email,
    description, legal_basis, verification_method
  ) VALUES
  (v_org_id, v_user_id, 'access', 'completed', 'medium', 'Juan Pérez', 'juan.perez@email.com',
   'Solicitud de acceso a datos personales almacenados', 'Derecho de acceso Art. 12', 'email_verification'),
  
  (v_org_id, v_user_id, 'deletion', 'in_progress', 'high', 'María González', 'maria.gonzalez@email.com',
   'Solicitud de eliminación de datos tras cancelación de servicio', 'Derecho de supresión Art. 15', 'id_verification'),
  
  (v_org_id, v_user_id, 'rectification', 'pending', 'medium', 'Carlos Silva', 'carlos.silva@email.com',
   'Corrección de datos de contacto incorrectos', 'Derecho de rectificación Art. 14', 'phone_verification');

  -- Create sample tasks
  INSERT INTO tasks (
    org_id, created_by, title, description, assignee, status, priority, due_date, stage_id
  ) VALUES
  (v_org_id, v_user_id, 'Completar mapeo de sistemas', 'Finalizar inventario de todos los sistemas que procesan datos', v_user_id, 'in_progress', 'high', '2025-02-28', 
   (SELECT id FROM program_stages WHERE name LIKE 'Fase 1%' AND org_id = v_org_id)),
  
  (v_org_id, v_user_id, 'Revisar política de privacidad', 'Actualizar política según nuevos requerimientos', v_user_id, 'pending', 'medium', '2025-03-15',
   (SELECT id FROM program_stages WHERE name LIKE 'Fase 0%' AND org_id = v_org_id)),
  
  (v_org_id, v_user_id, 'Configurar portal DSAR', 'Implementar formulario web para solicitudes ARCO', v_user_id, 'pending', 'high', '2025-04-30',
   (SELECT id FROM program_stages WHERE name LIKE 'Fase 2%' AND org_id = v_org_id));

  -- Create sample documents
  INSERT INTO documents (
    org_id, uploaded_by, name, description, category, version, status, tags,
    evidence_type, access_level
  ) VALUES
  (v_org_id, v_user_id, 'Política de Privacidad v2.1', 'Política de privacidad actualizada conforme Ley 21.719', 'policy', '2.1', 'approved',
   '{"privacidad", "política", "ley21719"}', 'compliance_document', 'internal'),
  
  (v_org_id, v_user_id, 'Registro de Actividades de Tratamiento', 'RoPA completo de la organización', 'ropa', '1.0', 'draft',
   '{"ropa", "tratamiento", "datos"}', 'compliance_document', 'restricted'),
  
  (v_org_id, v_user_id, 'Manual DPO', 'Guía de procedimientos para el Delegado de Protección de Datos', 'manual', '1.0', 'approved',
   '{"dpo", "procedimientos", "manual"}', 'training_material', 'internal'),
  
  (v_org_id, v_user_id, 'Contrato Proveedor Cloud', 'Acuerdo de procesamiento de datos con proveedor cloud', 'contract', '1.2', 'approved',
   '{"contrato", "proveedor", "cloud"}', 'legal_document', 'restricted');

  RAISE NOTICE 'Seed data created successfully for organization: % and user: %', v_org_id, v_user_id;
  RAISE NOTICE 'Demo user credentials: email=%, password=%', v_demo_email, v_demo_password;

END $$;
