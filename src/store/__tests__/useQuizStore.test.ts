import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Hoist: mocks are applied before any imports
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) },
    from: vi.fn(() => ({
      insert:     vi.fn().mockResolvedValue({ error: null }),
      select:     vi.fn().mockReturnThis(),
      eq:         vi.fn().mockReturnThis(),
      delete:     vi.fn().mockReturnThis(),
      match:      vi.fn().mockReturnThis(),
      update:     vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
  }),
}));

vi.mock("@/components/analytics/AnalyticsProvider", () => ({
  trackEvent: vi.fn(),
}));

// 2 questions — controls when quiz finishes
vi.mock("@/data/quiz", () => ({
  quizData: [
    { id: 1, question: "Q1", options: [] },
    { id: 2, question: "Q2", options: [] },
  ],
}));

import { useQuizStore } from "../useQuizStore";
import type { OptionPoint } from "@/data/quiz";

const INITIAL_STATE = {
  currentStep: 0,
  selections: [],
  isFinished: false,
  resultMood: null,
  leadingMood: null,
  moodHistory: [],
  savedRecipes: [],
  completedRecipes: [],
  quizCount: 0,
};

beforeAll(() => {
  // Stub localStorage so zustand persist doesn't throw in node environment
  vi.stubGlobal("localStorage", {
    getItem:    vi.fn().mockReturnValue(null),
    setItem:    vi.fn(),
    removeItem: vi.fn(),
  });
});

beforeEach(() => {
  useQuizStore.setState(INITIAL_STATE);
});

// ------------------------------------------------------------------
// getLeadingMood (tested indirectly via leadingMood / resultMood)
// ------------------------------------------------------------------

describe("getLeadingMood — mood scoring", () => {
  it("picks the highest-scoring mood after one answer", () => {
    const points: OptionPoint[] = [{ mood: "focus", points: 3 }];
    useQuizStore.getState().answerQuestion(points);
    expect(useQuizStore.getState().leadingMood).toBe("focus");
  });

  it("breaks ties by priority order (activacion > focus > social > reset > calma > confort)", () => {
    // activacion and focus each score 2 → activacion wins (comes first)
    const points: OptionPoint[] = [
      { mood: "activacion", points: 2 },
      { mood: "focus",      points: 2 },
    ];
    useQuizStore.getState().answerQuestion(points);
    expect(useQuizStore.getState().leadingMood).toBe("activacion");
  });

  it("returns null leading mood when no points have been cast yet", () => {
    expect(useQuizStore.getState().leadingMood).toBeNull();
  });

  it("accumulates points across multiple steps", () => {
    // Step 0: focus gets 2
    useQuizStore.getState().answerQuestion([{ mood: "focus", points: 2 }]);
    // Step 1: calma gets 5 — should now lead
    useQuizStore.getState().answerQuestion([{ mood: "calma", points: 5 }]);
    // Quiz is now finished (2 questions mocked); resultMood reflects winner
    expect(useQuizStore.getState().resultMood).toBe("calma");
  });
});

// ------------------------------------------------------------------
// answerQuestion — state transitions
// ------------------------------------------------------------------

describe("answerQuestion", () => {
  it("increments currentStep", () => {
    useQuizStore.getState().answerQuestion([{ mood: "reset", points: 1 }]);
    expect(useQuizStore.getState().currentStep).toBe(1);
  });

  it("marks isFinished after the last question", () => {
    useQuizStore.getState().answerQuestion([{ mood: "reset", points: 1 }]);
    useQuizStore.getState().answerQuestion([{ mood: "reset", points: 1 }]);
    expect(useQuizStore.getState().isFinished).toBe(true);
  });

  it("adds a moodHistory entry when quiz finishes", () => {
    useQuizStore.getState().answerQuestion([{ mood: "social", points: 3 }]);
    useQuizStore.getState().answerQuestion([{ mood: "social", points: 2 }]);
    const history = useQuizStore.getState().moodHistory;
    expect(history).toHaveLength(1);
    expect(history[0].moodId).toBe("social");
  });

  it("increments quizCount when quiz finishes", () => {
    useQuizStore.getState().answerQuestion([{ mood: "confort", points: 2 }]);
    useQuizStore.getState().answerQuestion([{ mood: "confort", points: 2 }]);
    expect(useQuizStore.getState().quizCount).toBe(1);
  });

  it("does NOT add history entry for intermediate steps", () => {
    useQuizStore.getState().answerQuestion([{ mood: "calma", points: 2 }]);
    expect(useQuizStore.getState().moodHistory).toHaveLength(0);
    expect(useQuizStore.getState().isFinished).toBe(false);
  });
});

// ------------------------------------------------------------------
// resetQuiz
// ------------------------------------------------------------------

