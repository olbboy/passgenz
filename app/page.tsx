import { GeneratorTabs } from '@/components/generator-tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Github } from "lucide-react"
import Link from 'next/link'
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
            <div className="flex items-center gap-2">
              <Link 
                href="https://github.com/olbboy/passgenz" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
            </div>
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
                Our password generation process operates exclusively within your local device environment, ensuring maximum security and privacy. At no point are your passwords transmitted or stored—they remain completely ephemeral, leaving no trace on either your device or our servers.
              </AlertDescription>
            </div>
          </Alert>
          <GeneratorTabs />
        </div>
      </div>
    </main>
  )
}
