"use server";

import { createClient } from '@/lib/supabase/server';

export async function saveWhatsAppOptInAction(phone: string, optIn: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('No autenticada.');

  const { error } = await supabase
    .from('profiles')
    .update({
      whatsapp_phone:       optIn ? phone.trim() : null,
      whatsapp_opt_in:      optIn,
      whatsapp_opt_in_at:   optIn ? new Date().toISOString() : null,
      whatsapp_opt_in_source: optIn ? 'settings' : null,
    })
    .eq('id', user.id);

  if (error) throw new Error(error.message);
}

export async function getWhatsAppOptInAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('whatsapp_phone, whatsapp_opt_in')
    .eq('id', user.id)
    .maybeSingle();

  return data;
}
