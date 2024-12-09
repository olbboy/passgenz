"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Settings2 } from "lucide-react"
import { PasswordRequirements } from "@/lib/context-analyzer"
import { useToast } from "@/components/ui/use-toast"
import { AllowedCharacterSet } from "@/lib/types"
import { useAIProviderStore } from '@/lib/stores/ai-provider-store'
import { useAPIKeysStore } from '@/lib/stores/api-keys-store'
import { useRouter } from 'next/navigation'

interface ContextOptionsProps {
    context: string;
    onContextChange: (context: string) => void;
    analyzedContext: PasswordRequirements | null;
    onAnalyze: (requirements: PasswordRequirements) => void;
}

// Default character sets
const defaultCharacterSets: AllowedCharacterSet[] = [
    {
        type: 'uppercase',
        required: true,
        description: 'Uppercase letters (A-Z)',
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    {
        type: 'lowercase',
        required: true,
        description: 'Lowercase letters (a-z)',
        characters: 'abcdefghijklmnopqrstuvwxyz'
    },
    {
        type: 'number',
        required: true,
        description: 'Numbers (0-9)',
        characters: '0123456789'
    },
    {
        type: 'symbol',
        required: true,
        description: 'Special characters',
        characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
];

export function ContextOptions({
    context,
    onContextChange,
    analyzedContext,
    onAnalyze
}: ContextOptionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { selectedProvider, modelSettings } = useAIProviderStore();
    const { getKey } = useAPIKeysStore();

    async function handleAIAnalysis() {
        const apiKey = getKey(selectedProvider);
        if (!apiKey) {
            toast({
                variant: "destructive",
                title: "API Key Required",
                description: "Please configure your API key in settings"
            });
            router.push('/settings');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-Provider-API-Key": apiKey
                },
                body: JSON.stringify({ 
                    prompt: context,
                    provider: selectedProvider,
                    ...modelSettings
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
                        max: null,
                        description: `${data.rules.minLength} characters minimum`
                    },
                    characterRequirements: {
                        requiredCombinations: {
                            count: data.rules.minCharTypesRequired,
                            from: 4
                        },
                        allowedCharacterSets: [
                            {
                                type: 'uppercase',
                                required: data.rules.requiredCharTypes.uppercase,
                                description: 'Uppercase letters (A-Z)',
                                characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                            },
                            {
                                type: 'lowercase',
                                required: data.rules.requiredCharTypes.lowercase,
                                description: 'Lowercase letters (a-z)',
                                characters: 'abcdefghijklmnopqrstuvwxyz'
                            },
                            {
                                type: 'number',
                                required: data.rules.requiredCharTypes.numbers,
                                description: 'Numbers (0-9)',
                                characters: '0123456789'
                            },
                            {
                                type: 'symbol',
                                required: data.rules.requiredCharTypes.symbols,
                                description: 'Special characters',
                                characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
                            }
                        ]
                    },
                    customConstraints: data.rules.excludedChars.length ? [
                        {
                            type: 'excluded-chars',
                            description: 'Excluded characters',
                            parameters: { chars: data.rules.excludedChars }
                        }
                    ] : [],
                    patterns: {
                        allowCommonWords: false,
                        allowKeyboardPatterns: false,
                        allowRepeatingChars: false,
                        allowSequentialChars: false
                    }
                },
                securityAssessment: {
                    level: 'high',
                    justification: 'Follows security best practices',
                    complianceStandards: ['NIST SP 800-63B'],
                    vulnerabilityWarnings: []
                },
                recommendations: {
                    implementation: ['Implement password strength meter'],
                    userGuidance: ['Use a password manager']
                }
            };

            onAnalyze(requirements);
            toast({
                title: "Context analyzed successfully",
                description: "Password requirements have been updated based on the context."
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
        // Define default rules
        const defaultRules = {
            minLength: 12,
            maxLength: null,
            minCharTypesRequired: 3,
            requiredCharTypes: {
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: true
            },
            excludedChars: []
        };

        const requirements: PasswordRequirements = {
            platformType: {
                type: 'general',
                description: 'Manual analysis'
            },
            passwordRules: {
                length: {
                    min: defaultRules.minLength,
                    max: null,
                    description: `${defaultRules.minLength} characters minimum`
                },
                characterRequirements: {
                    requiredCombinations: {
                        count: defaultRules.minCharTypesRequired,
                        from: 4
                    },
                    allowedCharacterSets: defaultCharacterSets.map(set => ({
                        ...set,
                        required: defaultRules.requiredCharTypes[set.type.toLowerCase() as keyof typeof defaultRules.requiredCharTypes]
                    }))
                },
                customConstraints: defaultRules.excludedChars.length ? [
                    {
                        type: 'excluded-chars',
                        description: 'Excluded characters',
                        parameters: { chars: defaultRules.excludedChars }
                    }
                ] : [],
                patterns: {
                    allowCommonWords: false,
                    allowKeyboardPatterns: false,
                    allowRepeatingChars: false,
                    allowSequentialChars: false
                }
            },
            securityAssessment: {
                level: 'high',
                justification: 'Follows security best practices',
                complianceStandards: ['NIST SP 800-63B'],
                vulnerabilityWarnings: []
            },
            recommendations: {
                implementation: ['Implement password strength meter'],
                userGuidance: ['Use a password manager']
            }
        };

        toast({
            title: "Manual Analysis",
            description: "Using standard security requirements",
            variant: "default",
        });

        onAnalyze(requirements);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Textarea
                    placeholder="Describe the platform or service you need a password for..."
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
                        className="relative"
                        title="AI Analysis"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleManualAnalysis}
                        title="Manual Analysis"
                    >
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {analyzedContext && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">Analysis Results</h3>
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
                                <li>• Required Types: {analyzedContext.passwordRules.characterRequirements.requiredCombinations.count || 'any'} from {analyzedContext.passwordRules.characterRequirements.requiredCombinations.from || 'available types'}</li>
                                <li>• Character Sets:</li>
                                <ul className="ml-4 mt-1">
                                    {analyzedContext.passwordRules.characterRequirements.allowedCharacterSets.map((set, index) => (
                                        <li key={index}>
                                            - {set.type} ({set.required ? 'Required' : 'Optional'}): {set.description}
                                        </li>
                                    ))}
                                </ul>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Security Assessment</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Security Level: {analyzedContext.securityAssessment.level}</li>
                                <li>• Justification: {analyzedContext.securityAssessment.justification}</li>
                                {analyzedContext.securityAssessment.complianceStandards.length > 0 && (
                                    <li>• Compliance Standards: {analyzedContext.securityAssessment.complianceStandards.join(', ')}</li>
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