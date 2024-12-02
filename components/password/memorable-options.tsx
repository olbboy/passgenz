import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface MemorableOptions {
  wordCount: number;
  capitalize: boolean;
  includeNumbers: boolean;
  includeSeparators: boolean;
}

interface MemorableOptionsProps {
  options: MemorableOptions;
  onChange: (options: MemorableOptions) => void;
}

export function MemorableOptions({ options, onChange }: MemorableOptionsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Word Count</Label>
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="capitalize">Capitalize Words</Label>
          <Switch
            id="capitalize"
            checked={options.capitalize}
            onCheckedChange={(checked) =>
              onChange({ ...options, capitalize: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="numbers">Include Numbers</Label>
          <Switch
            id="numbers"
            checked={options.includeNumbers}
            onCheckedChange={(checked) =>
              onChange({ ...options, includeNumbers: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="separators">Include Separators</Label>
          <Switch
            id="separators"
            checked={options.includeSeparators}
            onCheckedChange={(checked) =>
              onChange({ ...options, includeSeparators: checked })
            }
          />
        </div>
      </div>
    </div>
  );
} 