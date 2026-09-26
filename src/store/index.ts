import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ILoginResponse } from "../@types";

interface AuthState {
  token: string | null;
  user: ILoginResponse["user"] | null;
  login: (data: ILoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (data) =>
        set({
          token: data.token,
          user: data.user,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "gravelya-auth",
    }
  )
);