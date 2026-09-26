import type { IRegisterPayload, IRegisterResponse } from "../@types";

const baseUrl = import.meta.env.VITE_API_URL;

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