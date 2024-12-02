"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Shield, AlertTriangle } from 'lucide-react'
import { generatePassword } from '@/lib/generators'
import { Progress } from '@/components/ui/progress'

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  memorable: boolean
}

interface PasswordStrength {
  score: number
  feedback: string
  timeToCrack: string
}

export function PasswordGenerator() {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState([16])
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    memorable: false,
  })
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    timeToCrack: '',
  })

  const calculateStrength = (pwd: string): PasswordStrength => {
    const score = pwd.length >= 12 ? 100 : (pwd.length / 12) * 100
    return {
      score,
      feedback: score >= 80 ? 'Very Strong' : score >= 60 ? 'Strong' : 'Weak',
      timeToCrack: score >= 80 ? '> 1000 years' : '< 1 year'
    }
  }

  const handleGeneratePassword = async () => {
    try {
      const newPassword = await generatePassword(length[0], options)
      setPassword(newPassword)
      setStrength(calculateStrength(newPassword))
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  const copyToClipboard = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    toast({
      title: 'Copied!',
      description: 'Password copied to clipboard',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Generator
        </CardTitle>
        <CardDescription>
          Generate secure, quantum-resistant passwords
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
              <span className="text-xl font-mono flex-1 font-[family-name:var(--font-geist-mono)]">
                {password || 'Click generate'}
              </span>
              <Button variant="outline" size="icon" onClick={handleGeneratePassword}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength</span>
                  <span className={strength.score >= 80 ? 'text-green-500' : 'text-yellow-500'}>
                    {strength.feedback}
                  </span>
                </div>
                <Progress value={strength.score} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time to crack: {strength.timeToCrack}</span>
                  {strength.score < 80 && (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Consider increasing length
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <div>
            <Label>Password Length: {length}</Label>
            <Slider
              value={length}
              onValueChange={setLength}
              min={8}
              max={128}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="memorable">Memorable Password</Label>
              <Switch
                id="memorable"
                checked={options.memorable}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, memorable: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Uppercase Letters</Label>
              <Switch
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, uppercase: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Lowercase Letters</Label>
              <Switch
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, lowercase: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Numbers</Label>
              <Switch
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, numbers: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Special Characters</Label>
              <Switch
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, symbols: checked }))
                }
              />
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleGeneratePassword}
            size="lg"
          >
            Generate Secure Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}