"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle, Globe, Settings2, Sparkles, Hash, Brain, Loader2, Wand2, AlertCircle, HelpCircle } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const tabItems = [
    { 
      value: 'basic', 
      icon: <Settings2 className="h-4 w-4" />, 
      label: 'Basic',
      shortLabel: 'Basic' // Short label for mobile
    },
    { 
      value: 'context', 
      icon: <Sparkles className="h-4 w-4" />, 
      label: 'AI Context',
      shortLabel: 'AI' // Shortened for mobile
    },
    { 
      value: 'pattern', 
      icon: <Hash className="h-4 w-4" />, 
      label: 'Pattern',
      shortLabel: 'Pattern'
    },
    { 
      value: 'memorable', 
      icon: <Brain className="h-4 w-4" />, 
      label: 'Memorable',
      shortLabel: 'Memo' // Shortened for mobile
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl sm:text-2xl font-semibold">
          Password Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create strong, secure passwords with custom requirements
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Password Output Component */}
        <PasswordOutput 
          password={password}
          analysis={analysis}
          onGenerate={handleGeneratePassword}
          onCopy={copyToClipboard}
        />

        {/* Options Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Password Length</Label>
              <span className="text-sm font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {length[0]} characters
              </span>
            </div>
            <div className="pt-2">
              <Slider
                value={length}
                onValueChange={setLength}
                min={8}
                max={128}
                step={1}
                className="mt-2"
                defaultValue={[16]}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">8</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Recommended: 16-32
                </span>
                <span className="text-xs text-muted-foreground">128</span>
              </div>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Character Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries({
                uppercase: {
                  label: "Uppercase (A-Z)",
                  description: "Include capital letters"
                },
                lowercase: {
                  label: "Lowercase (a-z)",
                  description: "Include small letters"
                },
                numbers: {
                  label: "Numbers (0-9)",
                  description: "Include digits"
                },
                symbols: {
                  label: "Symbols (!@#$)",
                  description: "Include special characters"
                },
              }).map(([key, { label, description }]) => (
                <div key={key} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Switch
                    id={key}
                    checked={options[key as keyof typeof options]}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, [key]: checked }))
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <Label htmlFor={key} className="text-sm font-medium">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Quantum-Safe</Label>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Enhance password strength with quantum-resistant entropy
              </p>
            </div>
            <Switch
              checked={options.quantumSafe}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({ ...prev, quantumSafe: checked }))
              }
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          className="w-full mt-8 h-12 text-base" 
          size="lg"
          onClick={handleGeneratePassword}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Generating secure password...</span>
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              <span>Generate Strong Password</span>
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