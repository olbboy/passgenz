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

  return (
    <motion.div className="space-y-6">
      {/* Password Display */}
      <motion.div className="relative">
        <div className="flex items-center space-x-4 bg-secondary p-6 rounded-lg shadow-sm group">
          <span className="text-2xl font-mono flex-1 tracking-wider select-all">
            {password || 'Click generate to create password'}
          </span>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={onGenerate}
                    className="hover:bg-primary hover:text-primary-foreground"
                    aria-label="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate new password</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={onCopy}
                    className="hover:bg-primary hover:text-primary-foreground"
                    aria-label="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Strength Indicator - Thêm visual feedback */}
      <div className="relative pt-4">
        <div className="absolute -top-2 left-0 right-0 flex justify-between text-sm font-medium">
          <span className="text-red-500">Weak</span>
          <span className="text-yellow-500">Medium</span>
          <span className="text-green-500">Strong</span>
        </div>
        <Progress 
          value={analysis?.entropy ? Number(analysis.entropy.toFixed(2)) : 0} 
          className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500" 
        />
        <div className="mt-2 text-center text-sm font-medium">
          {analysis?.strength && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                analysis.strength === 'very-strong' && "text-green-500",
                analysis.strength === 'strong' && "text-blue-500",
                analysis.strength === 'medium' && "text-yellow-500",
                analysis.strength === 'weak' && "text-red-500"
              )}
            >
              {analysis.strength.toUpperCase()}
            </motion.span>
          )}
        </div>
      </div>

      {/* Detailed Analysis - Cải thiện layout và visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics && (
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
                          <span className="font-mono">{count}/{password.length}</span>
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
                    {Object.entries(metrics.patterns).map(([pattern, exists]) => (
                      <div key={pattern} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                        {exists ? (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        )}
                        <span className="text-sm">{formatPatternName(pattern)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Recommendations */}
      {metrics && metrics.recommendations?.length > 0 && (
        <motion.div>
          <Alert variant="warning">
            <AlertTitle>Recommendations</AlertTitle>
            <AlertDescription>
              <ul>
                {metrics.recommendations.map((rec, index) => (
                  <motion.li 
                    key={`rec-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Breach Info */}
      {breachResult?.breached && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert variant="destructive" className="bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Password Compromised</AlertTitle>
            <AlertDescription className="flex items-center gap-2">
              <span>Found in {breachResult.count?.toLocaleString()} data breaches</span>
              <Button variant="link" size="sm" className="text-red-500 h-auto p-0">
                Learn More
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
} 