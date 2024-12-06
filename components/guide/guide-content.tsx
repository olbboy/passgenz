'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
}

interface PasswordStrength {
  type: string
  time: string
  variant: "default" | "destructive" | "outline"
}

export function GuideContent(): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("")

  const sections: Section[] = [
    { id: "intro", title: "Understanding Modern Password Security" },
    { id: "foundation", title: "The Foundation of Strong Passwords" },
    { id: "strength", title: "Password Strength in Practice" },
    { id: "beyond", title: "Beyond Traditional Passwords" },
    { id: "implementation", title: "Practical Security Implementation" },
    { id: "future", title: "Future-Proofing Your Security" },
  ]

  const strengthExamples8Char: PasswordStrength[] = [
    { type: "Only lowercase letters", time: "Instantly", variant: "destructive" },
    { type: "Add uppercase letters", time: "30 minutes", variant: "outline" },
    { type: "Add numbers (123)", time: "1 hour", variant: "outline" },
    { type: "Add special characters (@#$)", time: "24 hours", variant: "default" },
  ]

  const strengthExamples12Char: PasswordStrength[] = [
    { type: "Only lowercase letters", time: "A few weeks", variant: "outline" },
    { type: "Add uppercase letters", time: "5 years", variant: "default" },
    { type: "Add numbers (123)", time: "2,000 years", variant: "default" },
    { type: "Add special characters (@#$)", time: "63,000 years", variant: "default" },
  ]

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement
      const progress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100
      setScrollProgress(progress)

      const sectionElements = sections.map(s => document.getElementById(s.id))
      const currentSection = sectionElements.find(el => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= window.innerHeight / 3
      })
      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    const scrollContainer = document.querySelector('.scroll-container')
    scrollContainer?.addEventListener('scroll', handleScroll)
    return () => scrollContainer?.removeEventListener('scroll', handleScroll)
  }, [sections])

  const renderStrengthExample = (strength: PasswordStrength) => (
    <div key={strength.type} className="flex justify-between items-center">
      <span>{strength.type}</span>
      <Badge variant={strength.variant}>{strength.time}</Badge>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <Progress value={scrollProgress} className="w-full" />
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)] scroll-container">
        <div className="px-6 py-8 max-w-[900px] mx-auto space-y-12">
          {/* Introduction */}
          <section id="intro" className="scroll-mt-16">
            <Alert className="mb-8 bg-yellow-500/15 border-yellow-500/50">
              <AlertDescription className="text-base font-medium">
                Did you know? 81% of data breaches occur due to weak or stolen passwords!
              </AlertDescription>
            </Alert>
            
            <p className="text-lg text-muted-foreground">
              In today's internet age, protecting your password is crucial. Just like you lock your house to protect your belongings, a strong password will help protect your personal information online.
            </p>
          </section>

          {/* Foundation */}
          <section id="foundation" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Two Important Things About Passwords</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">1. One password per account</h3>
                <p className="text-sm text-muted-foreground">
                  Imagine: If you use the same key for both your house and your safe, when a thief gets the key, they can access everything. Passwords are the same - each account should have a unique password!
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">2. Passwords must be truly random</h3>
                <p className="text-sm text-muted-foreground">
                  Don't use easily guessable information like birthdays, pet names, or phone numbers. Create truly random passwords to make them hard to guess!
                </p>
              </Card>
            </div>
          </section>

          {/* Password Strength */}
          <section id="strength" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">How Strong or Weak is a Password?</h2>
            <div className="space-y-6">
              <div className="prose prose-sm dark:prose-invert mb-4">
                <p>
                  When creating a password, the length and complexity determine how long it takes for a hacker to crack your password. Here are some examples:
                </p>
              </div>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Password Strength for 8 Characters</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples8Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">🤔 What does this mean?</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>Instantly: If only using lowercase (like 'password'), a computer can guess it immediately.</li>
                      <li>30 minutes: Adding uppercase (like 'Password') makes it a bit harder, but still not secure enough.</li>
                      <li>1 hour: Adding numbers (like 'Password123') is still not strong enough.</li>
                      <li>24 hours: Adding special characters (like 'Password@123') is better, but still not truly safe.</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Password Strength for 12 Characters</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples12Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">✅ Conclusion: A password of 12 characters or more, combined with various character types, will be VERY SAFE!</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>A few weeks: Only using lowercase letters (like 'helloeveryone') is still not safe.</li>
                      <li>5 years: Adding uppercase letters (like 'HelloEveryone') makes it much harder to crack.</li>
                      <li>2,000 years: Adding numbers (like 'HelloEveryone123') is very hard to crack.</li>
                      <li>63,000 years: Adding special characters (like 'HelloEveryone@123') is nearly impossible to crack with current technology.</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">💡 Tip:</span> Instead of remembering complex characters, you can use an easy-to-remember phrase and add numbers and special characters. For example: 'I love pho' → 'ILove@Pho2024'
                </p>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section id="tips" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Tips for Creating a Secure Password</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Things YOU SHOULD do:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Use at least 12 characters</li>
                  <li>Combine uppercase, lowercase, numbers, and special characters</li>
                  <li>Use random phrases (e.g., 'BlueCatLoves@Fish2024')</li>
                  <li>Change important passwords every 3-6 months</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Things YOU SHOULD NOT do:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Use personal information (birthdays, names, phone numbers)</li>
                  <li>Use dictionary words</li>
                  <li>Use overly simple passwords (123456, password)</li>
                  <li>Use the same password for multiple accounts</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Extra Tips */}
          <section id="extra" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Additional Tips to Protect Your Account</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  In addition to setting a strong password, you should:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Enable two-factor authentication if possible</li>
                  <li>Do not share your password with others</li>
                  <li>Do not enter your password on public computers</li>
                  <li>Use a password manager to store securely</li>
                </ul>
              </div>
            </Card>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
} 