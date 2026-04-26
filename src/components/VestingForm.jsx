import { useState } from 'react'
import { isValidAddress } from '../utils/stellar'

export function VestingForm({ onSubmit, isLoading, walletAddress }) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount]       = useState('')
  const [periods, setPeriods]     = useState('4')
  const [errors, setErrors]       = useState({})

  const validate = () => {
    const newErrors = {}
    if (!isValidAddress(recipient)) {
      newErrors.recipient = 'Invalid Stellar address'
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (recipient === walletAddress) {
      newErrors.recipient = 'Recipient cannot be your own address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ recipient, totalAmount: amount, periods: parseInt(periods) })
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    background: '#0f0f17',
    border: `1px solid ${hasError ? '#f87171' : '#2a2a3a'}`,
    borderRadius: 12,
    padding: '12px 16px',
    color: 'white',
    fontSize: 14,
    fontFamily: 'monospace',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 6,
  }

  return (
    <div style={{ background: '#111118', border: '1px solid #2a2a3a',
                  borderRadius: 20, padding: 28 }}>
      <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700,
                   marginBottom: 24, letterSpacing: '-0.02em' }}>
        🔒 Create Vesting Schedule
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Recipient */}
        <div>
          <label style={labelStyle}>Recipient Address</label>
          <input
            type="text"
            placeholder="G..."
            value={recipient}
            onChange={e => {
              setRecipient(e.target.value)
              if (errors.recipient) setErrors(p => ({ ...p, recipient: '' }))
            }}
            style={inputStyle(errors.recipient)}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = errors.recipient ? '#f87171' : '#2a2a3a'}
          />
          {errors.recipient && (
            <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>
              {errors.recipient}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label style={labelStyle}>Total Amount (XLM)</label>
          <input
            type="number"
            placeholder="100"
            min="0.0000001"
            step="0.01"
            value={amount}
            onChange={e => {
              setAmount(e.target.value)
              if (errors.amount) setErrors(p => ({ ...p, amount: '' }))
            }}
            style={inputStyle(errors.amount)}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = errors.amount ? '#f87171' : '#2a2a3a'}
          />
          {errors.amount && (
            <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Periods */}
        <div>
          <label style={labelStyle}>Vesting Periods</label>
          <select
            value={periods}
            onChange={e => setPeriods(e.target.value)}
            style={{ ...inputStyle(false), cursor: 'pointer' }}>
            <option value="2">2 periods</option>
            <option value="4">4 periods</option>
            <option value="6">6 periods</option>
            <option value="12">12 periods</option>
          </select>
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
            Each period releases {amount
              ? (parseFloat(amount) / parseInt(periods)).toFixed(2)
              : '0'} XLM
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !walletAddress}
          style={{
            background: isLoading || !walletAddress ? '#2a2a3a' : '#6366f1',
            color: isLoading || !walletAddress ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: 12,
            padding: '14px',
            fontSize: 14,
            fontWeight: 700,
            cursor: isLoading || !walletAddress ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            width: '100%',
          }}>
          {!walletAddress
            ? 'Connect Wallet First'
            : isLoading
            ? '⏳ Processing…'
            : '🔒 Create Vesting Schedule'}
        </button>

        {!walletAddress && (
          <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>
            Connect your Freighter wallet to create a vesting schedule
          </p>
        )}
      </div>
    </div>
  )
}