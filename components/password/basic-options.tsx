import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PasswordOptions } from "@/lib/types"

interface BasicOptionsProps {
  options: PasswordOptions;
  onChange: (options: PasswordOptions) => void;
  length: number[];
  onLengthChange: (length: number[]) => void;
}

export function BasicOptions({ options, onChange, length, onLengthChange }: BasicOptionsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Password Length: {length}</Label>
        <Slider
          value={length}
          onValueChange={onLengthChange}
          min={8}
          max={128}
          step={1}
          className="mt-2"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="uppercase">Uppercase Letters</Label>
          <Switch
            id="uppercase"
            checked={options.uppercase}
            onCheckedChange={(checked) =>
              onChange({ ...options, uppercase: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="lowercase">Lowercase Letters</Label>
          <Switch
            id="lowercase"
            checked={options.lowercase}
            onCheckedChange={(checked) =>
              onChange({ ...options, lowercase: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="numbers">Numbers</Label>
          <Switch
            id="numbers"
            checked={options.numbers}
            onCheckedChange={(checked) =>
              onChange({ ...options, numbers: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="symbols">Special Characters</Label>
          <Switch
            id="symbols"
            checked={options.symbols}
            onCheckedChange={(checked) =>
              onChange({ ...options, symbols: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="quantumSafe">Quantum-Safe Generation</Label>
          <Switch
            id="quantumSafe"
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