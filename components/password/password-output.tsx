import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, AlertTriangle } from "lucide-react"
import { PasswordAnalysis } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { XCircle, CheckCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"

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
function analyzePassword(password: string): PasswordAnalysisDisplay['metrics'] {
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
      <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
        <span className="text-xl font-mono flex-1">
          {password || 'Click generate'}
        </span>
        <Button variant="outline" size="icon" onClick={onGenerate}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      {/* Strength Indicator */}
      <div className="relative pt-2">
        <div className="absolute -top-2 left-0 right-0 flex justify-between">
          <span className="text-xs">Weak</span>
          <span className="text-xs">Strong</span>
        </div>
        <Progress 
          value={analysis?.entropy ? Number(analysis.entropy.toFixed(2)) : 0} 
          className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics && (
          <>
            {/* Character Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Character Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.characterDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count/password.length) * 100} className="w-24 h-2" />
                        <span className="text-xs w-4">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Checks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Security Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.patterns).map(([pattern, exists]) => (
                    <div key={pattern} className="flex items-center gap-2">
                      {exists ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">{formatPatternName(pattern)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {metrics.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-1">
                    {metrics.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Breach Info */}
      {breachResult?.breached && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Password Compromised</AlertTitle>
          <AlertDescription>
            Found in {breachResult.count?.toLocaleString()} data breaches
            {breachResult.lastBreachDate && 
              `. Last breach: ${format(breachResult.lastBreachDate, 'PP')}`
            }
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
} 