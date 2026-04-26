import { useState, useEffect } from 'react'
import { shortAddress } from '../utils/stellar'
import { BalanceSkeleton } from './LoadingSkeleton'

export function WalletBar({ address, isConnecting, error, onConnect, onDisconnect, fetchBalance }) {
  const [balance, setBalance]       = useState(null)
  const [loadingBal, setLoadingBal] = useState(false)
  const [copied, setCopied]         = useState(false)

  useEffect(() => {
    if (!address || !fetchBalance) return
    setLoadingBal(true)
    fetchBalance().then(bal => {
      setBalance(bal)
      setLoadingBal(false)
    })
  }, [address])

  const copy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ background: '#0f0f17', borderBottom: '1px solid #2a2a3a' }}
         className="px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center
                          font-bold text-white text-sm"
               style={{ background: '#6366f1' }}>
            SV
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            StellarVest
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: '#1a1a2e', color: '#6366f1',
                         border: '1px solid #2a2a3a' }}>
            TESTNET
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {address ? (
            <>
              {/* Balance */}
              <div className="text-right">
                {loadingBal ? <BalanceSkeleton /> : (
                  <>
                    <div className="text-white font-bold text-sm">
                      {balance ?? '—'} XLM
                    </div>
                    <div className="text-gray-500 text-xs">Balance</div>
                  </>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                   style={{ background: '#1a1a2e', border: '1px solid #2a2a3a' }}>
                <span className="w-2 h-2 rounded-full bg-green-400"
                      style={{ animation: 'pulse 2s infinite' }} />
                <span className="font-mono text-white text-xs">
                  {shortAddress(address)}
                </span>
                <button onClick={copy}
                        className="text-gray-500 hover:text-white text-xs
                                   transition-colors bg-transparent border-none
                                   cursor-pointer">
                  {copied ? '✓' : '⎘'}
                </button>
              </div>

              {/* Disconnect */}
              <button onClick={onDisconnect}
                      className="text-xs px-3 py-2 rounded-xl border
                                 cursor-pointer transition-all"
                      style={{ background: 'transparent',
                               border: '1px solid #2a2a3a', color: '#6b7280' }}
                      onMouseEnter={e => {
                        e.target.style.borderColor = '#f87171'
                        e.target.style.color = '#f87171'
                      }}
                      onMouseLeave={e => {
                        e.target.style.borderColor = '#2a2a3a'
                        e.target.style.color = '#6b7280'
                      }}>
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={onConnect} disabled={isConnecting}
                    className="px-5 py-2 rounded-xl text-white font-semibold
                               text-sm cursor-pointer border-none transition-opacity"
                    style={{ background: '#6366f1',
                             opacity: isConnecting ? 0.7 : 1 }}>
              {isConnecting ? 'Connecting…' : 'Connect Freighter'}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-3 px-4 py-3 rounded-xl text-sm"
             style={{ background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.3)' }}>
          <span style={{ color: '#f87171' }}>
            {error.type === 'NOT_FOUND' ? '⚠ Wallet Not Found: ' :
             error.type === 'REJECTED'  ? '⚠ Rejected: ' : '⚠ Error: '}
          </span>
          <span style={{ color: '#fca5a5' }}>{error.message}</span>
        </div>
      )}
    </div>
  )
}