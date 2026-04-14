"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Mostramos el error en la consola
  useEffect(() => {
    console.error("ADMIN ERROR BOUNDARY CAUGHT ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-red-50 text-red-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-xl border border-red-100 w-full text-left">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="text-red-500">🔥</span> Error en el Panel Admin
        </h2>
        
        <div className="bg-red-50 p-4 rounded-xl mb-6 font-mono text-sm overflow-auto text-red-800 border border-red-100">
          <p className="font-bold mb-2 break-all">{error.name}: {error.message}</p>
          {error.digest && <p className="text-red-500/70 text-xs mt-2">Digest: {error.digest}</p>}
          <p className="text-xs mt-4 opacity-70 whitespace-pre-wrap">{error.stack}</p>
        </div>

        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full"
        >
          Intentar recargar
        </button>
      </div>
    </div>
  );
}
