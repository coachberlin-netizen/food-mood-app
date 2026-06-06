"use client"

import { ClipboardList } from "lucide-react"
import type { ActiveAssignment } from "@/hooks/useAssignments"

export function AssignmentInstructionBanner({ assignment }: { assignment: ActiveAssignment | null }) {
  if (!assignment) return null
  return (
    <div
      className="mb-5 rounded-xl px-4 py-3.5"
      style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.25)" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <ClipboardList className="w-3.5 h-3.5 shrink-0" style={{ color: "#FF6B35" }} />
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#FF6B35" }}>
          Asignación{assignment.professional_name ? ` de ${assignment.professional_name}` : ""}
        </p>
      </div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: "#2d0f16" }}>{assignment.title}</p>
      <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.7)" }}>
        {assignment.instruction}
      </p>
    </div>
  )
}
