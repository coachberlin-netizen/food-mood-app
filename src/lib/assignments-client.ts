import { createClient } from "@/lib/supabase/client"

export async function createAssignmentCompletion(assignmentId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from("assignment_completions").insert({
    assignment_id:   assignmentId,
    patient_user_id: user.id,
  })
}
