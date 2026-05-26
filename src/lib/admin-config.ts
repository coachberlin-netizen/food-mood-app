/**
 * Admin Configuration
 * 
 * Simple but robust whitelist-based security.
 * The list of emails can be updated via .env.local
 */

/**
 * Checks if a given email is in the admin whitelist.
 */
export function isAdmin(email?: string): boolean {
  if (!email) return false;
  const rawEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'coachberlin@gmail.com';
  const adminEmails = rawEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  // Also explicitly add coachberlin@gmail.com as an emergency fallback just in case env vars fail on Vercel
  if (!adminEmails.includes('coachberlin@gmail.com')) {
    adminEmails.push('coachberlin@gmail.com');
  }
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Checks if a user object from Supabase Auth is an admin.
 */
export function isUserAdmin(user: { email?: string | null } | null | undefined): boolean {
  return isAdmin(user?.email ?? undefined);
}
