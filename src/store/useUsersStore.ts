import { create } from "zustand";
import type { User } from "@/services/api";

interface TempUsersStore {
  tempUsers: User[];
  addTempUser: (user: User) => void;
  updateTempUser: (user: User) => void;
  removeTempUser: (id: number) => void;
  getTempUser: (id: number) => User | undefined;
}

const useTempUsersStore = create<TempUsersStore>((set, get) => ({
  tempUsers: [],
  addTempUser: (user) =>
    set((state) => ({ tempUsers: [...state.tempUsers, user] })),
  updateTempUser: (user) =>
    set((state) => ({
      tempUsers: state.tempUsers.map((u) => (u.id === user.id ? user : u)),
    })),
  removeTempUser: (id) =>
    set((state) => ({
      tempUsers: state.tempUsers.filter((u) => u.id !== id),
    })),
  getTempUser: (id) => get().tempUsers.find((u) => u.id === id),
}));

export default useTempUsersStore;
