export type UserRole = "user" | "seller";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Shop {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithShop extends Product {
  shop: Shop;
  distance?: number;
}

export const CATEGORIES = ["Men", "Women", "Kids", "Ethnic", "Boutique"] as const;
