import { Client, Wallet } from 'xrpl'
import { WalletInfo, Transaction } from '@/types/ripple'

const RIPPLE_NODE_URL = 'wss://s.altnet.rippletest.net:51233'
const FAUCET_URL = 'https://faucet.altnet.rippletest.net/accounts'

export class RippleService {
  private client: Client

  constructor() {
    this.client = new Client(RIPPLE_NODE_URL)
  }

  async connect() {
    await this.client.connect()
  }

  async disconnect() {
    await this.client.disconnect()
  }

  async generateTestWallet(): Promise<{ address: string; seed: string }> {
    try {
      const wallet = Wallet.generate()
      return {
        address: wallet.address,
        seed: wallet.seed || ''
      }
    } catch (error) {
      throw new Error('Failed to generate test wallet')
    }
  }

  async fundTestWallet(address: string): Promise<{ address: string; balance: string }> {
    try {
      const response = await fetch(FAUCET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination: address })
      })

      if (!response.ok) {
        throw new Error('Failed to fund test wallet')
      }

      const data = await response.json()
      return {
        address: data.account.address,
        balance: data.balance
      }
    } catch (error) {
      throw new Error('Failed to fund test wallet')
    }
  }

  async getWalletInfo(address: string): Promise<WalletInfo> {
    try {
      const response = await this.client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      })

      return {
        address,
        balance: response.result.account_data.Balance,
        sequence: response.result.account_data.Sequence
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('actNotFound')) {
        return {
          address,
          balance: '0',
          sequence: 0
        }
      }
      throw new Error('Failed to fetch wallet info')
    }
  }

  async getTransactionHistory(address: string): Promise<Transaction[]> {
    try {
      const response = await this.client.request({
        command: 'account_tx',
        account: address
      })

      return response.result.transactions.map((tx: any) => ({
        hash: tx.tx.hash,
        from: tx.tx.Account,
        to: tx.tx.Destination,
        amount: tx.tx.Amount,
        timestamp: tx.tx.date,
        status: 'success'
      }))
    } catch (error) {
      throw new Error('Failed to fetch transaction history')
    }
  }
}
