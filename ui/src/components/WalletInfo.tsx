'use client'

import { useState, useEffect } from 'react'
import { useRipple } from '@/hooks/useRipple'
import { WalletInfo as WalletInfoType } from '@/types/ripple'

export const WalletInfo = () => {
  const [mounted, setMounted] = useState(false)
  const [envAddress, setEnvAddress] = useState(process.env.NEXT_PUBLIC_RIPPLE_TEST_WALLET_ADDRESS || '')
  const [envWalletInfo, setEnvWalletInfo] = useState<WalletInfoType | null>(null)
  const [generatedWallet, setGeneratedWallet] = useState<{ address: string; seed: string } | null>(null)
  const [generatedWalletInfo, setGeneratedWalletInfo] = useState<WalletInfoType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFundingEnv, setIsFundingEnv] = useState(false)
  const [isFundingGenerated, setIsFundingGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isConnected, getWalletInfo, fundTestWallet, generateTestWallet } = useRipple()

  // Fetch env wallet info only after connection is established
  useEffect(() => {
    setMounted(true)
    const fetchEnvWalletInfo = async () => {
      if (envAddress && isConnected) {
        try {
          const info = await getWalletInfo(envAddress)
          if (info) setEnvWalletInfo(info)
        } catch (err) {
          console.error('Failed to fetch initial wallet info:', err)
        }
      }
    }
    fetchEnvWalletInfo()
  }, [isConnected]) // Only re-run when connection status changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (envAddress) {
      try {
        setError(null)
        const info = await getWalletInfo(envAddress)
        setEnvWalletInfo(info)
      } catch (err) {
        console.error('Failed to fetch wallet info:', err)
        setError('Failed to fetch wallet info')
      }
    }
  }

  const handleFundWallet = async () => {
    if (envAddress) {
      try {
        setIsFundingEnv(true)
        setError(null)
        const result = await fundTestWallet(envAddress)
        if (result) {
          // Add a small delay to allow the funding transaction to be processed
          setTimeout(async () => {
            try {
              const info = await getWalletInfo(envAddress)
              if (info) setEnvWalletInfo(info)
            } catch (err) {
              console.error('Failed to fetch wallet info after funding:', err)
            }
          }, 2000)
        }
      } catch (err) {
        console.error('Failed to fund wallet:', err)
        setError('Failed to fund wallet')
      } finally {
        setIsFundingEnv(false)
      }
    }
  }

  const handleGenerateWallet = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      const wallet = await generateTestWallet()
      if (wallet) {
        setGeneratedWallet(wallet)
        // Only fetch info for the newly generated wallet
        try {
          const info = await getWalletInfo(wallet.address)
          setGeneratedWalletInfo(info)
        } catch (err) {
          console.error('Failed to fetch generated wallet info:', err)
        }
      }
    } catch (err) {
      console.error('Failed to generate wallet:', err)
      setError('Failed to generate wallet')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFundGeneratedWallet = async () => {
    if (generatedWallet?.address) {
      try {
        setIsFundingGenerated(true)
        setError(null)
        const result = await fundTestWallet(generatedWallet.address)
        if (result) {
          // Add a small delay to allow the funding transaction to be processed
          setTimeout(async () => {
            try {
              const info = await getWalletInfo(generatedWallet.address)
              if (info) setGeneratedWalletInfo(info)
            } catch (err) {
              console.error('Failed to fetch wallet info after funding:', err)
            }
          }, 2000)
        }
      } catch (err) {
        console.error('Failed to fund generated wallet:', err)
        setError('Failed to fund generated wallet')
      } finally {
        setIsFundingGenerated(false)
      }
    }
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return <div className="text-center p-4 text-gray-600 dark:text-gray-400">Connecting to Ripple network...</div>
  }

  return (
    <div className="flex gap-8">
      <div className="card max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Ripple Wallet Info</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={envAddress} onChange={(e) => setEnvAddress(e.target.value)} placeholder="Enter Ripple address" className="input" />
          <button type="submit" className="btn btn-primary w-full">
            Get Wallet Info
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md dark:bg-red-900/20">{error}</div>}

        {envAddress && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h3 className="font-bold mb-3 text-lg">Test Wallet</h3>
            <p className="break-all text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Address:</span> {envAddress}
            </p>
            <button onClick={handleFundWallet} disabled={isFundingEnv} className="btn btn-primary w-full mt-4">
              {isFundingEnv ? 'Funding Wallet...' : 'Fund Test Wallet'}
            </button>
          </div>
        )}

        {envWalletInfo && (
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Address:</span> <span className="text-gray-600 dark:text-gray-400">{envWalletInfo.address}</span>
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Balance:</span> <span className="text-gray-600 dark:text-gray-400">{envWalletInfo.balance} XRP</span>
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Sequence:</span> <span className="text-gray-600 dark:text-gray-400">{envWalletInfo.sequence}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="card max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Generate New Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Create a new Ripple wallet to start transacting on the network.</p>
        <button onClick={handleGenerateWallet} disabled={isGenerating} className="btn btn-primary w-full">
          {isGenerating ? 'Generating...' : 'Generate Wallet'}
        </button>

        {generatedWallet && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h3 className="font-bold mb-3 text-lg">Generated Wallet</h3>
            <div className="space-y-2">
              <p className="break-all text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Address:</span> {generatedWallet.address}
              </p>
              <p className="break-all text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Seed:</span> {generatedWallet.seed}
              </p>
              <button onClick={handleFundGeneratedWallet} disabled={isFundingGenerated} className="btn btn-primary w-full mt-4">
                {isFundingGenerated ? 'Funding Wallet...' : 'Fund Generated Wallet'}
              </button>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">⚠️ Make sure to save your seed phrase securely. It's the only way to access your wallet!</p>
            </div>
          </div>
        )}

        {generatedWalletInfo && (
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Balance:</span> <span className="text-gray-600 dark:text-gray-400">{generatedWalletInfo.balance} XRP</span>
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Sequence:</span> <span className="text-gray-600 dark:text-gray-400">{generatedWalletInfo.sequence}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
