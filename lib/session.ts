export type User = { name: string } | null;

export type SavedScore = {
  gameId: string;
  name: string;
  score: number;
  at: string;
};

const USER_KEY = "av_user";
const SCORES_KEY = "av_scores";

export function getUser(): User {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
}

export function getScores(): SavedScore[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SCORES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addScore(entry: Omit<SavedScore, "at">): void {
  if (typeof window === "undefined") return;
  try {
    const all = getScores();
    all.push({ ...entry, at: new Date().toISOString() });
    window.localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {
    // localStorage puede fallar (cuota excedida, modo privado) — no bloquear la UI
  }
}
