import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
    </div>
  );
} 