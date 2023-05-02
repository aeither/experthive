import { create } from "zustand";

interface LoginState {
  name: string;
  setName: (name: string) => void;
}

const useStore = create<LoginState>((set) => ({
  name: "",
  setName: (name) =>
    set((state) => ({
      ...state,
      name,
    })),
}));

export default useStore;
