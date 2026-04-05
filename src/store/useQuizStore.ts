import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MoodId } from '@/lib/types';
import { OptionPoint, quizData } from '@/data/quiz';
import { createClient } from '@/lib/supabase/client';

export interface MoodEntry {
  id: string;
  date: string; // ISO string without time or just the ISO date
  moodId: MoodId;
  note?: string;
  timestamp: number;
}

interface QuizState {
  currentStep: number;
  selections: OptionPoint[][];
  isFinished: boolean;
  resultMood: MoodId | null;
  leadingMood: MoodId | null; // For dynamic background color
  
  // Dashboard states
  moodHistory: MoodEntry[];
  savedRecipes: string[];
  completedRecipes: string[];
  quizCount: number;

  answerQuestion: (points: OptionPoint[]) => void;
  resetQuiz: () => void;
  goBack: () => void;
  calculateResult: () => void;
  
  // Dashboard actions
  toggleSavedRecipe: (recipeId: string) => void;
  toggleCompletedRecipe: (recipeId: string) => void;
  clearHistory: () => void;
  addDailyMood: (moodId: MoodId, note?: string) => void;
  syncFromSupabase: () => Promise<void>;
}

const getLeadingMood = (selections: OptionPoint[][]): MoodId | null => {
  const scores: Record<MoodId, number> = {
    activacion: 0, focus: 0, social: 0, reset: 0, calma: 0, familia: 0,
  };
  
  let hasPoints = false;
  selections.forEach(stepPoints => {
    stepPoints.forEach(p => {
      scores[p.mood] += p.points;
      hasPoints = true;
    });
  });

  if (!hasPoints) return null;

  const priority: MoodId[] = ["activacion", "focus", "social", "reset", "calma", "familia"];
  let winner: MoodId = "activacion";
  let maxScore = -1;

  priority.forEach((mood) => {
    if (scores[mood] > maxScore) {
      maxScore = scores[mood];
      winner = mood;
    }
  });

  return winner;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      selections: [],
      isFinished: false,
      resultMood: null,
      leadingMood: null,
      
      moodHistory: [],
      savedRecipes: [],
      completedRecipes: [],
      quizCount: 0,

      syncFromSupabase: async () => {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return;

          const [moodsRes, recipesRes, quizRes] = await Promise.all([
            supabase.from('mood_entries').select('*').eq('user_id', session.user.id),
            supabase.from('saved_recipes').select('*').eq('user_id', session.user.id),
            supabase.from('quiz_results').select('*').eq('user_id', session.user.id)
          ]);

          if (moodsRes.data) {
            const mappedMoods = moodsRes.data.map(m => ({
              id: m.id,
              moodId: m.mood_id as MoodId,
              date: m.created_at,
              note: m.note,
              timestamp: new Date(m.created_at).getTime()
            }));
            set({ moodHistory: mappedMoods });
          }

          if (recipesRes.data) {
            const saved = recipesRes.data.filter(r => !r.completed).map(r => r.recipe_id);
            const completed = recipesRes.data.filter(r => r.completed).map(r => r.recipe_id);
            set({ savedRecipes: saved, completedRecipes: completed });
          }

          if (quizRes.data) {
            set({ quizCount: quizRes.data.length });
          }
        } catch (error) {
          console.error('Failed to sync from Supabase', error);
        }
      },

      answerQuestion: (points) => {
        let finalMoodVal: MoodId | null = null;
        let isDone = false;
        
        set((state) => {
          const newSelections = [...state.selections];
          newSelections[state.currentStep] = points;
          
          const newStep = state.currentStep + 1;
          isDone = newStep >= quizData.length;
          
          finalMoodVal = isDone ? getLeadingMood(newSelections) : state.resultMood;
          
          let newHistory = [...state.moodHistory];
          let newCount = state.quizCount;
          
          if (isDone && finalMoodVal) {
            newHistory.push({ 
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(), 
              moodId: finalMoodVal,
              timestamp: Date.now()
            });
            newCount += 1;
          }

          return {
            selections: newSelections,
            currentStep: newStep,
            isFinished: isDone,
            resultMood: finalMoodVal,
            leadingMood: getLeadingMood(newSelections),
            moodHistory: newHistory,
            quizCount: newCount,
          };
        });

        if (isDone && finalMoodVal) {
          (async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await supabase.from('mood_entries').insert({ user_id: session.user.id, mood_id: finalMoodVal });
              await supabase.from('quiz_results').insert({ user_id: session.user.id, result_mood: finalMoodVal });
            }
          })();
        }
      },

      goBack: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
      })),

      calculateResult: () => {
        const { selections, moodHistory, quizCount } = get();
        const winner = getLeadingMood(selections);
        if (winner) {
          set({ 
            resultMood: winner, 
            isFinished: true,
            moodHistory: [...moodHistory, { 
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(), 
              moodId: winner,
              timestamp: Date.now()
            }],
            quizCount: quizCount + 1,
          });

          (async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await supabase.from('mood_entries').insert({ user_id: session.user.id, mood_id: winner });
              await supabase.from('quiz_results').insert({ user_id: session.user.id, result_mood: winner });
            }
          })();
        }
      },

      resetQuiz: () => set({
        currentStep: 0,
        selections: [],
        isFinished: false,
        resultMood: null,
        leadingMood: null,
      }),

      toggleSavedRecipe: (recipeId) => {
        let isNowSaved = false;
        
        set((state) => {
          const exists = state.savedRecipes.includes(recipeId);
          isNowSaved = !exists;
          return { savedRecipes: exists ? state.savedRecipes.filter(id => id !== recipeId) : [...state.savedRecipes, recipeId] };
        });

        (async () => {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            if (!isNowSaved) {
              await supabase.from('saved_recipes').delete().match({ user_id: session.user.id, recipe_id: recipeId });
            } else {
              // Note: using insert because there's generally no unique constraint on user_id+recipe_id in the provided schema
              // If there was, we should upsert. Assuming straightforward insert/delete.
              await supabase.from('saved_recipes').insert({ user_id: session.user.id, recipe_id: recipeId, completed: false });
            }
          }
        })();
      },
      
      toggleCompletedRecipe: (recipeId) => {
        let isNowCompleted = false;

        set((state) => {
          const exists = state.completedRecipes.includes(recipeId);
          isNowCompleted = !exists;
          return { completedRecipes: exists ? state.completedRecipes.filter(id => id !== recipeId) : [...state.completedRecipes, recipeId] };
        });

        (async () => {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
             // In Supabase schema, completed is a boolean on the same row.
             // We need to update existing row or insert one if not exists (but user likely saved it first)
             const { data } = await supabase.from('saved_recipes').select('id').match({ user_id: session.user.id, recipe_id: recipeId });
             if (data && data.length > 0) {
               await supabase.from('saved_recipes').update({ completed: isNowCompleted }).eq('id', data[0].id);
             } else {
               await supabase.from('saved_recipes').insert({ user_id: session.user.id, recipe_id: recipeId, completed: isNowCompleted });
             }
          }
        })();
      },

      addDailyMood: (moodId, note) => {
        set((state) => {
          const today = new Date();
          today.setHours(0,0,0,0);
          
          const historyWithoutToday = state.moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            entryDate.setHours(0,0,0,0);
            return entryDate.getTime() !== today.getTime();
          });

          return {
            moodHistory: [
              ...historyWithoutToday,
              {
                id: Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                moodId,
                note,
                timestamp: Date.now()
              }
            ]
          };
        });

        (async () => {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from('mood_entries').insert({ user_id: session.user.id, mood_id: moodId, note: note || null });
          }
        })();
      },

      clearHistory: () => set({ moodHistory: [], quizCount: 0, savedRecipes: [], completedRecipes: [] }),
    }),
    {
      name: 'food-mood-quiz',
    }
  )
);
