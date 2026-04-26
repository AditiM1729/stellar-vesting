export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
  )
}

export function BalanceSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-32"></div>
      <div className="h-3 bg-gray-700 rounded w-16 mt-2"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="h-5 bg-gray-700 rounded w-1/3 mb-6"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-700 rounded-xl"></div>
        <div className="h-10 bg-gray-700 rounded-xl"></div>
        <div className="h-10 bg-gray-700 rounded-xl"></div>
        <div className="h-12 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  )
}