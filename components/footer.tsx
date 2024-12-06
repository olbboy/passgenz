import Link from 'next/link'
import { siX } from 'simple-icons'

export function Footer() {
  return (
    <footer className="w-full py-5 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <span>Made by</span>
        <Link
          href="https://x.com/olbboyz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
          >
            <path d={siX.path} />
          </svg>
          <span>@olbboyz</span>
        </Link>
      </div>
    </footer>
  )
} 