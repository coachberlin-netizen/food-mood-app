import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function test() {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  console.log('--- Resend Test ---');
  console.log('API Key:', apiKey ? (apiKey.startsWith('re_') ? 'Valid format' : 'Placeholder') : 'Missing');
  console.log('Admin Email:', adminEmail);
  
  if (!apiKey || apiKey === 'replace_me_with_real_key') {
    console.error('❌ Error: Debes configurar RESEND_API_KEY en .env.local');
    return;
  }

  const resend = new Resend(apiKey);
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail || 'test@example.com',
      subject: 'Test de notificación Food·Mood',
      text: 'La integración técnica de Resend está lista.',
    });
    
    if (error) {
      console.error('❌ Error enviando email:', error);
    } else {
      console.log('✅ Email enviado con éxito:', data);
    }
  } catch (err) {
    console.error('💥 Excepción:', err);
  }
}

test();
