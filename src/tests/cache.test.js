import { describe, it, expect, beforeEach } from 'vitest'
import { setCache, getCache, clearCache, clearAllCache } from '../utils/cache'

describe('Cache Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store and retrieve data from cache', () => {
    setCache('stellarvest_test', { balance: '100' })
    const result = getCache('stellarvest_test')
    expect(result).toEqual({ balance: '100' })
  })

  it('should return null for missing cache key', () => {
    const result = getCache('stellarvest_nonexistent')
    expect(result).toBeNull()
  })

  it('should clear a specific cache key', () => {
    setCache('stellarvest_test', { balance: '100' })
    clearCache('stellarvest_test')
    const result = getCache('stellarvest_test')
    expect(result).toBeNull()
  })

  it('should clear all stellarvest cache keys', () => {
    setCache('stellarvest_one', { a: 1 })
    setCache('stellarvest_two', { b: 2 })
    clearAllCache()
    expect(getCache('stellarvest_one')).toBeNull()
    expect(getCache('stellarvest_two')).toBeNull()
  })
})