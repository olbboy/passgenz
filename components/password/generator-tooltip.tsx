interface GeneratorTooltipProps {
  tab: 'basic' | 'context' | 'pattern' | 'memorable';
}

export function GeneratorTooltip({ tab }: GeneratorTooltipProps) {
  switch (tab) {
    case 'basic':
      return (
        <>
          <h4 className="font-medium">Basic Password Generator</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Customize length and character types</li>
            <li>Include uppercase, lowercase, numbers, symbols</li>
            <li>Generate strong random passwords</li>
            <li>Copy password with one click</li>
            <li>Check password strength instantly</li>
          </ul>
        </>
      );
    case 'context':
      return (
        <>
          <h4 className="font-medium">Context-Aware Generator</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>AI-powered password analysis</li>
            <li>Platform-specific requirements</li>
            <li>Security best practices compliance</li>
            <li>Custom constraints handling</li>
            <li>Automated security assessment</li>
          </ul>
        </>
      );
    case 'pattern':
      return (
        <>
          <h4 className="font-medium">Pattern-Based Generator</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Create custom password patterns</li>
            <li>Define character positions</li>
            <li>Mix static and random elements</li>
            <li>Save and reuse patterns</li>
            <li>Pattern validation checks</li>
          </ul>
        </>
      );
    case 'memorable':
      return (
        <>
          <h4 className="font-medium">Memorable Password Generator</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Generate easy-to-remember passwords</li>
            <li>Word-based combinations</li>
            <li>Custom word separators</li>
            <li>Add numbers and symbols</li>
            <li>Balance security and memorability</li>
          </ul>
        </>
      );
    default:
      return null;
  }
} 