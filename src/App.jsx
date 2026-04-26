import { useEffect } from 'react'
import { useWallet } from './hooks/useWallet'
import { useVesting } from './hooks/useVesting'
import { WalletBar } from './components/WalletBar'
import { VestingForm } from './components/VestingForm'
import { VestingDashboard } from './components/VestingDashboard'
import { CardSkeleton } from './components/LoadingSkeleton'

export default function App() {
  const {
    address, isConnecting, error,
    connect, disconnect,
  } = useWallet()

  const {
    txStatus, isLoading, vestingInfo,
    fetchBalance, createVesting,
    loadVestingInfo, clearTxStatus,
  } = useVesting(address)

  // Load cached vesting info when wallet connects
  useEffect(() => {
    if (address) loadVestingInfo()
  }, [address])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white' }}>

      {/* Wallet bar */}
      <WalletBar
        address={address}
        isConnecting={isConnecting}
        error={error}
        onConnect={connect}
        onDisconnect={disconnect}
        fetchBalance={fetchBalance}
      />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1',
                      textTransform: 'uppercase', letterSpacing: '.14em',
                      fontFamily: 'monospace', marginBottom: 14 }}>
          Soroban · Stellar Testnet · Token Vesting
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white',
                     margin: '0 0 12px', letterSpacing: '-0.04em',
                     lineHeight: 1.15 }}>
          StellarVest
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15, margin: 0,
                    lineHeight: 1.6 }}>
          Lock and vest XLM tokens on a schedule using Soroban smart contracts
        </p>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 960, margin: '0 auto',
                     padding: '0 24px 64px',
                     display: 'flex', gap: 24,
                     flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* Left — Form */}
        <div style={{ flex: '1 1 420px', maxWidth: 480 }}>
          {isLoading && !vestingInfo
            ? <CardSkeleton />
            : <VestingForm
                onSubmit={createVesting}
                isLoading={isLoading}
                walletAddress={address}
              />
          }
        </div>

        {/* Right — Dashboard */}
        <div style={{ flex: '1 1 420px', maxWidth: 480 }}>
          <VestingDashboard
            vestingInfo={vestingInfo}
            txStatus={txStatus}
            isLoading={isLoading}
            onClear={clearTxStatus}
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2a2a3a',
                       padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#6b7280',
                    fontFamily: 'monospace' }}>
          Stellar Level 3 · Soroban · Loading States · Caching · Tests
          {' · '}
          <a href="https://github.com/AditiM1729/stellar-vesting"
             target="_blank" rel="noopener noreferrer"
             style={{ color: '#6366f1', textDecoration: 'none' }}>
            GitHub
          </a>
        </p>
      </footer>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}