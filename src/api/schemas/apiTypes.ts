/**
 * apiTypes.ts
 * -----------
 * TypeScript interfaces for FashionHub API request/response shapes.
 * Update these when the real API contract is defined.
 */

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token:    string;
  username: string;
  /** Token expiry as ISO8601 string */
  expiresAt?: string;
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id:          number | string;
  name:        string;
  description: string;
  price:       number;
  /** Relative or absolute image URL */
  imageUrl?:   string;
}

export interface ProductListResponse {
  products: Product[];
  total:    number;
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id:        number | string;
  productId: number | string;
  name:      string;
  price:     number;
  quantity:  number;
}

export interface CartResponse {
  items:      CartItem[];
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number | string;
  quantity:  number;
}

// ── Account ───────────────────────────────────────────────────────────────────

export interface AccountResponse {
  id:       number | string;
  username: string;
  email?:   string;
}

// ── Common ────────────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  error:   string;
  message: string;
  status:  number;
}
