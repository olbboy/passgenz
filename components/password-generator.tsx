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
import { PasswordAnalysis, GeneratorConfig, GenerationResult, PasswordMetadata, HistoryMetadata } from '@/lib/types'
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
import { PasswordRules } from '@/lib/types';

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

  const handleContextAnalysis = useCallback((requirements: PasswordRequirements) => {
    // Cập nhật độ dài dựa trên yêu cầu mới
    setLength([requirements.passwordRules.length.min]);

    // Cập nhật các tùy chọn dựa trên yêu cầu ký tự
    setOptions(prev => ({
      ...prev,
      uppercase: requirements.passwordRules.characterRequirements.allowedCharacterSets
        .some(set => set.type === 'uppercase' && set.required),
      lowercase: requirements.passwordRules.characterRequirements.allowedCharacterSets
        .some(set => set.type === 'lowercase' && set.required),
      numbers: requirements.passwordRules.characterRequirements.allowedCharacterSets
        .some(set => set.type === 'number' && set.required),
      symbols: requirements.passwordRules.characterRequirements.allowedCharacterSets
        .some(set => set.type === 'symbol' && set.required)
    }));

    setAnalyzedContext(requirements);
  }, []);

  const validatePasswordForService = useCallback((password: string) => {
    if (!serviceUrl) return true;
    
    const context = contextAnalyzer.analyzeContext(serviceUrl);
    const requirements = contextAnalyzer.suggestRequirements(context);

    // Kiểm tra độ dài
    const meetsLength = password.length >= requirements.passwordRules.length.min;

    // Kiểm tra các ký tự bắt buộc
    const hasRequiredChars = requirements.passwordRules.characterRequirements.allowedCharacterSets
      .filter(set => set.required)
      .every(set => {
        switch (set.type) {
          case 'uppercase': return /[A-Z]/.test(password);
          case 'lowercase': return /[a-z]/.test(password);
          case 'number': return /\d/.test(password);
          case 'symbol': return /[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(password);
          default: return true;
        }
      });

    // Kiểm tra các ký tự bị cấm
    const noExcludedChars = !requirements.passwordRules.customConstraints
      .filter(constraint => constraint.type === 'excluded-chars')
      .some(constraint => 
        constraint.parameters.chars.some((char: string) => password.includes(char))
      );

    return meetsLength && hasRequiredChars && noExcludedChars;
  }, [serviceUrl]);

  const handleGeneratePassword = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      let result: GenerationResult | undefined;

      if (mode === 'context' && analyzedContext) {
        try {
          // Get password rules from AI analysis
          const res = await fetch('/api/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requirements: analyzedContext })
          });

          const data = await res.json();
          console.log('API Response:', data);
          
          if (!res.ok || data.error) {
            console.error('API Error:', data.error);
            throw new Error(data.error || 'Failed to generate rules');
          }

          // Use rules to generate password
          const rules = data.rules;
          console.log('Generated Rules:', rules);

          // Map rules to options
          const contextOptions: PasswordOptions = {
            uppercase: true,  // Always enable all character types
            lowercase: true,  // and let validatePasswordAgainstRules
            numbers: true,    // handle the validation
            symbols: true,
            memorable: !rules.patterns.allowCommonWords,
            quantumSafe: analyzedContext.securityAssessment.level === 'very-high'
          };

          let attempts = 0;
          const maxAttempts = 10;
          let validPassword = false;
          
          while (attempts < maxAttempts && !validPassword) {
            // Generate base password
            const generated = await generatePassword(
              Math.max(rules.minLength, 12), // Tăng độ dài tối thiểu
              contextOptions
            );

            // Ensure required character types
            let enhancedPassword = generated.password;
            if (!/[A-Z]/.test(enhancedPassword) && rules.requiredCharTypes.uppercase) {
              enhancedPassword = 'A' + enhancedPassword.slice(1);
            }
            if (!/[a-z]/.test(enhancedPassword) && rules.requiredCharTypes.lowercase) {
              enhancedPassword = enhancedPassword.slice(0, -1) + 'a';
            }
            if (!/[0-9]/.test(enhancedPassword) && rules.requiredCharTypes.numbers) {
              enhancedPassword = enhancedPassword.slice(0, -2) + '1';
            }
            if (!/[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(enhancedPassword) && rules.requiredCharTypes.symbols) {
              enhancedPassword = enhancedPassword.slice(0, -3) + '@';
            }

            // Validate enhanced password
            const isValid = validatePasswordAgainstRules(enhancedPassword, rules);
            if (isValid) {
              result = {
                password: enhancedPassword,
                analysis: {
                  ...generated.analysis,
                  breached: false,
                  level: analyzedContext.securityAssessment.level,
                  recommendations: [
                    ...analyzedContext.recommendations.implementation,
                    ...analyzedContext.recommendations.userGuidance
                  ]
                }
              };
              validPassword = true;
            }
            attempts++;
          }

          if (!validPassword) {
            throw new Error("Could not generate password meeting all requirements");
          }

        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Failed to generate password");
        }
      } else if (usePattern && pattern) {
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
            weaknesses: [],
            breached: false
          }
        } as GenerationResult;
      } else if (useMemorable) {
        const generated = memorableGenerator.generateMemorable(memorableOptions);
        const baseResult = await generatePassword(generated.length, options);
        result = {
          password: generated,
          analysis: {
            ...baseResult.analysis,
            breached: false
          }
        } as GenerationResult;
      } else {
        const generated = await generatePassword(length[0], options);
        result = {
          password: generated.password,
          analysis: {
            ...generated.analysis,
            breached: false
          }
        } as GenerationResult;
      }

      if (result) {
        setPassword(result.password);
        setAnalysis(result.analysis);

        // Check breach database
        const breach = await breachDb.checkPassword(result.password);
        setBreachResult(breach);

        // Convert pattern warnings to structured format
        const patternWarnings = convertPatternWarnings(result.analysis.weaknesses);

        // Create history entry
        const historyEntry: HistoryMetadata = {
          strength: result.analysis.entropy,
          analysis: {
            entropy: result.analysis.entropy,
            timeToCrack: result.analysis.timeToCrack,
            weaknesses: result.analysis.weaknesses,
            breached: breach.breached,
            breachCount: breach.count,
            characterDistribution: result.analysis.characterDistribution,
            patterns: patternWarnings,  // Use converted pattern warnings
            recommendations: result.analysis.recommendations || []
          },
          context: mode === 'context' ? JSON.stringify(analyzedContext) : undefined,
          tags: []
        };

        // Add to history
        await historyService.addEntry({
          value: result.password,
          feature: 'password',
          metadata: historyEntry
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate password');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to generate password',
      });
    } finally {
      setIsGenerating(false);
    }
  };

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

