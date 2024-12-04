import { GeneratorTabs } from '@/components/generator-tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'
import { Suspense } from 'react'
import { MatrixHeaderWrapper } from '@/components/matrix-header-wrapper'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="PassGenz Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <Suspense fallback={<h1 className="text-4xl font-bold">PassGenz</h1>}>
                <MatrixHeaderWrapper />
              </Suspense>
            </div>
            <ThemeToggle />
          </div>
          <GeneratorTabs />
        </div>
      </div>
    </main>
  )
}
