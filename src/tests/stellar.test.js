import { describe, it, expect } from 'vitest'
import {
  shortAddress,
  isValidAddress,
  xlmToStroops,
  stroopsToXlm,
  formatXlm,
  getExplorerUrl,
} from '../utils/stellar'

describe('Stellar Utils', () => {
  it('should shorten a stellar address correctly', () => {
    const address = 'GAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU'
    const short = shortAddress(address)
    expect(short).toBe('GAWOCI...DSTHDU')
  })

  it('should validate a correct stellar address', () => {
    const valid = 'GAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU'
    expect(isValidAddress(valid)).toBe(true)
  })

  it('should reject an invalid stellar address', () => {
    expect(isValidAddress('notanaddress')).toBe(false)
    expect(isValidAddress('')).toBe(false)
    expect(isValidAddress(null)).toBe(false)
    expect(isValidAddress('XAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU')).toBe(false)
  })

  it('should convert XLM to stroops correctly', () => {
    expect(xlmToStroops(1)).toBe(10_000_000)
    expect(xlmToStroops(0.5)).toBe(5_000_000)
    expect(xlmToStroops(100)).toBe(1_000_000_000)
  })

  it('should convert stroops to XLM correctly', () => {
    expect(stroopsToXlm(10_000_000)).toBe('1.0000000')
    expect(stroopsToXlm(5_000_000)).toBe('0.5000000')
  })

  it('should build correct explorer URLs', () => {
    const txUrl = getExplorerUrl('tx', 'abc123')
    expect(txUrl).toBe('https://stellar.expert/explorer/testnet/tx/abc123')
    const contractUrl = getExplorerUrl('contract', 'CXXX')
    expect(contractUrl).toBe('https://stellar.expert/explorer/testnet/contract/CXXX')
  })
})