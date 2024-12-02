"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { generatePassword } from '@/lib/generators'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface PasswordAnalysis {
  entropy: number
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  timeToCrack: string
  quantumResistant: boolean
  weaknesses: string[]
}

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  memorable: boolean
  quantumSafe: boolean
}

export function PasswordGenerator() {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [length, setLength] = useState([16])
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    memorable: false,
    quantumSafe: true
  })

  const handleGeneratePassword = async () => {
    try {
      const result = await generatePassword(length[0], options)
      setPassword(result.password)
      setAnalysis(result.analysis)
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
          Quantum-Safe Password Generator
        </CardTitle>
        <CardDescription>
          Generate cryptographically secure passwords with quantum resistance
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <span className={analysis?.strength === 'very-strong' ? 'text-green-500' : analysis?.strength === 'strong' ? 'text-blue-500' : analysis?.strength === 'medium' ? 'text-yellow-500' : 'text-red-500'}>
                    {analysis?.strength}
                  </span>
                </div>
                <Progress value={analysis?.entropy.toFixed(2) || 0} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time to crack: {analysis?.timeToCrack}</span>
                  {analysis?.strength !== 'very-strong' && (
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

        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Entropy Score</span>
                <span>{analysis.entropy.toFixed(2)} bits</span>
              </div>
              <Progress 
                value={analysis ? Number(analysis.entropy.toFixed(2)) : 0} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Strength</Label>
                <div className={cn(
                  "text-sm font-medium",
                  analysis.strength === 'very-strong' && "text-green-500",
                  analysis.strength === 'strong' && "text-blue-500",
                  analysis.strength === 'medium' && "text-yellow-500",
                  analysis.strength === 'weak' && "text-red-500"
                )}>
                  {analysis.strength}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Time to Crack</Label>
                <div className="text-sm">{analysis.timeToCrack}</div>
              </div>

              <div className="space-y-1">
                <Label>Quantum Resistant</Label>
                <div className="flex items-center gap-2">
                  {analysis.quantumResistant ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {analysis.quantumResistant ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {analysis.weaknesses.length > 0 && (
              <div className="space-y-2">
                <Label>Weaknesses</Label>
                <ul className="text-sm space-y-1">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-center gap-2 text-yellow-500">
                      <AlertTriangle className="h-4 w-4" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

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

            <div className="flex items-center justify-between">
              <Label htmlFor="quantumSafe">Quantum-Safe Generation</Label>
              <Switch
                id="quantumSafe"
                checked={options.quantumSafe}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, quantumSafe: checked }))
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