describe("resetQuiz", () => {
  it("clears quiz state without wiping moodHistory", () => {
    useQuizStore.getState().answerQuestion([{ mood: "activacion", points: 3 }]);
    useQuizStore.getState().answerQuestion([{ mood: "activacion", points: 3 }]);
    const historyBefore = useQuizStore.getState().moodHistory.length;

    useQuizStore.getState().resetQuiz();
    const s = useQuizStore.getState();

    expect(s.currentStep).toBe(0);
    expect(s.selections).toHaveLength(0);
    expect(s.isFinished).toBe(false);
    expect(s.resultMood).toBeNull();
    expect(s.leadingMood).toBeNull();
    // moodHistory is preserved across resets
    expect(s.moodHistory).toHaveLength(historyBefore);
  });
});

// ------------------------------------------------------------------
// goBack
// ------------------------------------------------------------------

describe("goBack", () => {
  it("decrements currentStep by 1", () => {
    useQuizStore.getState().answerQuestion([{ mood: "focus", points: 1 }]);
    expect(useQuizStore.getState().currentStep).toBe(1);
    useQuizStore.getState().goBack();
    expect(useQuizStore.getState().currentStep).toBe(0);
  });

  it("does not go below 0", () => {
    useQuizStore.getState().goBack();
    expect(useQuizStore.getState().currentStep).toBe(0);
  });
});

// ------------------------------------------------------------------
// addDailyMood
// ------------------------------------------------------------------

describe("addDailyMood", () => {
  it("adds an entry for today", () => {
    useQuizStore.getState().addDailyMood("calma");
    expect(useQuizStore.getState().moodHistory).toHaveLength(1);
    expect(useQuizStore.getState().moodHistory[0].moodId).toBe("calma");
  });

  it("replaces today's existing entry (upsert behaviour)", () => {
    useQuizStore.getState().addDailyMood("calma");
    useQuizStore.getState().addDailyMood("focus");
    const history = useQuizStore.getState().moodHistory;
    // Only one entry for today
    expect(history).toHaveLength(1);
    expect(history[0].moodId).toBe("focus");
  });

  it("preserves entries from previous days", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // Manually insert a yesterday entry
    useQuizStore.setState({
      moodHistory: [{
        id: "old",
        date: yesterday.toISOString(),
        moodId: "reset",
        timestamp: yesterday.getTime(),
      }],
    });

    useQuizStore.getState().addDailyMood("calma");
    const history = useQuizStore.getState().moodHistory;
    expect(history).toHaveLength(2);
    expect(history.find(e => e.moodId === "reset")).toBeDefined();
    expect(history.find(e => e.moodId === "calma")).toBeDefined();
  });
});

// ------------------------------------------------------------------
// toggleSavedRecipe
// ------------------------------------------------------------------

describe("toggleSavedRecipe", () => {
  it("adds recipe when not yet saved", () => {
    useQuizStore.getState().toggleSavedRecipe("recipe-abc");
    expect(useQuizStore.getState().savedRecipes).toContain("recipe-abc");
  });

  it("removes recipe when already saved (toggle off)", () => {
    useQuizStore.setState({ savedRecipes: ["recipe-abc"] });
    useQuizStore.getState().toggleSavedRecipe("recipe-abc");
    expect(useQuizStore.getState().savedRecipes).not.toContain("recipe-abc");
  });

  it("toggling twice returns to original state", () => {
    useQuizStore.getState().toggleSavedRecipe("recipe-xyz");
    useQuizStore.getState().toggleSavedRecipe("recipe-xyz");
    expect(useQuizStore.getState().savedRecipes).not.toContain("recipe-xyz");
  });

  it("does not affect other saved recipes", () => {
    useQuizStore.setState({ savedRecipes: ["recipe-1", "recipe-2"] });
    useQuizStore.getState().toggleSavedRecipe("recipe-1");
    expect(useQuizStore.getState().savedRecipes).toContain("recipe-2");
    expect(useQuizStore.getState().savedRecipes).not.toContain("recipe-1");
  });
});

// ------------------------------------------------------------------
// clearHistory
// ------------------------------------------------------------------

describe("clearHistory", () => {
  it("resets all dashboard state", () => {
    useQuizStore.setState({
      moodHistory: [{ id: "x", date: "", moodId: "calma", timestamp: 0 }],
      savedRecipes: ["r1"],
      completedRecipes: ["r2"],
      quizCount: 5,
    });
    useQuizStore.getState().clearHistory();
    const s = useQuizStore.getState();
    expect(s.moodHistory).toHaveLength(0);
    expect(s.savedRecipes).toHaveLength(0);
    expect(s.completedRecipes).toHaveLength(0);
    expect(s.quizCount).toBe(0);
  });
});
