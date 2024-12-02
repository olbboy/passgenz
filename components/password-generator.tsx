"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle, Globe } from 'lucide-react'
import { generatePassword } from '@/lib/generators'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ContextAnalyzer, ServiceContext, PasswordRequirements } from '@/lib/context-analyzer'
import { PatternGenerator } from '@/lib/pattern-generator'
import { MemorableGenerator } from '@/lib/memorable-generator'
import { PasswordAnalysis, GeneratorConfig, GenerationResult, PasswordMetadata } from '@/lib/types'
import { HistoryManagementService } from '@/lib/history-management'
import { BreachDatabase } from '@/lib/breach-database'
import { Input } from '@/components/ui/input'
import { generatePatternFromRequirements, calculateTimeToCrack } from '@/lib/utils'

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
  const [usePattern, setUsePattern] = useState(false);
  const [pattern, setPattern] = useState('');
  const [useMemorable, setUseMemorable] = useState(false);
  const [memorableOptions, setMemorableOptions] = useState({
    wordCount: 3,
    capitalize: true,
    includeNumbers: true,
    includeSeparators: true
  });
  const [serviceUrl, setServiceUrl] = useState('');
  const [breachResult, setBreachResult] = useState<{
    breached: boolean;
    count?: number;
  } | null>(null);

  const contextAnalyzer = new ContextAnalyzer();
  const patternGenerator = new PatternGenerator();
  const memorableGenerator = new MemorableGenerator();
  const historyService = HistoryManagementService.getInstance()
  const breachDb = BreachDatabase.getInstance();

  useEffect(() => {
    if (usePattern) {
      setOptions(prev => ({
        ...prev,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false
      }))
    }
  }, [usePattern])

  const handleContextAnalysis = useCallback(() => {
    if (!serviceUrl) return;
    
    const analyzedContext = contextAnalyzer.analyzeContext(serviceUrl);
    const requirements = contextAnalyzer.suggestRequirements(analyzedContext);
    
    // Update length based on requirements
    setLength([requirements.minLength]);

    // If using pattern, generate appropriate pattern
    if (usePattern) {
      const newPattern = generatePatternFromRequirements(requirements);
      setPattern(newPattern);
    } else {
      // Update character options
      setOptions(prev => ({
        ...prev,
        uppercase: requirements.requiredChars.includes('uppercase'),
        lowercase: requirements.requiredChars.includes('lowercase'),
        numbers: requirements.requiredChars.includes('number'),
        symbols: requirements.requiredChars.includes('symbol')
      }));
    }

    // Show requirements in UI
    toast({
      title: 'Password Requirements',
      description: (
        <div className="space-y-2">
          <p>Minimum length: {requirements.minLength}</p>
          <p>Required characters:</p>
          <ul className="list-disc pl-4">
            {requirements.requiredChars.map(char => (
              <li key={char}>{char}</li>
            ))}
          </ul>
          {requirements.excludedChars && requirements.excludedChars.length > 0 && (
            <>
              <p>Excluded characters:</p>
              <ul className="list-disc pl-4">
                {requirements.excludedChars.map(char => (
                  <li key={char}>{char}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    });
  }, [serviceUrl, usePattern, toast]);

  const validatePasswordForService = useCallback((password: string) => {
    if (!serviceUrl) return true;
    
    const context = contextAnalyzer.analyzeContext(serviceUrl);
    const requirements = contextAnalyzer.suggestRequirements(context);

    const meetsLength = password.length >= requirements.minLength;
    const hasRequiredChars = requirements.requiredChars.every(type => {
      switch (type) {
        case 'uppercase': return /[A-Z]/.test(password);
        case 'lowercase': return /[a-z]/.test(password);
        case 'number': return /\d/.test(password);
        case 'symbol': return /[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(password);
        default: return true;
      }
    });
    const noExcludedChars = !requirements.excludedChars?.some(char => 
      password.includes(char)
    );

    return meetsLength && hasRequiredChars && noExcludedChars;
  }, [serviceUrl]);

  const handleGeneratePassword = async () => {
    try {
      let result: GenerationResult;
      if (usePattern && pattern) {
        const generated = patternGenerator.generateFromPattern(pattern);
        const entropy = patternGenerator.getPatternStrength(pattern);
        result = {
          password: generated,
          analysis: {
            entropy,
            strength: entropy > 80 ? 'very-strong' : 
                     entropy > 60 ? 'strong' :
                     entropy > 40 ? 'medium' : 'weak',
            timeToCrack: calculateTimeToCrack(entropy),
            quantumResistant: entropy > 100,
            weaknesses: []
          }
        };
      } else if (useMemorable) {
        const generated = memorableGenerator.generateMemorable(memorableOptions);
        const baseResult = await generatePassword(generated.length, options);
        result = {
          password: generated,
          analysis: baseResult.analysis
        };
      } else {
        result = await generatePassword(length[0], options);
      }

      setPassword(result.password);
      setAnalysis(result.analysis);

      // Check breach database
      const breach = await breachDb.checkPassword(result.password)
      setBreachResult(breach)

      // Validate against service requirements
      if (serviceUrl && !validatePasswordForService(result.password)) {
        toast({
          title: 'Warning',
          description: 'Generated password does not meet service requirements',
          variant: 'destructive'
        });
      }

      // Save to history
      await historyService.addEntry({
        value: result.password,
        feature: 'password',
        metadata: {
          strength: result.analysis.strength === 'very-strong' ? 1 :
                    result.analysis.strength === 'strong' ? 0.8 :
                    result.analysis.strength === 'medium' ? 0.6 : 0.4,
          analysis: {
            entropy: result.analysis.entropy,
            timeToCrack: result.analysis.timeToCrack,
            weaknesses: result.analysis.weaknesses,
            breached: breach.breached,
            breachCount: breach.count
          },
          context: serviceUrl || undefined,
          tags: ['generated']
        } as PasswordMetadata
      })
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
        <CardTitle>Password Generator</CardTitle>
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
                value={analysis?.entropy ? Number(analysis.entropy.toFixed(2)) : 0} 
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service URL (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={serviceUrl}
                  onChange={(e) => setServiceUrl(e.target.value)}
                />
                <Button 
                  variant="outline"
                  onClick={handleContextAnalysis}
                  disabled={!serviceUrl}
                >
                  Analyze
                </Button>
              </div>
            </div>

            {/* Show context info if available */}
            {serviceUrl && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Service: {contextAnalyzer.analyzeContext(serviceUrl).domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Security Level: {contextAnalyzer.analyzeContext(serviceUrl).securityLevel}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="usePattern">Use Pattern</Label>
              <Switch
                id="usePattern"
                checked={usePattern}
                onCheckedChange={setUsePattern}
              />
            </div>

            {usePattern && (
              <div className="space-y-2">
                <Label>Pattern (L=uppercase, l=lowercase, d=digit, s=symbol)</Label>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Example: Llddss"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="useMemorable">Memorable Password</Label>
              <Switch
                id="useMemorable"
                checked={useMemorable}
                onCheckedChange={setUseMemorable}
              />
            </div>

            {useMemorable && (
              <div className="space-y-2">
                <Label>Word Count</Label>
                <Slider
                  value={[memorableOptions.wordCount]}
                  onValueChange={([value]) => 
                    setMemorableOptions(prev => ({ ...prev, wordCount: value }))
                  }
                  min={2}
                  max={5}
                  step={1}
                />
                {/* Add other memorable options */}
              </div>
            )}
          </div>

          <Button 
            className="w-full" 
            onClick={handleGeneratePassword}
            size="lg"
          >
            Generate Secure Password
          </Button>
        </div>

        {breachResult?.breached && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>
              This password has been found in {breachResult.count?.toLocaleString()} data breaches
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}