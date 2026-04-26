import { shortAddress, getExplorerUrl, timeAgo } from '../utils/stellar'
import { LoadingSkeleton } from './LoadingSkeleton'

export function VestingDashboard({ vestingInfo, txStatus, isLoading, onClear }) {

  if (isLoading) {
    return (
      <div style={{ background: '#111118', border: '1px solid #2a2a3a',
                    borderRadius: 20, padding: 28 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700,
                     marginBottom: 24 }}>📊 Vesting Dashboard</h2>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div style={{ background: '#111118', border: '1px solid #2a2a3a',
                  borderRadius: 20, padding: 28 }}>
      <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700,
                   marginBottom: 24, letterSpacing: '-0.02em' }}>
        📊 Vesting Dashboard
      </h2>

      {/* TX Status */}
      {txStatus.status !== 'idle' && (
        <div style={{
          marginBottom: 20,
          padding: '16px',
          borderRadius: 12,
          background: txStatus.status === 'pending'  ? 'rgba(99,102,241,0.1)'  :
                      txStatus.status === 'success'  ? 'rgba(74,222,128,0.08)' :
                                                       'rgba(248,113,113,0.08)',
          border: `1px solid ${
            txStatus.status === 'pending' ? 'rgba(99,102,241,0.4)'  :
            txStatus.status === 'success' ? 'rgba(74,222,128,0.35)' :
                                            'rgba(248,113,113,0.35)'
          }`,
        }}>
          {/* Pending */}
          {txStatus.status === 'pending' && (
            <div className="flex items-center gap-3">
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(99,102,241,0.3)',
                borderTopColor: '#6366f1',
                animation: 'spin 0.7s linear infinite',
                flexShrink: 0,
              }} />
              <div>
                <p style={{ color: '#a5b4fc', fontWeight: 700,
                            fontSize: 13, marginBottom: 2 }}>
                  Transaction Pending
                </p>
                <p style={{ color: '#6b7280', fontSize: 12 }}>
                  Waiting for confirmation on Stellar Testnet…
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {txStatus.status === 'success' && (
            <div>
              <p style={{ color: '#4ade80', fontWeight: 700,
                          fontSize: 13, marginBottom: 6 }}>
                ✓ Vesting Schedule Created!
              </p>
              {txStatus.hash && (
                <>
                  <p style={{ color: '#6b7280', fontSize: 11,
                              marginBottom: 4 }}>Transaction Hash</p>
                  <p style={{ color: '#a5b4fc', fontSize: 11,
                              fontFamily: 'monospace', wordBreak: 'break-all',
                              marginBottom: 8 }}>
                    {txStatus.hash}
                  </p>
                  <a href={getExplorerUrl('tx', txStatus.hash)}
                     target="_blank" rel="noopener noreferrer"
                     style={{ color: '#6366f1', fontSize: 12,
                              textDecoration: 'none', fontWeight: 500 }}>
                    View on Stellar Expert →
                  </a>
                </>
              )}
              <button onClick={onClear}
                      style={{ display: 'block', marginTop: 10,
                               background: 'none', border: 'none',
                               color: '#6b7280', fontSize: 12,
                               cursor: 'pointer' }}>
                Dismiss
              </button>
            </div>
          )}

          {/* Error */}
          {txStatus.status === 'error' && (
            <div>
              <p style={{ color: '#f87171', fontWeight: 700,
                          fontSize: 13, marginBottom: 4 }}>
                ✗ Transaction Failed
              </p>
              <p style={{ color: '#fca5a5', fontSize: 12,
                          marginBottom: 8 }}>
                {txStatus.error}
              </p>
              {/* Error type indicators */}
              <div style={{ display: 'flex', flexDirection: 'column',
                            gap: 4, marginTop: 8 }}>
                {[
                  { key: 'NOT_FOUND',    label: 'Wallet Not Found' },
                  { key: 'REJECTED',     label: 'User Rejected' },
                  { key: 'INSUFFICIENT', label: 'Insufficient Balance' },
                ].map(({ key, label }) => {
                  const active =
                    txStatus.error?.toLowerCase().includes('reject')     && key === 'REJECTED'     ||
                    txStatus.error?.toLowerCase().includes('insufficient') && key === 'INSUFFICIENT' ||
                    txStatus.error?.toLowerCase().includes('not installed') && key === 'NOT_FOUND'
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center',
                                           gap: 8, opacity: active ? 1 : 0.3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%',
                                     background: active ? '#f87171' : '#6b7280',
                                     display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 12,
                                     color: active ? '#f87171' : '#6b7280' }}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <button onClick={onClear}
                      style={{ marginTop: 10, background: 'none',
                               border: 'none', color: '#6b7280',
                               fontSize: 12, cursor: 'pointer' }}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vesting Info */}
      {vestingInfo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Recipient',    value: shortAddress(vestingInfo.recipient) },
            { label: 'Total Amount', value: `${vestingInfo.totalAmount} XLM` },
            { label: 'Periods',      value: vestingInfo.periods },
            { label: 'Per Period',   value: `${(parseFloat(vestingInfo.totalAmount) / vestingInfo.periods).toFixed(2)} XLM` },
            { label: 'Created',      value: timeAgo(vestingInfo.createdAt) },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '10px 14px',
              background: '#0f0f17', borderRadius: 10,
              border: '1px solid #2a2a3a',
            }}>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{label}</span>
              <span style={{ color: 'white', fontSize: 13,
                             fontWeight: 600, fontFamily: 'monospace' }}>
                {value}
              </span>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          marginBottom: 6 }}>
              <span style={{ color: '#6b7280', fontSize: 12 }}>
                Vesting Progress
              </span>
              <span style={{ color: '#6366f1', fontSize: 12, fontWeight: 600 }}>
                1 / {vestingInfo.periods} periods
              </span>
            </div>
            <div style={{ background: '#2a2a3a', borderRadius: 99,
                          height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(1 / vestingInfo.periods) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px 0',
                      color: '#6b7280' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <p style={{ fontSize: 14 }}>No vesting schedule yet</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Create one using the form
          </p>
        </div>
      )}
    </div>
  )
}