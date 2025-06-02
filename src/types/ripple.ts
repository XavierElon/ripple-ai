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

export interface RippleError {
  code: string
  message: string
  data?: any
}
