'use client'

import { useState, useEffect } from 'react'
import { useRipple } from '@/hooks/useRipple'
import { WalletInfo as WalletInfoType } from '@/types/ripple'

export const WalletInfo = () => {
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState(process.env.NEXT_PUBLIC_RIPPLE_TEST_WALLET_ADDRESS || '')
  const [walletInfo, setWalletInfo] = useState<WalletInfoType | null>(null)
  const { isConnected, error, isFunding, getWalletInfo, fundTestWallet } = useRipple()

  useEffect(() => {
    setMounted(true)
    // Fetch wallet info on mount if we have an address
    if (address) {
      getWalletInfo(address).then((info) => {
        if (info) setWalletInfo(info)
      })
    }
  }, [address, getWalletInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (address) {
      const info = await getWalletInfo(address)
      setWalletInfo(info)
    }
  }

  const handleFundWallet = async () => {
    if (address) {
      const result = await fundTestWallet(address)
      if (result) {
        // Add a small delay to allow the funding transaction to be processed
        setTimeout(async () => {
          const info = await getWalletInfo(address)
          if (info) setWalletInfo(info)
        }, 2000)
      }
    }
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return <div className="text-red-500 font-medium">Connecting to Ripple network...</div>
  }

  return (
    <div className="card max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Ripple Wallet Info</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Ripple address" className="input" />
        <button type="submit" className="btn btn-primary w-full">
          Get Wallet Info
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md dark:bg-red-900/20">{error}</div>}

      {address && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h3 className="font-bold mb-3 text-lg">Test Wallet</h3>
          <p className="break-all text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Address:</span> {address}
          </p>
          <button onClick={handleFundWallet} disabled={isFunding} className="btn btn-primary w-full mt-4">
            {isFunding ? 'Funding Wallet...' : 'Fund Test Wallet'}
          </button>
        </div>
      )}

      {walletInfo && (
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Address:</span> <span className="text-gray-600 dark:text-gray-400">{walletInfo.address}</span>
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Balance:</span> <span className="text-gray-600 dark:text-gray-400">{walletInfo.balance} XRP</span>
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Sequence:</span> <span className="text-gray-600 dark:text-gray-400">{walletInfo.sequence}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
