import { GeneratorTabs } from '@/components/generator-tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { GuideDrawer } from '@/components/guide/guide-drawer'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { MatrixHeaderWrapper } from '@/components/matrix-header-wrapper'
import { PrivacyNotice } from '@/components/privacy-notice'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-2">
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
            </Link>
            <div className="flex items-center gap-2">
              <GuideDrawer />
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
          <PrivacyNotice />
          <GeneratorTabs />
        </div>
      </div>
    </main>
  )
}
