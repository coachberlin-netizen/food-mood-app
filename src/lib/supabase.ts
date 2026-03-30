import { createClient } from "@supabase/supabase-js";

// Placeholder Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://placeholder.url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

export async function saveTestResultToSupabase(
  userId: string,
  userEmail: string,
  foodMoodState: string,
  testAnswers: Record<string, any>
) {
  const { data, error } = await supabase
    .from('test_results')
    .insert([{
      user_id: userId,
      user_email: userEmail,
      food_mood_state: foodMoodState,
      test_answers: testAnswers
    }])
  if (error) throw error
  return data
}
