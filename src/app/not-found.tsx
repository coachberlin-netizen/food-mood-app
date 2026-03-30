"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <div className="w-24 h-24 bg-aubergine-dark/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <Activity className="w-12 h-12 text-aubergine-dark/30" />
        </div>
        <h1 className="text-6xl md:text-8xl font-serif text-aubergine-dark font-bold mb-4">404</h1>
        <h2 className="text-2xl font-serif text-aubergine-dark mb-4">Página no encontrada</h2>
        <p className="text-aubergine-dark/60 max-w-md mx-auto mb-10">
          Parece que hemos perdido la conexión temporalmente. Tu intestino no sabe interpretar esta ruta web.
        </p>
        
        <Link href="/">
          <Button variant="primary" size="lg" className="rounded-full shadow-lg">
            Volver al inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
