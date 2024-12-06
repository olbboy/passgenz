import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MemorableOptionsProps {
  options: {
    wordCount: number;
    capitalize: boolean;
    includeNumbers: boolean;
    includeSeparators: boolean;
  };
  onChange: (options: MemorableOptionsProps['options']) => void;
}

export function MemorableOptions({ options, onChange }: MemorableOptionsProps) {
  // Preview example based on current options
  const getExample = () => {
    const words = Array(options.wordCount).fill('word');
    const formatted = words.map(word => 
      options.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word
    );
    let result = formatted.join(options.includeSeparators ? '-' : '');
    if (options.includeNumbers) result += '123';
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Word Count Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Number of Words</Label>
          <span className="text-sm font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            {options.wordCount} words
          </span>
        </div>
        <Slider
          value={[options.wordCount]}
          onValueChange={([value]) => 
            onChange({ ...options, wordCount: value })
          }
          min={2}
          max={5}
          step={1}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2 words</span>
          <span>Recommended: 3-4</span>
          <span>5 words</span>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4">
        {[
          {
            id: 'capitalize',
            label: "Capitalize Words",
            description: "Capitalize the first letter of each word",
            value: options.capitalize
          },
          {
            id: 'includeNumbers',
            label: "Add Numbers",
            description: "Append random numbers at the end",
            value: options.includeNumbers
          },
          {
            id: 'includeSeparators',
            label: "Add Separators",
            description: "Add hyphens between words",
            value: options.includeSeparators
          }
        ].map(option => (
          <div 
            key={option.id}
            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Switch
              id={option.id}
              checked={option.value}
              onCheckedChange={(checked) =>
                onChange({ ...options, [option.id]: checked })
              }
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor={option.id} className="text-sm font-medium">
                {option.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Preview Example:</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                This is just an example format. The actual password will use random words.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="p-2 bg-muted rounded-md font-mono text-sm">
          {getExample()}
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-muted/50">
        <AlertDescription className="text-sm text-muted-foreground">
          Memorable passwords use random dictionary words combined with numbers and symbols, making them easier to remember while maintaining security.
        </AlertDescription>
      </Alert>
    </div>
  );
} 