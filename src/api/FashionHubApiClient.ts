import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { ENDPOINTS } from './endpoints';
import type {
  LoginRequest,
  LoginResponse,
  ProductListResponse,
  Product,
  CartResponse,
  AddToCartRequest,
  CartItem,
  AccountResponse,
} from './schemas/apiTypes';

/**
 * FashionHubApiClient
 * -------------------
 * Typed HTTP client for the FashionHub REST API.
 *
 * TODO: Replace API_BASE_URL with the real API base URL once available.
 *       All method bodies are ready — just remove the TODO comments.
 *
 * Usage (in a test fixture):
 *   const client = new FashionHubApiClient(request, process.env.API_BASE_URL ?? '');
 *   await client.login({ username: 'demouser', password: 'fashion123' });
 *   const products = await client.getProducts();
 */
export class FashionHubApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  /**
   * Authenticate with the API and store the received token.
   * @returns The full login response (token + username)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await this.post(ENDPOINTS.auth.login, credentials);
    const body = await this.expectJson<LoginResponse>(res, 200);
    this.setAuthToken(body.token);
    return body;
  }

  async logout(): Promise<void> {
    await this.post(ENDPOINTS.auth.logout, {});
    this.clearAuthToken();
  }

  // ── Products ──────────────────────────────────────────────────────────────

  async getProducts(): Promise<ProductListResponse> {
    const res = await this.get(ENDPOINTS.products.list);
    return this.expectJson<ProductListResponse>(res, 200);
  }

  async getProductById(id: string | number): Promise<Product> {
    const res = await this.get(ENDPOINTS.products.byId(id));
    return this.expectJson<Product>(res, 200);
  }

  // ── Cart ──────────────────────────────────────────────────────────────────

  async getCart(): Promise<CartResponse> {
    const res = await this.get(ENDPOINTS.cart.get);
    return this.expectJson<CartResponse>(res, 200);
  }

  async addToCart(item: AddToCartRequest): Promise<CartItem> {
    const res = await this.post(ENDPOINTS.cart.addItem, item);
    return this.expectJson<CartItem>(res, 201);
  }

  async removeFromCart(itemId: string | number): Promise<void> {
    const res = await this.delete(ENDPOINTS.cart.removeItem(itemId));
    await this.expectJson(res, 204);
  }

  // ── Account ───────────────────────────────────────────────────────────────

  async getAccount(): Promise<AccountResponse> {
    const res = await this.get(ENDPOINTS.account.me);
    return this.expectJson<AccountResponse>(res, 200);
  }
}
