import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CorpusDoc, OriginalityReport } from "@/lib/engine/types";

type State = {
  library: CorpusDoc[];
  reports: OriginalityReport[];
  addLibrary: (doc: CorpusDoc) => void;
  removeLibrary: (id: string) => void;
  saveReport: (report: OriginalityReport) => void;
  getReport: (id: string) => OriginalityReport | undefined;
};

export const useProvenance = create<State>()(
  persist(
    (set, get) => ({
      library: [],
      reports: [],
      addLibrary: (doc) =>
        set((s) => ({
          library: [doc, ...s.library.filter((d) => d.id !== doc.id)].slice(0, 40),
        })),
      removeLibrary: (id) => set((s) => ({ library: s.library.filter((d) => d.id !== id) })),
      saveReport: (report) =>
        set((s) => ({
          reports: [report, ...s.reports.filter((r) => r.id !== report.id)].slice(0, 24),
        })),
      getReport: (id) => get().reports.find((r) => r.id === id),
    }),
    { name: "provenance-originality" },
  ),
);
