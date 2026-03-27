# Food·Mood

Tu intestino lleva toda la vida hablando. Por fin alguien lo escucha.
Una plataforma de bienestar orgánico que conecta tu estado emocional con nutrición funcional basada en la ciencia del eje intestino-cerebro.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o pnpm

### Instalación

1. Clona el repositorio e instala las dependencias:
```bash
npm install
```

2. Copia el archivo de entorno de ejemplo:
```bash
cp .env.example .env.local
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 🛠 Stack Tecnológico
- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS + Custom CSS (`globals.css`)
- **Animaciones**: Framer Motion
- **Estado Global**: Zustand (Persistido)
- **Iconos**: Lucide React

## 🧠 Arquitectura Funcional
- `/test`: Motor interactivo de evaluación clínica de 8 pasos.
- `/dashboard`: Panel de control personalizado con tracking diario de estado de ánimo, rachas, y gráficas de distribución.
- `/recetas`: "Botiquín" de recetas funcionales mapeadas por Food Mood.
- `/perfil`: Analítica avanzada del usuario.

## 📦 Deployment
El proyecto está optimizado para ser desplegado instantáneamente en Vercel. 
Ejecuta `npm run build` para asegurar que el código compila sin errores antes del deploy.

---
*Creado para hackear el eje intestino-cerebro a tu favor. Bebe con belleza. Siente todo.*
