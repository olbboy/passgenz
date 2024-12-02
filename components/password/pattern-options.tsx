import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PatternOptionsProps {
  pattern: string;
  onChange: (pattern: string) => void;
}

export function PatternOptions({ pattern, onChange }: PatternOptionsProps) {
  return (
    <div className="space-y-2">
      <Label>Pattern (L=uppercase, l=lowercase, d=digit, s=symbol)</Label>
      <Input
        value={pattern}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Llddss"
      />
    </div>
  );
} 