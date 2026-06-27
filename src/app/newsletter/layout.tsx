// El acceso al newsletter está gestionado por el middleware (cookie newsletter_access=ok).
// Este layout no verifica auth — el middleware redirige a /newsletter/acceso si no hay cookie.
export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
