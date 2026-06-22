import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenTour: boolean;
  currentStep: number;
  markTourSeen: () => void;
  setStep: (step: number) => void;
  resetTour: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenTour: false,
      currentStep: 0,
      markTourSeen: () => set({ hasSeenTour: true, currentStep: 0 }),
      setStep: (step) => set({ currentStep: step }),
      resetTour: () => set({ hasSeenTour: false, currentStep: 0 }),
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({ hasSeenTour: state.hasSeenTour }),
    }
  )
);
