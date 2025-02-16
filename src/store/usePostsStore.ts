import { create } from "zustand";

type State = {
  isLoading: boolean;
  successMessage: string;
  failureMessage: string;
  selectedPostId: number | null;
};

type Actions = {
  toggleIsLoading: (isLoading?: boolean) => void;
  setSuccessMessage: (successMessage: string) => void;
  setFailureMessage: (failureMessage: string) => void;
  setSelectedPostId: (selectedPostId: number | null) => void;
};

const usePostsStore = create<State & Actions>((set, get) => ({
  isLoading: false,
  successMessage: "",
  failureMessage: "",
  selectedPostId: null,
  setSelectedPostId(selectedPostId) {
    set({ selectedPostId });
  },
  toggleIsLoading: (isLoading) =>
    set({ isLoading: isLoading ?? !get().isLoading }),
  setSuccessMessage: (successMessage: string) => set({ successMessage }),
  setFailureMessage: (failureMessage: string) => set({ failureMessage }),
}));

export default usePostsStore;
