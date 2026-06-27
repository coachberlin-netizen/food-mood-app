// El acceso al blog está gestionado por el middleware (cookie blog_access=ok).
// Este layout no necesita verificar auth — el middleware ya redirige a /blog/acceso.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
