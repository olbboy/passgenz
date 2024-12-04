'use client'

import dynamic from 'next/dynamic'

const MatrixHeader = dynamic(
  () => import('@/components/matrix-header').then(mod => mod.MatrixHeader),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold">PassGenz</h1>
      </div>
    )
  }
)

export function MatrixHeaderWrapper() {
  return <MatrixHeader />
} 