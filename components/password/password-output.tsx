import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, AlertTriangle, BarChart2, ShieldCheck, Lightbulb } from "lucide-react"
import { PasswordAnalysis } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { XCircle, CheckCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PasswordOutputProps {
  password: string;
  analysis: PasswordAnalysis | null;
  onGenerate: () => void;
  onCopy: () => void;
  breachResult?: {
    breached: boolean;
    count?: number;
  } | null;
}

interface PasswordAnalysisDisplay {
  password: string;
  analysis: PasswordAnalysis;
  breachResult?: {
    breached: boolean;
    count?: number;
    lastBreachDate?: Date;
  };
  metrics: {
    characterDistribution: {
      uppercase: number;
      lowercase: number;
      numbers: number;
      symbols: number;
    };
    patterns: {
      hasCommonWords: boolean;
      hasKeyboardPatterns: boolean;
      hasRepeatingChars: boolean;
      hasSequentialChars: boolean;
    };
    recommendations: string[];
  };
}

// Helper function
function formatPatternName(pattern: string): string {
  return pattern
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
}

// Analyze password metrics
export function analyzePassword(password: string): PasswordAnalysisDisplay['metrics'] {
  const distribution = {
    uppercase: (password.match(/[A-Z]/g) || []).length,
    lowercase: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9]/g) || []).length,
  };

  const patterns = {
    hasCommonWords: /password|123456|qwerty/i.test(password),
    hasKeyboardPatterns: /qwerty|asdfgh/i.test(password),
    hasRepeatingChars: /(.)\1{2,}/.test(password),
    hasSequentialChars: /(abc|bcd|cde|def|efg|123|234|345)/i.test(password),
  };

  const recommendations = [];
  if (password.length < 12) recommendations.push("Increase password length to at least 12 characters");
  if (!distribution.uppercase) recommendations.push("Add uppercase letters");
  if (!distribution.symbols) recommendations.push("Add special characters");
  if (patterns.hasCommonWords) recommendations.push("Avoid common words");
  if (patterns.hasKeyboardPatterns) recommendations.push("Avoid keyboard patterns");

  return {
    characterDistribution: distribution,
    patterns,
    recommendations
  };
}

export function PasswordOutput({ 
  password, 
  analysis, 
  onGenerate, 
  onCopy,
  breachResult 
}: PasswordOutputProps) {
  const metrics = password ? analyzePassword(password) : null;

  // Recommendations section with type safety
  const hasRecommendations = metrics?.recommendations && metrics.recommendations.length > 0;

  return (
    <motion.div className="space-y-6">
      {/* Password Display */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 bg-secondary/80 backdrop-blur-sm p-6 rounded-lg shadow-sm group hover:shadow-md transition-all duration-300">
          <span className={cn(
            "text-xl sm:text-2xl font-mono flex-1 tracking-wider select-all break-all",
            !password && "text-muted-foreground text-lg sm:text-xl"
          )}>
            {password || "Click generate to create password"}
          </span>
          <div className="flex gap-2 shrink-0">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={onGenerate}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Generate new password (Ctrl/⌘ + G)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={onCopy}
                    disabled={!password}
                    className={cn(
                      "hover:bg-primary hover:text-primary-foreground transition-colors",
                      !password && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Copy to clipboard (Ctrl/⌘ + C)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Strength Indicator */}
      {password && (
        <motion.div 
          className="relative pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Weak</span>
            <span>Medium</span>
            <span>Strong</span>
          </div>
          <Progress 
            value={analysis?.entropy ? Math.min(Number(analysis.entropy.toFixed(2)), 100) : 0} 
            className={cn(
              "h-3 rounded-full transition-all duration-500",
              analysis?.strength === 'very-strong' && "bg-gradient-to-r from-green-500 to-emerald-500",
              analysis?.strength === 'strong' && "bg-gradient-to-r from-blue-500 to-cyan-500",
              analysis?.strength === 'medium' && "bg-gradient-to-r from-yellow-500 to-orange-500",
              analysis?.strength === 'weak' && "bg-gradient-to-r from-red-500 to-rose-500"
            )}
          />
          <div className="mt-2 text-center text-sm font-medium">
            {analysis?.strength && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  analysis.strength === 'very-strong' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                  analysis.strength === 'strong' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                  analysis.strength === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                  analysis.strength === 'weak' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                )}>
                  {analysis.strength.toUpperCase()}
                </span>
                {analysis.timeToCrack && (
                  <span className="text-xs text-muted-foreground">
                    {analysis.timeToCrack}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Distribution and Security Checks */}
      {metrics && password && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {/* Character Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(metrics.characterDistribution).map(([type, count]) => (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{type}</span>
                          <span className="font-mono">{count}/{password.length} characters</span>
                        </div>
                        <div className="relative h-2">
                          <div className="absolute inset-0 bg-secondary rounded-full" />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count/password.length) * 100}%` }}
                            className="absolute inset-0 bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Checks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Security Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(metrics.patterns).map(([pattern, found]) => (
                      <div key={pattern} className="flex items-center justify-between">
                        <span className="text-sm">{formatPatternName(pattern)}</span>
                        {found ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Breach Check Alert */}
      {breachResult?.breached && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Password Compromised</AlertTitle>
          <AlertDescription>
            Found in {breachResult.count} data breaches
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {hasRecommendations && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {metrics.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
} 