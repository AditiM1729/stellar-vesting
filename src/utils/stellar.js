// Stellar utility functions

export function shortAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false
  if (!address.startsWith('G')) return false
  if (address.length !== 56) return false
  const validChars = /^[A-Z2-7]+$/
  return validChars.test(address)
}

export function xlmToStroops(xlm) {
  return Math.round(parseFloat(xlm) * 10_000_000)
}

export function stroopsToXlm(stroops) {
  return (parseInt(stroops) / 10_000_000).toFixed(7)
}

export function formatXlm(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

export function getExplorerUrl(type, id) {
  const base = 'https://stellar.expert/explorer/testnet'
  if (type === 'tx') return `${base}/tx/${id}`
  if (type === 'account') return `${base}/account/${id}`
  if (type === 'contract') return `${base}/contract/${id}`
  return base
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}