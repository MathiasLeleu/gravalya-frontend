export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface IMeResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
}

export interface IPicture {
    id: number;
    url: string;
    alt: string;
    isMain: boolean;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: string;
    weight: string;
    height: string;
    length: string;
    width: string;
    stockQuantity: number;
    active: boolean;
    categoryId: number;
    category: ICategory;
    pictures: IPicture[];
}

export interface ICreateOrderPayload {
    items: {
        productId: number;
        quantity: number;
    }[];
    shippingMethodId: number;
    shippingFirstName: string;
    shippingLastName: string;
    shippingCountry: string;
    shippingAddress: string;
    shippingAddress2?: string;
    shippingPostalCode: string;
    shippingCity: string;
    shippingPhone: string;
    relayPoint?: {
        relayPointId: number;
        relayPointName: string;
        relayPointAddress: string;
        relayPointPostalCode: string;
        relayPointCity: string;
        relayPointCountry: string;
    };
}

export interface IShippingMethod {
    id: number;
    name: string;
    carrier: string;
    deliveryType: string;
}

export interface IShippingRate {
    id: number;
    shippingMethodId: number;
    minWeight: string;
    maxWeight: string;
    cost: string;
}