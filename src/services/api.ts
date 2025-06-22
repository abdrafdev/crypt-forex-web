import { API_ENDPOINTS } from "@/constants";
import {
  ApiResponse,
  PaginatedResponse,
  User,
  Deposit,
  Stablecoin,
  ForexPair,
  UserPosition,
  Transaction,
  MarketData,
  CryptoBubbleData,
  DepositForm,
  CreateForexPairForm,
} from "@/types";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  ) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add existing headers if any
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication methods
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });
  }

  // User methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request(API_ENDPOINTS.USER.PROFILE);
  }

  async getWallet(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.USER.WALLET);
  }

  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.request(
      `${API_ENDPOINTS.USER.TRANSACTIONS}?page=${page}&limit=${limit}`
    );
  }

  async getPositions(): Promise<ApiResponse<UserPosition[]>> {
    return this.request(API_ENDPOINTS.USER.POSITIONS);
  }

  // Deposit methods
  async createDeposit(depositData: DepositForm): Promise<ApiResponse<Deposit>> {
    return this.request(API_ENDPOINTS.DEPOSITS.CREATE, {
      method: "POST",
      body: JSON.stringify(depositData),
    });
  }

  async getDeposits(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    return this.request(
      `${API_ENDPOINTS.DEPOSITS.LIST}?page=${page}&limit=${limit}`
    );
  }

  async getDepositStatus(depositId: string): Promise<ApiResponse<Deposit>> {
    return this.request(`${API_ENDPOINTS.DEPOSITS.STATUS}/${depositId}`);
  }

  // Stablecoin methods
  async getStablecoins(): Promise<ApiResponse<Stablecoin[]>> {
    return this.request(API_ENDPOINTS.STABLECOINS.LIST);
  }

  async createStablecoin(
    baseCurrency: string,
    amount: number
  ): Promise<ApiResponse<Stablecoin>> {
    return this.request(API_ENDPOINTS.STABLECOINS.CREATE, {
      method: "POST",
      body: JSON.stringify({ baseCurrency, amount }),
    });
  }

  async getStablecoinPrice(
    symbol: string
  ): Promise<ApiResponse<{ price: number; change24h: number }>> {
    return this.request(`${API_ENDPOINTS.STABLECOINS.PRICE}/${symbol}`);
  }

  // Forex pair methods
  async getForexPairs(): Promise<ApiResponse<ForexPair[]>> {
    return this.request(API_ENDPOINTS.FOREX_PAIRS.LIST);
  }

  async createForexPair(
    pairData: CreateForexPairForm
  ): Promise<ApiResponse<ForexPair>> {
    return this.request(API_ENDPOINTS.FOREX_PAIRS.CREATE, {
      method: "POST",
      body: JSON.stringify(pairData),
    });
  }

  async getForexPairPrice(symbol: string): Promise<ApiResponse<MarketData>> {
    return this.request(`${API_ENDPOINTS.FOREX_PAIRS.PRICE}/${symbol}`);
  }

  async getForexPairChart(
    symbol: string,
    interval: string = "1d",
    limit: number = 100
  ): Promise<ApiResponse<any[]>> {
    return this.request(
      `${API_ENDPOINTS.FOREX_PAIRS.CHART}/${symbol}?interval=${interval}&limit=${limit}`
    );
  }

  // Market data methods
  async getMarketData(): Promise<ApiResponse<MarketData[]>> {
    return this.request(API_ENDPOINTS.MARKET.DATA);
  }

  async getPrices(
    symbols: string[]
  ): Promise<ApiResponse<Record<string, number>>> {
    return this.request(
      `${API_ENDPOINTS.MARKET.PRICES}?symbols=${symbols.join(",")}`
    );
  }

  async getCryptoBubbles(): Promise<ApiResponse<CryptoBubbleData[]>> {
    return this.request(API_ENDPOINTS.MARKET.BUBBLES);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual service functions for easier usage
export const authService = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
  setToken: apiClient.setToken.bind(apiClient),
  clearToken: apiClient.clearToken.bind(apiClient),
};

export const userService = {
  getProfile: apiClient.getProfile.bind(apiClient),
  getWallet: apiClient.getWallet.bind(apiClient),
  getTransactions: apiClient.getTransactions.bind(apiClient),
  getPositions: apiClient.getPositions.bind(apiClient),
};

export const depositService = {
  create: apiClient.createDeposit.bind(apiClient),
  getAll: apiClient.getDeposits.bind(apiClient),
  getStatus: apiClient.getDepositStatus.bind(apiClient),
};

export const stablecoinService = {
  getAll: apiClient.getStablecoins.bind(apiClient),
  create: apiClient.createStablecoin.bind(apiClient),
  getPrice: apiClient.getStablecoinPrice.bind(apiClient),
};

export const forexPairService = {
  getAll: apiClient.getForexPairs.bind(apiClient),
  create: apiClient.createForexPair.bind(apiClient),
  getPrice: apiClient.getForexPairPrice.bind(apiClient),
  getChart: apiClient.getForexPairChart.bind(apiClient),
};

export const marketService = {
  getData: apiClient.getMarketData.bind(apiClient),
  getPrices: apiClient.getPrices.bind(apiClient),
  getBubbles: apiClient.getCryptoBubbles.bind(apiClient),
};
