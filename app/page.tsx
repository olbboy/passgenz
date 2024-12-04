import { GeneratorTabs } from '@/components/generator-tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldCheck } from "lucide-react"
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
          <Alert 
            variant="default" 
            className="mb-6 bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 transition-all duration-300 hover:shadow-md"
          >
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <AlertTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Privacy First
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-100 text-sm leading-relaxed">
                Passwords are generated on the client side and are never stored anywhere. 
                Neither on the client nor on the server. Your security is our top priority.
              </AlertDescription>
            </div>
          </Alert>
          <GeneratorTabs />
        </div>
      </div>
    </main>
  )
}
