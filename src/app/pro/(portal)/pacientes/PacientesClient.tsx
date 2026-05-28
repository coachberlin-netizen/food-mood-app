"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import { useLinkedPatients } from "@/hooks/useLinkedPatients"

export default function PacientesClient() {
  const { patients, loading } = useLinkedPatients()
  const router = useRouter()

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#6B2737]">Pacientes</h1>
        <p className="text-sm text-[#6B2737]/60 mt-1">Personas vinculadas a tu consulta.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#6B2737]/10">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[#6B2737]/40">Cargando...</div>
        ) : patients.length === 0 ? (
          <div className="px-6 py-16 flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-[#6B2737]/5 rounded-full">
              <Users className="w-8 h-8 text-[#6B2737]/30" />
            </div>
            <div>
              <p className="font-semibold text-[#6B2737]">Ningún paciente vinculado todavía</p>
              <p className="text-sm text-[#6B2737]/50 mt-1">
                Crea una invitación y comparte el código con tu paciente.
              </p>
            </div>
            <Link
              href="/pro/invitaciones"
              className="mt-2 px-5 py-2.5 bg-[#6B2737] text-white rounded-xl text-sm font-medium hover:bg-[#6B2737]/90 transition-all"
            >
              Crear invitación
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-[#6B2737]/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B2737]/40">
                {patients.length} paciente{patients.length !== 1 ? "s" : ""} activo{patients.length !== 1 ? "s" : ""}
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#6B2737]/5">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40 hidden sm:table-cell">
                    Vinculación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B2737]/5">
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#6B2737]/[0.03] transition-colors cursor-pointer"
                    onClick={() => router.push(`/pro/pacientes/${p.patient_user_id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#6B2737]">
                        {p.patient_name ?? <span className="text-[#6B2737]/40 italic">Sin nombre</span>}
                      </p>
                      {p.patient_email && (
                        <p className="text-xs text-[#6B2737]/40 mt-0.5">{p.patient_email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B2737]/60 hidden sm:table-cell">
                      {new Date(p.linked_at).toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}
