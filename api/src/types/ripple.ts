export interface WalletInfo {
  address: string
  balance: string
  sequence: number
}

export interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface GenerateWalletResponse {
  address: string
  seed: string
}

export interface FundWalletResponse {
  address: string
  balance: string
}
