import { Request, Response } from 'express'
import { RippleService } from '../services/rippleService'
import { ApiResponse } from '../types/ripple'

export class RippleController {
  private rippleService: RippleService

  constructor() {
    this.rippleService = new RippleService()
  }

  async generateWallet(req: Request, res: Response): Promise<void> {
    try {
      const wallet = await this.rippleService.generateTestWallet()
      const response: ApiResponse<typeof wallet> = {
        success: true,
        data: wallet
      }
      res.json(response)
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'WALLET_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to generate wallet'
        }
      }
      res.status(500).json(response)
    }
  }

  async fundWallet(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params
      if (!address) {
        throw new Error('Address is required')
      }

      const result = await this.rippleService.fundTestWallet(address)
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result
      }
      res.json(response)
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'WALLET_FUNDING_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fund wallet'
        }
      }
      res.status(500).json(response)
    }
  }

  async getWalletInfo(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params
      if (!address) {
        throw new Error('Address is required')
      }

      const info = await this.rippleService.getWalletInfo(address)
      const response: ApiResponse<typeof info> = {
        success: true,
        data: info
      }
      res.json(response)
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'WALLET_INFO_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch wallet info'
        }
      }
      res.status(500).json(response)
    }
  }

  async getTransactionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params
      if (!address) {
        throw new Error('Address is required')
      }

      const transactions = await this.rippleService.getTransactionHistory(address)
      const response: ApiResponse<typeof transactions> = {
        success: true,
        data: transactions
      }
      res.json(response)
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'TRANSACTION_HISTORY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch transaction history'
        }
      }
      res.status(500).json(response)
    }
  }
}
