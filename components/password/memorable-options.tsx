import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Components.PasswordGenerator.memorable');

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
          <Label className="text-sm font-medium">{t('wordCountLabel')}</Label>
          <span className="text-sm font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            {options.wordCount} {t('wordCount')}
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
          <span>2 {t('words')}</span>
          <span>{t('recommended')}: 3-4</span>
          <span>5 {t('words')}</span>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4">
        {[
          {
            id: 'capitalize',
            label: t('capitalizeLabel'),
            description: t('capitalizeDescription'),
            value: options.capitalize
          },
          {
            id: 'includeNumbers',
            label: t('includeNumbersLabel'),
            description: t('includeNumbersDescription'),
            value: options.includeNumbers
          },
          {
            id: 'includeSeparators',
            label: t('includeSeparatorsLabel'),
            description: t('includeSeparatorsDescription'),
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
          <Label className="text-sm text-muted-foreground">{t('preview')}:</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                {t('previewTooltip')}
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
          {t('infoAlert')}
        </AlertDescription>
      </Alert>
    </div>
  );
} 