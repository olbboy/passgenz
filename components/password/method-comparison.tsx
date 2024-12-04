export function MethodComparison() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Method Comparison</h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Basic</h4>
          <p className="text-sm text-muted-foreground">
            Standard password generation with customizable options. Best for general use.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">AI Context</h4>
          <p className="text-sm text-muted-foreground">
            Analyzes your requirements and suggests optimal password rules.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Pattern</h4>
          <p className="text-sm text-muted-foreground">
            Create passwords following specific patterns. Ideal for system requirements.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Memorable</h4>
          <p className="text-sm text-muted-foreground">
            Easy to remember but secure passwords using word combinations.
          </p>
        </div>
      </div>
    </div>
  )
} 