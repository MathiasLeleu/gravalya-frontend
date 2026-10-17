
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ILoginResponse,
  IProduct,
  IProductCustomization,
} from "../@types";

interface ICartItem {
  product: IProduct;
  quantity: number;
  customization?: IProductCustomization;
}

interface AuthState {
  token: string | null;
  user: ILoginResponse["user"] | null;

  login: (data: ILoginResponse) => void;
  logout: () => void;

  cart: ICartItem[];
  addToCart: (
    product: IProduct,
    quantity: number,
    customization?: IProductCustomization
  ) => void;
  removeFromCart: (lineKey: string) => void;
  updateCartQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Normalise les choix pour éviter de créer des lignes différentes
 * uniquement à cause d'espaces inutiles ou de champs vides.
 */
function normalizeCustomization(
  customization?: IProductCustomization
): IProductCustomization | undefined {
  const color = customization?.color?.trim();
  const text = customization?.text?.trim();

  if (!color && !text) {
    return undefined;
  }

  return {
    ...(color ? { color } : {}),
    ...(text ? { text } : {}),
  };
}

/**
 * Identifie une ligne à partir du produit et de ses personnalisations.
 * Deux variantes différentes d'un même produit restent distinctes.
 */
export function getCartItemKey(
  productId: number,
  customization?: IProductCustomization
): string {
  const normalized = normalizeCustomization(customization);

  return JSON.stringify([
    productId,
    normalized?.color ?? null,
    normalized?.text ?? null,
  ]);
}

function getMaxQuantity(product: IProduct): number {
  return product.madeToOrder
    ? 100
    : Math.max(0, product.stockQuantity);
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

      cart: [],

      addToCart: (product, quantity, customization) =>
        set((state) => {
          const maxQuantity = getMaxQuantity(product);

          if (maxQuantity < 1 || quantity < 1) {
            return state;
          }

          const normalizedCustomization =
            normalizeCustomization(customization);

          const lineKey = getCartItemKey(
            product.id,
            normalizedCustomization
          );

          const existingItem = state.cart.find(
            (item) =>
              getCartItemKey(
                item.product.id,
                item.customization
              ) === lineKey
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                getCartItemKey(
                  item.product.id,
                  item.customization
                ) === lineKey
                  ? {
                      ...item,
                      product,
                      quantity: Math.min(
                        item.quantity + quantity,
                        maxQuantity
                      ),
                    }
                  : item
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                product,
                quantity: Math.min(quantity, maxQuantity),
                ...(normalizedCustomization
                  ? { customization: normalizedCustomization }
                  : {}),
              },
            ],
          };
        }),

      removeFromCart: (lineKey) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              getCartItemKey(
                item.product.id,
                item.customization
              ) !== lineKey
          ),
        })),

      updateCartQuantity: (lineKey, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            const itemKey = getCartItemKey(
              item.product.id,
              item.customization
            );

            if (itemKey !== lineKey) {
              return item;
            }

            const maxQuantity = getMaxQuantity(item.product);

            if (maxQuantity < 1) {
              return item;
            }

            return {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, maxQuantity)
              ),
            };
          }),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),
    }),
    {
      name: "gravelya-auth",
    }
  )
);