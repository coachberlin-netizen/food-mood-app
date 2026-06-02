import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Uso: node scripts/create-demo-user.mjs <password>
const DEMO_PASSWORD = process.argv[2]
if (!DEMO_PASSWORD) {
  console.error('Uso: node scripts/create-demo-user.mjs <contraseña>')
  process.exit(1)
}

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

const DEMO_EMAIL = 'demo-pro@food-mood.app'

async function run() {
  console.log('\nCreando cuenta demo profesional…\n')

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email:         DEMO_EMAIL,
    password:      DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      name:              'Demo Profesional',
      professional_type: 'Nutricionista / Dietista',
    },
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log(`ℹ️  El usuario ${DEMO_EMAIL} ya existe. Actualizando perfil profesional…`)
      const { data: existing } = await admin.auth.admin.listUsers()
      const found = existing?.users?.find(u => u.email === DEMO_EMAIL)
      if (found) {
        await admin.auth.admin.updateUserById(found.id, { password: DEMO_PASSWORD })
        await upsertProfessional(found.id)
        console.log('\n✅  Cuenta demo lista.')
      }
      return
    }
    console.error('Error al crear usuario:', authError.message)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`✅  Usuario creado: ${DEMO_EMAIL} (id: ${userId})`)
  await upsertProfessional(userId)
  console.log('\n✅  Cuenta demo lista. Email: ' + DEMO_EMAIL)
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

run().catch(err => { console.error(err); process.exit(1) })
