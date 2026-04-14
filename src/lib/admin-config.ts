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
  const rawEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  const adminEmails = rawEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Checks if a user object from Supabase Auth is an admin.
 */
export function isUserAdmin(user: any): boolean {
  return isAdmin(user?.email);
}
