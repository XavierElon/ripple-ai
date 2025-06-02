import { useState, useEffect } from 'react'
import { RippleService } from '@/services/rippleService'
import { WalletInfo, Transaction } from '@/types/ripple'

export const useRipple = () => {
  const [rippleService] = useState(() => new RippleService())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFunding, setIsFunding] = useState(false)

  useEffect(() => {
    const connect = async () => {
      try {
        await rippleService.connect()
        setIsConnected(true)
      } catch (err) {
        setError('Failed to connect to Ripple network')
        setIsConnected(false)
      }
    }

    connect()

    return () => {
      rippleService.disconnect()
    }
  }, [rippleService])

  const generateTestWallet = async () => {
    try {
      return await rippleService.generateTestWallet()
    } catch (err) {
      setError('Failed to generate test wallet')
      return null
    }
  }

  const fundTestWallet = async (address: string) => {
    try {
      setIsFunding(true)
      setError(null)
      const result = await rippleService.fundTestWallet(address)
      return result
    } catch (err) {
      setError('Failed to fund test wallet')
      return null
    } finally {
      setIsFunding(false)
    }
  }

  const getWalletInfo = async (address: string): Promise<WalletInfo | null> => {
    try {
      setError(null)
      const info = await rippleService.getWalletInfo(address)
      return info
    } catch (err) {
      setError('Failed to fetch wallet info')
      return null
    }
  }

  const getTransactionHistory = async (address: string): Promise<Transaction[]> => {
    try {
      return await rippleService.getTransactionHistory(address)
    } catch (err) {
      setError('Failed to fetch transaction history')
      return []
    }
  }

  return {
    isConnected,
    error,
    isFunding,
    generateTestWallet,
    fundTestWallet,
    getWalletInfo,
    getTransactionHistory
  }
}
