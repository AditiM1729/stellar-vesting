import { describe, it, expect } from 'vitest'
import { isValidAddress, xlmToStroops, formatXlm } from '../utils/stellar'
import { setCache, getCache } from '../utils/cache'

describe('Vesting Logic', () => {
  it('should validate recipient address before vesting', () => {
    const validRecipient = 'GAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU'
    const invalidRecipient = 'not-an-address'
    expect(isValidAddress(validRecipient)).toBe(true)
    expect(isValidAddress(invalidRecipient)).toBe(false)
  })

  it('should calculate correct vesting amount in stroops', () => {
    const totalXlm = 1000
    const vestingPeriods = 4
    const perPeriod = totalXlm / vestingPeriods
    const stroops = xlmToStroops(perPeriod)
    expect(stroops).toBe(2_500_000_000)
  })

  it('should cache and retrieve vesting schedule', () => {
    const schedule = {
      recipient: 'GAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU',
      totalAmount: '1000',
      periods: 4,
      startDate: Date.now(),
    }
    setCache('stellarvest_schedule', schedule)
    const cached = getCache('stellarvest_schedule')
    expect(cached.recipient).toBe(schedule.recipient)
    expect(cached.totalAmount).toBe('1000')
    expect(cached.periods).toBe(4)
  })

  it('should format XLM amounts for display', () => {
    expect(formatXlm(1000)).toBe('1,000.00')
    expect(formatXlm(0.5)).toBe('0.50')
    expect(formatXlm(9999.9999)).toBe('9,999.9999')
  })
})