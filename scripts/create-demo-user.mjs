import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)/)?.[1]
const serviceKey  = env.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)/)?.[1]

if (!supabaseUrl || !serviceKey) {
  console.error('Faltan variables de entorno. Comprueba .env.local')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_EMAIL    = 'demo-pro@food-mood.app'
const DEMO_PASSWORD = 'FoodMood2026!'

async function run() {
  console.log('\nCreando cuenta demo profesional…\n')

  // 1. Crear usuario en auth (confirmar email directamente)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email:            DEMO_EMAIL,
    password:         DEMO_PASSWORD,
    email_confirm:    true,
    user_metadata: {
      name:             'Demo Profesional',
      professional_type: 'Nutricionista / Dietista',
    },
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log(`ℹ️  El usuario ${DEMO_EMAIL} ya existe. Continuando con el perfil profesional…`)
      const { data: existing } = await admin.auth.admin.listUsers()
      const found = existing?.users?.find(u => u.email === DEMO_EMAIL)
      if (found) {
        await upsertProfessional(found.id)
        console.log('\n✅  Cuenta demo lista.')
        printCredentials()
      }
      return
    }
    console.error('Error al crear usuario:', authError.message)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`✅  Usuario creado: ${DEMO_EMAIL} (id: ${userId})`)

  await upsertProfessional(userId)

  console.log('\n✅  Cuenta demo lista.')
  printCredentials()
}

async function upsertProfessional(userId) {
  const { error } = await admin
    .from('professionals')
    .upsert({
      id:                  userId,
      email:               DEMO_EMAIL,
      full_name:           'Demo Profesional',
      professional_title:  'Nutricionista / Dietista',
      subscription_status: 'active',
      subscription_tier:   'pro',
    }, { onConflict: 'id' })

  if (error) {
    console.error('Error al crear perfil profesional:', error.message)
    process.exit(1)
  }
  console.log('✅  Perfil profesional creado/actualizado.')
}

function printCredentials() {
  console.log('\n─────────────────────────────────────')
  console.log('  CREDENCIALES DE DEMO')
  console.log('─────────────────────────────────────')
  console.log(`  Email:      ${DEMO_EMAIL}`)
  console.log(`  Contraseña: ${DEMO_PASSWORD}`)
  console.log(`  Portal:     /pro/login`)
  console.log('─────────────────────────────────────\n')
}

run().catch(err => { console.error(err); process.exit(1) })
