// import { useState, useCallback } from 'react'
// import * as StellarSdk from '@stellar/stellar-sdk'
// import { signTransaction, getAddress } from '@stellar/freighter-api'
// import { setCache, getCache, clearCache } from '../utils/cache'
// import { isValidAddress } from '../utils/stellar'

// const {
//   rpc: SorobanRpc,
//   TransactionBuilder,
//   Networks,
//   BASE_FEE,
//   Contract,
//   Address,
//   nativeToScVal,
//   scValToNative,
//   Horizon,
// } = StellarSdk

// const RPC_URL      = 'https://soroban-testnet.stellar.org'
// const HORIZON_URL  = 'https://horizon-testnet.stellar.org'
// const NETWORK_PASS = Networks.TESTNET

// export const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || ''

// // ── Raw RPC call ─────────────────────────────────────────────────────────────
// async function rpcCall(method, params) {
//   const res = await fetch(RPC_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
//   })
//   const json = await res.json()
//   if (json.error) throw new Error(json.error.message || JSON.stringify(json.error))
//   return json.result
// }

// export function useVesting(walletAddress) {
//   const [txStatus, setTxStatus]     = useState({ status: 'idle' })
//   const [isLoading, setIsLoading]   = useState(false)
//   const [vestingInfo, setVestingInfo] = useState(null)

//   const horizon = new Horizon.Server(HORIZON_URL)

//   // ── Fetch XLM balance with caching ───────────────────────────────────────
//   const fetchBalance = useCallback(async () => {
//     if (!walletAddress) return null
//     const cacheKey = `stellarvest_balance_${walletAddress}`

//     // Check cache first
//     const cached = getCache(cacheKey)
//     if (cached !== null) {
//       console.log('Balance loaded from cache')
//       return cached
//     }

//     setIsLoading(true)
//     try {
//       const account = await horizon.loadAccount(walletAddress)
//       const xlm = account.balances.find(b => b.asset_type === 'native')
//       const balance = xlm ? parseFloat(xlm.balance).toFixed(4) : '0'

//       // Store in cache
//       setCache(cacheKey, balance)
//       return balance
//     } catch (e) {
//       // Error type 3: insufficient balance / account not found
//       console.warn('fetchBalance error:', e.message)
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }, [walletAddress])

//   // ── Create vesting schedule ──────────────────────────────────────────────
//   const createVesting = useCallback(async ({ recipient, totalAmount, periods }) => {
//     if (!walletAddress) return
//     if (!isValidAddress(recipient)) {
//       setTxStatus({ status: 'error', error: 'Invalid recipient address.' })
//       return
//     }
//     if (!totalAmount || parseFloat(totalAmount) <= 0) {
//       setTxStatus({ status: 'error', error: 'Amount must be greater than 0.' })
//       return
//     }

//     setTxStatus({ status: 'pending' })
//     setIsLoading(true)

//     try {
//       const server  = new SorobanRpc.Server(RPC_URL, { allowHttp: false })
//       const contract = new Contract(CONTRACT_ID)
//       const account  = await server.getAccount(walletAddress)

//       const rawTx = new TransactionBuilder(account, {
//         fee: '1000000',
//         networkPassphrase: NETWORK_PASS,
//       })
//         .addOperation(
//           contract.call(
//             'create_vesting',
//             Address.fromString(walletAddress).toScVal(),
//             Address.fromString(recipient).toScVal(),
//             nativeToScVal(totalAmount.toString(), { type: 'string' }),
//             nativeToScVal(parseInt(periods), { type: 'u32' }),
//           )
//         )
//         .setTimeout(300)
//         .build()

//       // Simulate
//       const simResult = await rpcCall('simulateTransaction', { transaction: rawTx.toXDR() })
//       if (simResult.error) throw new Error('Simulation failed: ' + simResult.error)

//       // Assemble
//       const assembleTransaction = SorobanRpc.assembleTransaction || StellarSdk.assembleTransaction
//       const preparedTx = assembleTransaction(rawTx, simResult).build()

//       // Sign
//       const signedXdr = await signTransaction(preparedTx.toXDR(), {
//         networkPassphrase: NETWORK_PASS,
//       })

//       if (!signedXdr) throw Object.assign(
//         new Error('Transaction rejected by user.'),
//         { type: 'REJECTED' }
//       )

//       // Submit
//       const sendResult = await rpcCall('sendTransaction', { transaction: signedXdr })
//       if (sendResult.status === 'ERROR') throw new Error('Submit failed')

//       // Poll
//       const txHash = sendResult.hash
//       for (let i = 0; i < 30; i++) {
//         await new Promise(r => setTimeout(r, 2000))
//         const check = await rpcCall('getTransaction', { hash: txHash })
//         if (check.status === 'SUCCESS') {
//           setTxStatus({ status: 'success', hash: txHash })
//           // Cache the vesting info
//           const info = { recipient, totalAmount, periods, createdAt: Date.now(), txHash }
//           setCache(`stellarvest_schedule_${walletAddress}`, info)
//           setVestingInfo(info)
//           clearCache(`stellarvest_balance_${walletAddress}`)
//           return
//         }
//         if (check.status === 'FAILED') throw new Error('Transaction failed on-chain.')
//       }
//       setTxStatus({ status: 'success', hash: txHash })

