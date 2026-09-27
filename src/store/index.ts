import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ILoginResponse, IProduct } from "../@types";

interface ICartItem {
  product: IProduct;
  quantity: number;
}

interface AuthState {
  token: string | null;
  user: ILoginResponse["user"] | null;

  login: (data: ILoginResponse) => void;
  logout: () => void;

  cart: ICartItem[];
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
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

      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stockQuantity
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
                quantity: Math.min(quantity, product.stockQuantity),
              },
            ],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.product.id !== productId
          ),
        })),

      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(quantity, item.product.stockQuantity)
                  ),
                }
              : item
          ),
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