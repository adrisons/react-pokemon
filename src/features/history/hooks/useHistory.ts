import { useHistoryStore } from "@features/history/store/historyStore";

export function useHistory() {
  const entries = useHistoryStore((s) => s.entries);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const clear = useHistoryStore((s) => s.clear);
  return { entries, addEntry, clear };
}
