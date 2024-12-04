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
                    prompt: context
                }),
            });

            const data = await res.json();
            
            if (!res.ok || data.error) {
                throw new Error(data.error || 'Failed to analyze context');
            }

            if (!data.rules) {
                throw new Error('No rules returned from AI');
            }

            // Convert AI rules to PasswordRequirements format
            const requirements: PasswordRequirements = {
                platformType: {
                    type: 'general',
                    description: 'Generated from AI analysis'
                },
                passwordRules: {
                    length: {
                        min: data.rules.minLength,
                        max: data.rules.maxLength,
                        description: 'Generated length requirements'
                    },
                    characterRequirements: {
                        requiredCombinations: {
                            count: data.rules.minCharTypesRequired,
                            from: Object.values(data.rules.requiredCharTypes).filter(Boolean).length
                        },
                        allowedCharacterSets: [
                            {
                                type: 'uppercase',
                                characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                                required: data.rules.requiredCharTypes.uppercase,
                                description: 'Uppercase letters (A-Z)'
                            },
                            {
                                type: 'lowercase',
                                characters: 'abcdefghijklmnopqrstuvwxyz',
                                required: data.rules.requiredCharTypes.lowercase,
                                description: 'Lowercase letters (a-z)'
                            },
                            {
                                type: 'number',
                                characters: '0123456789',
                                required: data.rules.requiredCharTypes.numbers,
                                description: 'Numbers (0-9)'
                            },
                            {
                                type: 'symbol',
                                characters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
                                required: data.rules.requiredCharTypes.symbols,
                                description: 'Special characters'
                            }
                        ]
                    },
                    customConstraints: data.rules.excludedChars.length ? [
                        {
                            type: 'excluded-chars',
                            description: 'Excluded characters',
                            parameters: { chars: data.rules.excludedChars }
                        }
                    ] : []
                },
                securityAssessment: {
                    level: 'high',
                    justification: 'Generated from AI analysis',
                    complianceStandards: [],
                    vulnerabilityWarnings: [],
                    securityConsiderations: ['Use unique password for each account'],
                    strengthAssessment: 'Strong password configuration'
                },
                recommendations: {
                    implementation: [],
                    userGuidance: [
                        'Use generated password as is',
                        'Store securely',
                        'Do not share with others'
                    ],
                    securityEnhancements: ['Enable two-factor authentication']
                }
            };

            onAnalyze(requirements);
            toast({
                title: "Success",
                description: "Context analyzed successfully"
            });

        } catch (error) {
            console.error('AI Analysis Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to analyze context"
            });
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