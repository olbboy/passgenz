import { PasswordRequirements } from "@/lib/types";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface SecurityAnalysisProps {
  analysis: PasswordRequirements;
}

export function SecurityAnalysis({ analysis }: SecurityAnalysisProps) {
  const securityLevelColor = {
    'low': 'text-yellow-500',
    'medium': 'text-blue-500',
    'high': 'text-green-500',
    'very-high': 'text-purple-500'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className={securityLevelColor[analysis.securityAssessment.level]} />
        <h3 className="font-medium">
          {analysis.platformType.type.toUpperCase()} Platform Security Analysis
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Password Requirements</h4>
          <ul className="space-y-1 text-sm">
            {/* Length Requirements */}
            <li className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Length: {analysis.passwordRules.length.min}-
              {analysis.passwordRules.length.max || '∞'} characters
            </li>
            
            {/* Character Requirements */}
            {analysis.passwordRules.characterRequirements.allowedCharacterSets
              .filter((set: { required: boolean }) => set.required)
              .map((set: { type: string; description: string }, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {set.description}
                </li>
              ))
            }
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Security Considerations</h4>
          <ul className="space-y-1 text-sm">
            {/* Compliance Standards */}
            {analysis.securityAssessment.complianceStandards.map((standard: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                {standard}
              </li>
            ))}
            
            {/* Vulnerability Warnings */}
            {analysis.securityAssessment.vulnerabilityWarnings.map((warning, i) => (
              <li key={i} className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Recommendations</h4>
        <ul className="space-y-1 text-sm">
          {analysis.recommendations.userGuidance.map((guide, i) => (
            <li key={i} className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              {guide}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 