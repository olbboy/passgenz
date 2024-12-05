"use client"

import { useTranslations } from 'next-intl';
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PasswordOptions } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BasicOptionsProps {
  options: PasswordOptions;
  onChange: (options: PasswordOptions) => void;
  length: number[];
  onLengthChange: (length: number[]) => void;
}

export function BasicOptionsV2({ options, onChange, length, onLengthChange }: BasicOptionsProps) {
  const t = useTranslations('Components.PasswordGenerator.basic');
  
  return (
    <div className="space-y-8">
      {/* Options Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Length Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">{t('length.label')}</Label>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              {length[0]} {t('length.characters')}
            </span>
          </div>
          <div className="pt-2">
            <Slider
              value={length}
              onValueChange={onLengthChange}
              min={8}
              max={128}
              step={1}
              className="mt-2"
              defaultValue={[16]}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">8</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {t('length.recommended')}
              </span>
              <span className="text-xs text-muted-foreground">128</span>
            </div>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">{t('characterTypes.label')}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries({
              uppercase: {
                label: t('characterTypes.uppercase.label'),
                description: t('characterTypes.uppercase.description')
              },
              lowercase: {
                label: t('characterTypes.lowercase.label'),
                description: t('characterTypes.lowercase.description')
              },
              numbers: {
                label: t('characterTypes.numbers.label'),
                description: t('characterTypes.numbers.description')
              },
              symbols: {
                label: t('characterTypes.symbols.label'),
                description: t('characterTypes.symbols.description')
              },
            }).map(([key, { label, description }]) => (
              <div key={key} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Switch
                  id={key}
                  checked={options[key as keyof typeof options]}
                  onCheckedChange={(checked) =>
                    onChange({ ...options, [key]: checked })
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
            <Label className="text-sm font-medium">{t('advanced.quantumSafe.label')}</Label>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              {t('advanced.quantumSafe.description')}
            </p>
          </div>
          <Switch
            checked={options.quantumSafe}
            onCheckedChange={(checked) =>
              onChange({ ...options, quantumSafe: checked })
            }
          />
        </div>
      </div>
    </div>
  );
} 