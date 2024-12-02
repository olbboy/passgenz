import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { PasswordRequirements } from "@/lib/context-analyzer"

interface ContextOptionsProps {
  context: string;
  onContextChange: (context: string) => void;
  analyzedContext: PasswordRequirements | null;
  onAnalyze: () => void;
}

export function ContextOptions({ 
  context, 
  onContextChange, 
  analyzedContext,
  onAnalyze 
}: ContextOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe your password requirements..."
          value={context}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onContextChange(e.target.value)}
          rows={5}
          className="pr-10"
        />
        <Button
          size="icon"
          variant="ghost" 
          className="absolute right-2 top-2"
          onClick={onAnalyze}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      {analyzedContext && (
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h3 className="font-medium">Analyzed Requirements:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Minimum length: {analyzedContext.minLength} characters</li>
            <li>• Required characters: {analyzedContext.requiredChars.join(', ')}</li>
            <li>• Security level: {analyzedContext.securityLevel}</li>
            {analyzedContext?.excludedChars && analyzedContext.excludedChars.length > 0 && (
              <li>• Excluded characters: {analyzedContext.excludedChars.join(' ')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 