'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Components.GuideContent');
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("")

  const sections: Section[] = [
    { id: "intro", title: t('sections.intro') },
    { id: "foundation", title: t('sections.foundation') },
    { id: "strength", title: t('sections.strength') },
    { id: "beyond", title: t('sections.beyond') },
    { id: "implementation", title: t('sections.implementation') },
    { id: "future", title: t('sections.future') },
  ]

  const strengthExamples8Char: PasswordStrength[] = [
    { type: t('strengthExamples.8char.type1'), time: t('strengthExamples.8char.time1'), variant: "destructive" },
    { type: t('strengthExamples.8char.type2'), time: t('strengthExamples.8char.time2'), variant: "outline" },
    { type: t('strengthExamples.8char.type3'), time: t('strengthExamples.8char.time3'), variant: "outline" },
    { type: t('strengthExamples.8char.type4'), time: t('strengthExamples.8char.time4'), variant: "default" },
  ]

  const strengthExamples12Char: PasswordStrength[] = [
    { type: t('strengthExamples.12char.type1'), time: t('strengthExamples.12char.time1'), variant: "outline" },
    { type: t('strengthExamples.12char.type2'), time: t('strengthExamples.12char.time2'), variant: "default" },
    { type: t('strengthExamples.12char.type3'), time: t('strengthExamples.12char.time3'), variant: "default" },
    { type: t('strengthExamples.12char.type4'), time: t('strengthExamples.12char.time4'), variant: "default" },
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
          {/* Giới thiệu */}
          <section id="intro" className="scroll-mt-16">
            <Alert className="mb-8 bg-yellow-500/15 border-yellow-500/50">
              <AlertDescription className="text-base font-medium">
                {t('introAlert')}
              </AlertDescription>
            </Alert>
            
            <p className="text-lg text-muted-foreground">
              {t('introDescription')}
            </p>
          </section>

          {/* Nguyên tắc cơ bản */}
          <section id="foundation" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('foundationTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">{t('foundationPoint1.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('foundationPoint1.description')}
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">{t('foundationPoint2.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('foundationPoint2.description')}
                </p>
              </Card>
            </div>
          </section>

          {/* Độ mạnh mật khẩu */}
          <section id="strength" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('strengthTitle')}</h2>
            <div className="space-y-6">
              <div className="prose prose-sm dark:prose-invert mb-4">
                <p>
                  {t('strengthDescription')}
                </p>
              </div>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">{t('strength8CharTitle')}</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples8Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">{t('strength8CharConclusion')}</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>{t('strength8CharPoint1')}</li>
                      <li>{t('strength8CharPoint2')}</li>
                      <li>{t('strength8CharPoint3')}</li>
                      <li>{t('strength8CharPoint4')}</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">{t('strength12CharTitle')}</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples12Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">{t('strength12CharConclusion')}</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>{t('strength12CharPoint1')}</li>
                      <li>{t('strength12CharPoint2')}</li>
                      <li>{t('strength12CharPoint3')}</li>
                      <li>{t('strength12CharPoint4')}</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{t('strengthTip')}</span> {t('strengthTipDescription')}
                </p>
              </div>
            </div>
          </section>

          {/* Cách tạo mật khẩu tốt */}
          <section id="tips" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('tipsTitle')}</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">{t('doTitle')}</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>{t('doTip1')}</li>
                  <li>{t('doTip2')}</li>
                  <li>{t('doTip3')}</li>
                  <li>{t('doTip4')}</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">{t('dontTitle')}</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>{t('dontTip1')}</li>
                  <li>{t('dontTip2')}</li>
                  <li>{t('dontTip3')}</li>
                  <li>{t('dontTip4')}</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Lời khuyên thêm */}
          <section id="extra" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('extraTitle')}</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('extraTip')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>{t('extraTip1')}</li>
                  <li>{t('extraTip2')}</li>
                  <li>{t('extraTip3')}</li>
                  <li>{t('extraTip4')}</li>
                </ul>
              </div>
            </Card>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
} 