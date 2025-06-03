import { ClientWalletInfo } from '@/components/ClientWalletInfo'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Ripple Blockchain Explorer</h1>
        <ClientWalletInfo />
      </div>
    </main>
  )
}
