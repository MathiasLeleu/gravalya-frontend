import type { ILoginPayload, ILoginResponse, IRegisterPayload, IRegisterResponse, IMeResponse, IUser, IUserDetails,
  ICategory, IProduct, ICreateOrderPayload, IShippingMethod, IShippingRate, IRelayPoint, IPicture, IShippingOption } from "../@types";

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

export async function getUsers(): Promise<IUser[]> {
  const response = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les utilisateurs."
    );
  }

  return data;
}

export async function getUserById(id: number): Promise<IUserDetails> {
  const response = await fetch(`${baseUrl}/users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer l'utilisateur."
    );
  }

  return data;
}


export async function deleteMyAccount(userId: number) {
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      "Impossible de supprimer votre compte."
    );
  }

  return data;
}

export async function deleteUser(userId: number) {
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      "Impossible de supprimer cet utilisateur."
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

export async function getCategoryById(id: number): Promise<ICategory> {
  const response = await fetch(`${baseUrl}/categories/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer la catégorie."
    );
  }

  return data;
}

export async function getProductsByCategory(
  slug: string
): Promise<IProduct[]> {
  const response = await fetch(
    `${baseUrl}/products/category/${slug}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les produits de la catégorie."
    );
  }

  return data;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description: string;
  image: File;
  banner: File;
}) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);
  formData.append("description", data.description);
  formData.append("image", data.image);
  formData.append("banner", data.banner);

  const response = await fetch(`${baseUrl}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de créer la catégorie."
    );
  }

  return result;
}

export async function updateCategory(
  categoryId: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: File;
    banner?: File;
  }
) {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.slug !== undefined) {
    formData.append("slug", data.slug);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.banner) {
    formData.append("banner", data.banner);
  }

  const response = await fetch(
    `${baseUrl}/categories/${categoryId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de modifier la catégorie."
    );
  }

  return result;
}

export async function deleteCategory(categoryId: number) {
  const response = await fetch(
    `${baseUrl}/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de supprimer la catégorie."
    );
  }

  return result;
}

export async function getProducts(): Promise<IProduct[]> {
    const response = await fetch(`${baseUrl}/products`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Impossible de récupérer les produits.");
    }

    return data;
}

export async function getAdminProducts(): Promise<IProduct[]> {
  const response = await fetch(`${baseUrl}/admin/products`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les produits."
    );
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

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  stockQuantity: number;
  categoryId: number;
}) {
  const response = await fetch(`${baseUrl}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de créer le produit."
    );
  }

  return result;
}

export async function updateProduct(
  productId: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    weight?: number;
    height?: number;
    length?: number;
    width?: number;
    stockQuantity?: number;
    active?: boolean;
    categoryId?: number;
  }
) {
  const response = await fetch(`${baseUrl}/products/${productId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de modifier le produit."
    );
  }

  return result;
}

export async function deleteProduct(productId: number) {
  const response = await fetch(`${baseUrl}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de supprimer le produit."
    );
  }

  return data;
}

export async function getProductPictures(
  productId: number
): Promise<IPicture[]> {
  const response = await fetch(
    `${baseUrl}/products/${productId}/pictures`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de récupérer les images du produit."
    );
  }

  return data;
}

export async function updatePicture(
  productId: number,
  pictureId: number,
  data: {
    url?: string;
    alt?: string;
    isMain?: boolean;
  }
) {
  const response = await fetch(
    `${baseUrl}/products/${productId}/pictures/${pictureId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de modifier l'image."
    );
  }

  return result;
}

export async function uploadProductPicture(
  productId: number,
  file: File,
  alt: string,
  isMain: boolean
): Promise<IPicture> {
  const formData = new FormData();

  formData.append("picture", file);
  formData.append("alt", alt);
  formData.append("isMain", String(isMain));

  const response = await fetch(
    `${baseUrl}/products/${productId}/pictures/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.error || "Impossible d'ajouter l'image."
    );
  }

  return result;
}

export async function deletePicture(
  productId: number,
  pictureId: number
) {
  const response = await fetch(
    `${baseUrl}/products/${productId}/pictures/${pictureId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Impossible de supprimer l'image."
    );
  }

  return result;
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

export async function getShippingOptions(
    shippingMethodId: number,
    postalCode: string,
    city: string,
    weight: number
): Promise<IShippingOption[]> {
    const params = new URLSearchParams({
        shippingMethodId: String(shippingMethodId),
        postalCode,
        city,
        weight: String(weight),
    });

    const response = await fetch(
        `${baseUrl}/shipping-options?${params.toString()}`
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.message ||
            "Impossible de récupérer les options de livraison."
        );
    }

    const data = await response.json();

    return data.data;
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