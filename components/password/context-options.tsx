"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Settings2 } from "lucide-react"
import { PasswordRequirements } from "@/lib/context-analyzer"
import { useToast } from "@/components/ui/use-toast"
import { AllowedCharacterSet } from "@/lib/types"

interface ContextOptionsProps {
    context: string;
    onContextChange: (context: string) => void;
    analyzedContext: PasswordRequirements | null;
    onAnalyze: (requirements: PasswordRequirements) => void;
}

// Định nghĩa character sets
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
    const t = useTranslations('Components.PasswordGenerator.context');

    async function handleAIAnalysis() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: context }),
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
                title: t('toast.success.title'),
                description: t('toast.success.description')
            });

        } catch (error) {
            console.error('AI Analysis Error:', error);
            toast({
                variant: "destructive",
                title: t('toast.error.title'),
                description: error instanceof Error ? error.message : t('toast.error.description')
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleManualAnalysis = () => {
        // Định nghĩa default rules
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
            title: t('toast.manual.title'),
            description: t('toast.manual.description'),
            variant: "default",
        });

        onAnalyze(requirements);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Textarea
                    placeholder={t('placeholder')}
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
                        title={t('analyze.ai')}
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
                        title={t('analyze.manual')}
                    >
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {analyzedContext && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">{t('results.title')}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium">{t('results.platform.title')}</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• {t('results.platform.type')}: {analyzedContext.platformType.type}</li>
                                <li>• {t('results.platform.description')}: {analyzedContext.platformType.description}</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">{t('results.rules.title')}</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• {t('results.rules.length')}: {analyzedContext.passwordRules.length.min}-{analyzedContext.passwordRules.length.max || t('results.rules.unlimited')} characters</li>
                                <li>• {t('results.rules.requiredTypes')}: {analyzedContext.passwordRules.characterRequirements.requiredCombinations.count || t('results.rules.any')} from {analyzedContext.passwordRules.characterRequirements.requiredCombinations.from || t('results.rules.availableTypes')}</li>
                                <li>• {t('results.rules.characterSets')}:</li>
                                <ul className="ml-4 mt-1">
                                    {analyzedContext.passwordRules.characterRequirements.allowedCharacterSets.map((set, index) => (
                                        <li key={index}>
                                            - {set.type} {set.required ? t('results.rules.required') : t('results.rules.optional')}: {set.description}
                                        </li>
                                    ))}
                                </ul>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">{t('results.security.title')}</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• {t('results.security.level')}: {analyzedContext.securityAssessment.level}</li>
                                <li>• {t('results.security.justification')}: {analyzedContext.securityAssessment.justification}</li>
                                {analyzedContext.securityAssessment.complianceStandards.length > 0 && (
                                    <li>• {t('results.security.compliance')}: {analyzedContext.securityAssessment.complianceStandards.join(', ')}</li>
                                )}
                                {analyzedContext.securityAssessment.vulnerabilityWarnings.length > 0 && (
                                    <li className="text-destructive">• {t('results.security.warnings')}: {analyzedContext.securityAssessment.vulnerabilityWarnings.join('; ')}</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">{t('results.recommendations.title')}</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• {t('results.recommendations.implementation')}:</li>
                                <ul className="ml-4">
                                    {analyzedContext.recommendations.implementation.map((rec, index) => (
                                        <li key={index}>- {rec}</li>
                                    ))}
                                </ul>
                                <li>• {t('results.recommendations.guidance')}:</li>
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