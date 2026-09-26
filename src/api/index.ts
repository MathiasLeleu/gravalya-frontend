import type { ILoginPayload, ILoginResponse, IRegisterPayload, IRegisterResponse, IMeResponse } from "../@types";

import { useAuthStore } from "../store";

const baseUrl = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(
  payload: IRegisterPayload
): Promise<IRegisterResponse> {
  const response = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de créer le compte."
    );
  }

  return data;
}

export async function loginUser(
  payload: ILoginPayload
): Promise<ILoginResponse> {
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de se connecter."
    );
  }

  return data;
}

export async function getMe(): Promise<IMeResponse> {
  const response = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer votre profil."
    );
  }

  return data;
}