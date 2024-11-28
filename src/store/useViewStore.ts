import { create } from "zustand";

export type ViewMode = "graph" | "read";

type ViewStore = {
  viewMode: ViewMode;
  setViewMode: (type: ViewMode) => void;

  currentNodeId: number | null;
  setCurrentNodeId: (id: number | null) => void;
};

export const useViewStore = create<ViewStore>((set) => ({
  viewMode: "graph",
  setViewMode: (type) => set({ viewMode: type }),

  currentNodeId: null,
  setCurrentNodeId: (id) => set({ currentNodeId: id }),
}));