// Helper function to validate password against analyzed context
function validatePasswordAgainstContext(password: string, context: PasswordRequirements): boolean {
    // Kiểm tra độ dài
    if (password.length < context.passwordRules.length.min) return false;
    if (context.passwordRules.length.max && password.length > context.passwordRules.length.max) return false;

    // Đếm số loại ký tự được sử dụng
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(password);

    // Kiểm tra các yêu cầu bắt buộc
    const requiredSets = context.passwordRules.characterRequirements.allowedCharacterSets
        .filter(set => set.required);

    for (const set of requiredSets) {
        switch (set.type) {
            case 'uppercase':
                if (!hasUppercase) return false;
                break;
            case 'lowercase':
                if (!hasLowercase) return false;
                break;
            case 'number':
                if (!hasNumbers) return false;
                break;
            case 'symbol':
                if (!hasSymbols) return false;
                break;
        }
    }

    // Kiểm tra số lượng loại ký tự tối thiểu
    const { count: requiredCount } = context.passwordRules.characterRequirements.requiredCombinations;
    if (requiredCount) {
        const usedTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols]
            .filter(Boolean).length;
        if (usedTypes < requiredCount) return false;
    }

    // Kiểm tra các ràng buộc tùy chỉnh
    for (const constraint of context.passwordRules.customConstraints) {
        if (constraint.type === 'excluded-chars' && constraint.parameters.chars) {
            for (const char of constraint.parameters.chars) {
                if (password.includes(char)) return false;
            }
        }
    }

    return true;
}

// Helper function to validate password against rules
function validatePasswordAgainstRules(password: string, rules: PasswordRules): boolean {
  // Length check
  if (password.length < rules.minLength) {
    console.log('Failed length check');
    return false;
  }
  if (rules.maxLength && password.length > rules.maxLength) {
    console.log('Failed max length check');
    return false;
  }

  // Character types check
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(password);

  let charTypesUsed = 0;
  if (rules.requiredCharTypes.uppercase && hasUppercase) charTypesUsed++;
  if (rules.requiredCharTypes.lowercase && hasLowercase) charTypesUsed++;
  if (rules.requiredCharTypes.numbers && hasNumbers) charTypesUsed++;
  if (rules.requiredCharTypes.symbols && hasSymbols) charTypesUsed++;

  if (charTypesUsed < rules.minCharTypesRequired) {
    console.log('Failed character types check', {
      required: rules.minCharTypesRequired,
      used: charTypesUsed
    });
    return false;
  }

  // Pattern checks
  if (!rules.patterns.allowCommonWords && /\b[a-z]{4,}\b/i.test(password)) {
    console.log('Failed common words check');
    return false;
  }
  if (!rules.patterns.allowKeyboardPatterns && /qwerty|asdf|zxcv/i.test(password)) {
    console.log('Failed keyboard patterns check');
    return false;
  }
  if (!rules.patterns.allowRepeatingChars && /(.)\1{2,}/.test(password)) {
    console.log('Failed repeating chars check');
    return false;
  }
  if (!rules.patterns.allowSequentialChars && /123|abc/i.test(password)) {
    console.log('Failed sequential chars check');
    return false;
  }

  // Excluded chars check
  for (const char of rules.excludedChars) {
    if (password.includes(char)) {
      console.log('Failed excluded chars check:', char);
      return false;
    }
  }

  return true;
}

// Helper function to convert pattern warnings to structured format
function convertPatternWarnings(warnings: string[]): {
  hasCommonWords: boolean;
  hasKeyboardPatterns: boolean;
  hasRepeatingChars: boolean;
  hasSequentialChars: boolean;
} {
  return {
    hasCommonWords: warnings.some(w => w.toLowerCase().includes('common word')),
    hasKeyboardPatterns: warnings.some(w => w.toLowerCase().includes('keyboard pattern')),
    hasRepeatingChars: warnings.some(w => w.toLowerCase().includes('repeating')),
    hasSequentialChars: warnings.some(w => w.toLowerCase().includes('sequential'))
  };
}