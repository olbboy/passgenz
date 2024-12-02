"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle, Globe, Settings2, Sparkles, Hash, Brain, Loader2, Wand2, AlertCircle } from 'lucide-react'
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
import { Textarea } from "@/components/ui/textarea"
import { PasswordOutput } from "./password/password-output"
import { BasicOptions } from "./password/basic-options"
import { ContextOptions } from "./password/context-options"
import { PatternOptions } from "./password/pattern-options"
import { MemorableOptions } from "./password/memorable-options"
import { analyzePassword } from "./password/password-output"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  memorable: boolean
  quantumSafe: boolean
}

type GenerationMode = 'basic' | 'context' | 'pattern' | 'memorable';

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
  const [mode, setMode] = useState<GenerationMode>('basic');
  const [context, setContext] = useState('');
  const [analyzedContext, setAnalyzedContext] = useState<PasswordRequirements | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!context) return;
    
    const requirements = contextAnalyzer.analyzeFromText(context);
    setAnalyzedContext(requirements);
    
    // Update options based on requirements
    setLength([requirements.minLength]);
    setOptions(prev => ({
      ...prev,
      uppercase: requirements.requiredChars.includes('uppercase'),
      lowercase: requirements.requiredChars.includes('lowercase'),
      numbers: requirements.requiredChars.includes('number'),
      symbols: requirements.requiredChars.includes('symbol')
    }));
  }, [context]);

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
      setIsGenerating(true);
      setError(null);
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
      const metrics = analyzePassword(result.password);

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
            breachCount: breach.count,
            characterDistribution: metrics.characterDistribution,
            patterns: metrics.patterns,
            recommendations: metrics.recommendations
          },
          context: serviceUrl || undefined,
          tags: ['generated']
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate password');
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } finally {
      setIsGenerating(false);
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

  const handleModeChange = (newMode: GenerationMode) => {
    // Reset state
    setMode(newMode);
    setPassword('');
    setAnalysis(null);
    setBreachResult(null);
    
    // Reset mode-specific state
    switch (newMode) {
      case 'basic':
        setOptions({
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: true,
          memorable: false,
          quantumSafe: true
        });
        setLength([16]);
        break;
        
      case 'context':
        setContext('');
        setAnalyzedContext(null);
        break;
        
      case 'pattern':
        setPattern('');
        break;
        
      case 'memorable':
        setMemorableOptions({
          wordCount: 3,
          capitalize: true,
          includeNumbers: true,
          includeSeparators: true
        });
        break;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'g':
            e.preventDefault();
            handleGeneratePassword();
            break;
          case 'c':
            e.preventDefault();
            if (password) copyToClipboard();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [password]);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Password Generator</CardTitle>
          <Tabs 
            value={mode} 
            onValueChange={(value) => handleModeChange(value as GenerationMode)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 p-1 bg-muted rounded-lg">
              {[
                { value: 'basic', icon: <Settings2 className="h-4 w-4" />, label: 'Basic' },
                { value: 'context', icon: <Sparkles className="h-4 w-4" />, label: 'AI Context' },
                { value: 'pattern', icon: <Hash className="h-4 w-4" />, label: 'Pattern' },
                { value: 'memorable', icon: <Brain className="h-4 w-4" />, label: 'Memorable' }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    "hover:bg-background/50"
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {/* Password Output Section */}
        <PasswordOutput 
          password={password}
          analysis={analysis}
          onGenerate={handleGeneratePassword}
          onCopy={copyToClipboard}
        />

        {/* Generation Options */}
        {mode === 'basic' && (
          <BasicOptions 
            options={options}
            onChange={setOptions}
            length={length}
            onLengthChange={setLength}
          />
        )}

        {mode === 'context' && (
          <ContextOptions 
            context={context}
            onContextChange={setContext}
            analyzedContext={analyzedContext}
            onAnalyze={handleContextAnalysis}
          />
        )}

        {mode === 'pattern' && (
          <PatternOptions 
            pattern={pattern}
            onChange={setPattern}
          />
        )}

        {mode === 'memorable' && (
          <MemorableOptions 
            options={memorableOptions}
            onChange={setMemorableOptions}
          />
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          className="w-full mt-6" 
          size="lg"
          onClick={handleGeneratePassword}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Password
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}