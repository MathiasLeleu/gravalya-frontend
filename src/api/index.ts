import type { ILoginPayload, ILoginResponse, IRegisterPayload, IRegisterResponse, IMeResponse, 
  ICategory, IProduct, ICreateOrderPayload, IShippingMethod, IShippingRate, IRelayPoint } from "../@types";

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

export async function createOrder(payload: ICreateOrderPayload) {
  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de créer la commande."
    );
  }

  return data;
}

export async function getShippingMethods(): Promise<IShippingMethod[]> {
  const response = await fetch(`${baseUrl}/shipping-methods`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les méthodes de livraison."
    );
  }

  return data;
}

export async function getShippingRates(): Promise<IShippingRate[]> {
  const response = await fetch(`${baseUrl}/shipping-rates`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les tarifs de livraison."
    );
  }

  return data;
}

export async function getRelayPoints(
  shippingMethodId: number,
  postalCode: string,
  city: string
): Promise<IRelayPoint[]> {
  const params = new URLSearchParams({
    shippingMethodId: String(shippingMethodId),
    postalCode,
    city,
  });

  const response = await fetch(
    `${baseUrl}/relay-points?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les points relais."
    );
  }

  return data;
}

export async function getMyOrders() {
  const response = await fetch(`${baseUrl}/orders/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer vos commandes."
    );
  }

  return data;
}

export async function getAllOrders() {
  const response = await fetch(`${baseUrl}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les commandes."
    );
  }

  return data;
}

export async function updateOrder(
  orderId: number,
  data: {
    statut?: 
    | "EN_ATTENTE"
    | "CONFIRMEE"
    | "EXPEDIEE"
    | "LIVREE"
    | "ANNULEE";
    shippingFirstName?: string;
    shippingLastName?: string;
    shippingCountry?: string;
    shippingAddress?: string;
    shippingAddress2?: string | null;
    shippingPostalCode?: string;
    shippingCity?: string;
    shippingPhone?: string;
    relayPoint?: {
      relayPointId: number;
      relayPointName: string;
      relayPointAddress: string;
      relayPointPostalCode: string;
      relayPointCity: string;
      relayPointCountry: string;
    };
  }
) {
  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.error || "Impossible de modifier la commande."
    ) as Error & {
      details?: {
        message: string;
        path: string;
      }[];
    };

  error.details = result.details;

  throw error;
}

  return result;
}

export async function cancelOrder(orderId: number) {
  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible d'annuler la commande."
    );
  }

  return data;
}