import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Settings2 } from "lucide-react"
import { PasswordRequirements } from "@/lib/context-analyzer"
import { useToast } from "@/components/ui/use-toast"

interface ContextOptionsProps {
    context: string;
    onContextChange: (context: string) => void;
    analyzedContext: PasswordRequirements | null;
    onAnalyze: (requirements: PasswordRequirements) => void;
}

export function ContextOptions({
    context,
    onContextChange,
    analyzedContext,
    onAnalyze
}: ContextOptionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function handleAIAnalysis() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `As a password security expert, analyze the following context and provide password requirements.
Focus on determining the platform type and appropriate security level.

Context: "${context}"

Instructions:
1. Identify the type of platform/service (e.g., banking, social media, email, enterprise)
2. Determine appropriate security requirements based on:
   - Platform sensitivity
   - Data protection needs
   - Industry standards
   - Common attack vectors
3. Consider compliance requirements (e.g., NIST, PCI DSS)
4. Provide practical, implementable requirements

Respond with a JSON object in this exact format:
{
  "platformType": {
    "type": "banking|social|email|enterprise|general",
    "description": "Brief description of service type and security needs"
  },
  "passwordRules": {
    "length": {
      "min": number,
      "max": number | null,
      "description": "Explanation of length requirements"
    },
    "characterRequirements": {
      "requiredCombinations": {
        "count": number,
        "from": number
      },
      "allowedCharacterSets": [
        {
          "type": "uppercase|lowercase|number|symbol",
          "required": boolean,
          "description": "Description of character type requirement"
        }
      ]
    },
    "customConstraints": [
      {
        "type": "excluded-chars|pattern|dictionary",
        "description": "Description of constraint",
        "parameters": { "chars": string[] }
      }
    ]
  },
  "securityAssessment": {
    "level": "low|medium|high|very-high",
    "justification": "Explanation of security level choice",
    "complianceStandards": string[],
    "vulnerabilityWarnings": string[]
  },
  "recommendations": {
    "implementation": string[],
    "userGuidance": string[]
  }
}`
                }),
            });

            const data = await res.json();
            console.log('API Response:', data);

            if (!res.ok || data.error) {
                console.error('API Error:', data.error || 'Unknown error');
                toast({
                    title: "AI Analysis Failed",
                    description: data.error || "Failed to analyze with AI",
                    variant: "destructive",
                });
                return;
            }

            try {
                const aiResponse = JSON.parse(data.response);
                console.log('Parsed AI Response:', aiResponse);

                if (!aiResponse.platformType || !aiResponse.passwordRules) {
                    console.error('Invalid AI response structure');
                    toast({
                        title: "Invalid Response",
                        description: "AI returned invalid data structure",
                        variant: "destructive",
                    });
                    return;
                }

                const requirements: PasswordRequirements = {
                    platformType: {
                        type: aiResponse.platformType.type || 'general',
                        description: aiResponse.platformType.description || 'General purpose password'
                    },
                    passwordRules: {
                        length: {
                            min: aiResponse.passwordRules.length.min || 12,
                            max: aiResponse.passwordRules.length.max,
                            description: aiResponse.passwordRules.length.description || 'Password length requirements'
                        },
                        characterRequirements: {
                            requiredCombinations: {
                                count: aiResponse.passwordRules.characterRequirements.requiredCombinations.count,
                                from: aiResponse.passwordRules.characterRequirements.requiredCombinations.count
                            },
                            allowedCharacterSets: aiResponse.passwordRules.characterRequirements.allowedCharacterSets || [
                                {
                                    type: 'uppercase',
                                    characters: null,
                                    required: true,
                                    description: 'Uppercase letters (A-Z)'
                                },
                                {
                                    type: 'lowercase',
                                    characters: null,
                                    required: true,
                                    description: 'Lowercase letters (a-z)'
                                }
                            ]
                        },
                        historyPolicy: aiResponse.passwordRules.historyPolicy || {
                            enabled: false,
                            preventReuse: null,
                            timeframe: null
                        },
                        customConstraints: aiResponse.passwordRules.customConstraints || []
                    },
                    securityAssessment: {
                        level: aiResponse.securityAssessment.level || 'medium',
                        justification: aiResponse.securityAssessment.justification || '',
                        complianceStandards: aiResponse.securityAssessment.complianceStandards || [],
                        securityConsiderations: aiResponse.securityAssessment.securityConsiderations || [],
                        vulnerabilityWarnings: aiResponse.securityAssessment.vulnerabilityWarnings || [],
                        strengthAssessment: aiResponse.securityAssessment.strengthAssessment || ''
                    },
                    recommendations: {
                        implementation: aiResponse.recommendations.implementation || [],
                        userGuidance: aiResponse.recommendations.userGuidance || [],
                        securityEnhancements: aiResponse.recommendations.securityEnhancements || []
                    }
                };

                toast({
                    title: "Analysis Complete",
                    description: `Analyzed context for ${requirements.platformType.type}`,
                    variant: "default",
                });

                onContextChange(context);
                onAnalyze(requirements);

            } catch (parseError) {
                console.error('Parse Error:', parseError);
                toast({
                    title: "Parse Error",
                    description: "Failed to parse AI response",
                    variant: "destructive",
                });
                return;
            }
        } catch (error) {
            console.error('Network Error:', error);
            toast({
                title: "Network Error",
                description: "Failed to connect to AI service",
                variant: "destructive",
            });
            return;
        } finally {
            setIsLoading(false);
        }
    }

    const handleManualAnalysis = () => {
        const requirements: PasswordRequirements = {
            platformType: {
                type: 'general',
                description: 'General purpose password'
            },
            passwordRules: {
                length: {
                    min: 10,
                    max: null,
                    description: 'Minimum 10 characters'
                },
                characterRequirements: {
                    requiredCombinations: {
                        count: 3,
                        from: 4
                    },
                    allowedCharacterSets: [
                        {
                            type: 'uppercase',
                            characters: null,
                            required: true,
                            description: 'Uppercase letters (A-Z)'
                        },
                        {
                            type: 'lowercase',
                            characters: null,
                            required: true,
                            description: 'Lowercase letters (a-z)'
                        },
                        {
                            type: 'number',
                            characters: null,
                            required: true,
                            description: 'Numbers (0-9)'
                        },
                        {
                            type: 'symbol',
                            characters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
                            required: true,
                            description: 'Special characters'
                        }
                    ]
                },
                historyPolicy: {
                    enabled: false,
                    preventReuse: null,
                    timeframe: null
                },
                customConstraints: []
            },
            securityAssessment: {
                level: 'high',
                justification: 'Follows security best practices',
                complianceStandards: ['NIST SP 800-63B'],
                securityConsiderations: ['Use unique password for each account'],
                vulnerabilityWarnings: [],
                strengthAssessment: 'Strong password configuration'
            },
            recommendations: {
                implementation: ['Implement password strength meter'],
                userGuidance: ['Use a password manager'],
                securityEnhancements: ['Enable two-factor authentication']
            }
        };

        toast({
            title: "Manual Analysis",
            description: "Using standard security requirements",
            variant: "default",
        });

        onAnalyze(requirements);
    };

    const ManualAnalysisButton = () => (
        <Button
            size="icon"
            variant="ghost"
            onClick={handleManualAnalysis}
            title="Manual Analysis"
        >
            <Settings2 className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Textarea
                    placeholder="Describe the platform or service you need a password for (e.g., online banking, social media, work system)..."
                    value={context}
                    onChange={(e) => onContextChange(e.target.value)}
                    rows={5}
                    className="pr-20"
                />
                <div className="absolute right-2 top-2 space-x-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleAIAnalysis}
                        disabled={isLoading}
                        title="AI Context Analysis"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                    </Button>
                    <ManualAnalysisButton />
                </div>
            </div>

            {analyzedContext && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">Analyzed Requirements:</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium">Platform Information</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Type: {analyzedContext.platformType.type}</li>
                                <li>• Description: {analyzedContext.platformType.description}</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Password Rules</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Length: {analyzedContext.passwordRules.length.min}-{analyzedContext.passwordRules.length.max || 'unlimited'} characters</li>
                                <li>• Required Character Types: {analyzedContext.passwordRules.characterRequirements.requiredCombinations.count || 'Any'} from {analyzedContext.passwordRules.characterRequirements.requiredCombinations.from || 'available types'}</li>
                                <li>• Character Sets:</li>
                                <ul className="ml-4 mt-1">
                                    {analyzedContext.passwordRules.characterRequirements.allowedCharacterSets.map((set, index) => (
                                        <li key={index}>
                                            - {set.type} {set.required ? '(Required)' : '(Optional)'}: {set.description}
                                        </li>
                                    ))}
                                </ul>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Security Assessment</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Level: {analyzedContext.securityAssessment.level}</li>
                                <li>• Justification: {analyzedContext.securityAssessment.justification}</li>
                                {analyzedContext.securityAssessment.complianceStandards.length > 0 && (
                                    <li>• Compliance: {analyzedContext.securityAssessment.complianceStandards.join(', ')}</li>
                                )}
                                {analyzedContext.securityAssessment.vulnerabilityWarnings.length > 0 && (
                                    <li className="text-destructive">• Warnings: {analyzedContext.securityAssessment.vulnerabilityWarnings.join('; ')}</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Recommendations</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Implementation:</li>
                                <ul className="ml-4">
                                    {analyzedContext.recommendations.implementation.map((rec, index) => (
                                        <li key={index}>- {rec}</li>
                                    ))}
                                </ul>
                                <li>• User Guidance:</li>
                                <ul className="ml-4">
                                    {analyzedContext.recommendations.userGuidance.map((guide, index) => (
                                        <li key={index}>- {guide}</li>
                                    ))}
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 