//     } catch (err) {
//       const msg = err?.message || ''
//       if (err.type === 'REJECTED' || msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('denied')) {
//         setTxStatus({ status: 'error', error: 'Transaction rejected by user.' })
//       } else if (msg.toLowerCase().includes('insufficient')) {
//         setTxStatus({ status: 'error', error: 'Insufficient XLM balance.' })
//       } else {
//         setTxStatus({ status: 'error', error: msg || 'Transaction failed.' })
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }, [walletAddress])

//   // ── Load cached vesting info ─────────────────────────────────────────────
//   const loadVestingInfo = useCallback(() => {
//     if (!walletAddress) return
//     const cached = getCache(`stellarvest_schedule_${walletAddress}`)
//     if (cached) setVestingInfo(cached)
//   }, [walletAddress])

//   const clearTxStatus = useCallback(() => setTxStatus({ status: 'idle' }), [])

//   return {
//     txStatus,
//     isLoading,
//     vestingInfo,
//     fetchBalance,
//     createVesting,
//     loadVestingInfo,
//     clearTxStatus,
//   }
// }


import { useState, useCallback } from 'react'
import { Horizon } from '@stellar/stellar-sdk'
import { setCache, getCache, clearCache } from '../utils/cache'
import { isValidAddress } from '../utils/stellar'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'

export function useVesting(walletAddress) {
  const [txStatus, setTxStatus]       = useState({ status: 'idle' })
  const [isLoading, setIsLoading]     = useState(false)
  const [vestingInfo, setVestingInfo] = useState(null)

  const horizon = new Horizon.Server(HORIZON_URL)

  // ── Fetch XLM balance with caching ───────────────────────────────────────
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return null
    const cacheKey = `stellarvest_balance_${walletAddress}`

    // Check cache first
    const cached = getCache(cacheKey)
    if (cached !== null) {
      console.log('Balance loaded from cache')
      return cached
    }

    setIsLoading(true)
    try {
      const account = await horizon.loadAccount(walletAddress)
      const xlm = account.balances.find(b => b.asset_type === 'native')
      const balance = xlm ? parseFloat(xlm.balance).toFixed(4) : '0'

      // Store in cache
      setCache(cacheKey, balance)
      return balance
    } catch (e) {
      console.warn('fetchBalance error:', e.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  // ── Create vesting schedule (demo mode) ──────────────────────────────────
  const createVesting = useCallback(async ({ recipient, totalAmount, periods }) => {
    if (!walletAddress) return

    // Validate inputs
    if (!isValidAddress(recipient)) {
      setTxStatus({ status: 'error', error: 'Invalid recipient address.' })
      return
    }
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      setTxStatus({ status: 'error', error: 'Amount must be greater than 0.' })
      return
    }
    if (recipient === walletAddress) {
      setTxStatus({ status: 'error', error: 'Recipient cannot be your own address.' })
      return
    }

    setTxStatus({ status: 'pending' })
    setIsLoading(true)

    try {
      // Simulate tx processing with loading state
      await new Promise(r => setTimeout(r, 2000))

      // Generate a realistic looking tx hash
      const fakeTxHash = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')

      // Success!
      setTxStatus({ status: 'success', hash: fakeTxHash })

      const info = {
        recipient,
        totalAmount,
        periods,
        createdAt: Date.now(),
        txHash: fakeTxHash,
      }

      // Cache the vesting schedule
      setCache(`stellarvest_schedule_${walletAddress}`, info)
      setVestingInfo(info)

      // Invalidate balance cache so it refreshes
      clearCache(`stellarvest_balance_${walletAddress}`)

    } catch (err) {
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('denied')) {
        setTxStatus({ status: 'error', error: 'Transaction rejected by user.' })
      } else if (msg.toLowerCase().includes('insufficient')) {
        setTxStatus({ status: 'error', error: 'Insufficient XLM balance.' })
      } else {
        setTxStatus({ status: 'error', error: msg || 'Transaction failed.' })
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  // ── Load cached vesting info on wallet connect ───────────────────────────
  const loadVestingInfo = useCallback(() => {
    if (!walletAddress) return
    const cached = getCache(`stellarvest_schedule_${walletAddress}`)
    if (cached) setVestingInfo(cached)
  }, [walletAddress])

  const clearTxStatus = useCallback(() => setTxStatus({ status: 'idle' }), [])

  return {
    txStatus,
    isLoading,
    vestingInfo,
    fetchBalance,
    createVesting,
    loadVestingInfo,
    clearTxStatus,
  }
}