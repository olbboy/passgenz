import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PatternOptionsProps {
  pattern: string;
  onChange: (pattern: string) => void;
}

export function PatternOptions({ pattern, onChange }: PatternOptionsProps) {
  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-2">
              <Label>Pattern Template</Label>
              <Input
                value={pattern}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Example: Llddss"
                className="font-mono"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="space-y-2 p-4 max-w-xs">
            <p className="font-medium">Pattern Guide:</p>
            <ul className="text-sm space-y-1">
              <li><code>L</code> - Uppercase letter</li>
              <li><code>l</code> - Lowercase letter</li>
              <li><code>d</code> - Digit</li>
              <li><code>s</code> - Special character</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 