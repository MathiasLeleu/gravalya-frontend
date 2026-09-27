import type { ILoginPayload, ILoginResponse, IRegisterPayload, IRegisterResponse, IMeResponse, ICategory, IProduct } from "../@types";

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

export async function getCategories(): Promise<ICategory[]> {
  const response = await fetch(`${baseUrl}/categories`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les catégories."
    );
  }

  return data;
}

export async function getProducts(): Promise<IProduct[]> {
    const response = await fetch(`${baseUrl}/products`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Impossible de récupérer les produits.");
    }

    return data;
}

export async function getProductById(id: number): Promise<IProduct> {
    const response = await fetch(`${baseUrl}/products/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Impossible de récupérer le produit.");
    }

    return data;
}