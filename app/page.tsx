import { GeneratorTabs } from '@/components/generator-tabs'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Secret Password Generator</h1>
            <ThemeToggle />
          </div>
          <GeneratorTabs />
        </div>
      </div>
    </main>
  )
}
