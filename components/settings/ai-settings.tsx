"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAIProviderStore } from "@/lib/stores/ai-provider-store"
import { useAPIKeysStore } from "@/lib/stores/api-keys-store"
import { AI_PROVIDERS } from "@/lib/constants/ai-providers"
import { useToast } from "@/components/ui/use-toast"

export function AISettings() {
  const { selectedProvider, modelSettings, setProvider, updateSettings, resetSettings } = useAIProviderStore()
  const { getKey, setKey } = useAPIKeysStore()
  const { toast } = useToast()

  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider)

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your AI settings have been saved successfully."
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>AI Provider</Label>
          <Select 
            value={selectedProvider}
            onValueChange={setProvider}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {AI_PROVIDERS.map((provider) => (
                <SelectItem 
                  key={provider.id} 
                  value={provider.id}
                >
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedProviderData && (
            <p className="text-sm text-muted-foreground">
              {selectedProviderData.description}
            </p>
          )}
        </div>

        {selectedProviderData && (
          <div className="grid gap-2">
            <Label>{selectedProviderData.apiKeyName}</Label>
            <Input
              type="password"
              value={getKey(selectedProvider)}
              onChange={(e) => setKey(selectedProvider, e.target.value)}
              placeholder="Enter your API key"
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a 
                href={selectedProviderData.apiKeyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                {selectedProviderData.website}
              </a>
            </p>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Model Settings</h4>
        
        <div className="grid gap-2">
          <Label>Temperature ({modelSettings.temperature})</Label>
          <Slider
            value={[modelSettings.temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => updateSettings({ temperature: value })}
          />
          <p className="text-sm text-muted-foreground">
            Controls randomness in responses. Lower values are more focused and deterministic.
          </p>
        </div>

        <div className="grid gap-2">
          <Label>Top P ({modelSettings.top_p})</Label>
          <Slider
            value={[modelSettings.top_p]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => updateSettings({ top_p: value })}
          />
          <p className="text-sm text-muted-foreground">
            Controls diversity of responses. Lower values make output more focused.
          </p>
        </div>

        <div className="grid gap-2">
          <Label>Max Tokens ({modelSettings.maxTokens})</Label>
          <Slider
            value={[modelSettings.maxTokens]}
            min={1}
            max={selectedProviderData?.models[0].maxTokens || 4096}
            step={1}
            onValueChange={([value]) => updateSettings({ maxTokens: value })}
          />
          <p className="text-sm text-muted-foreground">
            Maximum number of tokens to generate in response.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Truncate Response</Label>
            <p className="text-sm text-muted-foreground">
              Automatically truncate responses that are too long
            </p>
          </div>
          <Switch
            checked={modelSettings.truncateResponse}
            onCheckedChange={(checked) => updateSettings({ truncateResponse: checked })}
          />
        </div>

        {modelSettings.truncateResponse && (
          <div className="grid gap-2">
            <Label>Max Response Length ({modelSettings.maxResponseLength})</Label>
            <Slider
              value={[modelSettings.maxResponseLength]}
              min={1}
              max={4096}
              step={1}
              onValueChange={([value]) => updateSettings({ maxResponseLength: value })}
            />
            <p className="text-sm text-muted-foreground">
              Maximum length of truncated responses in tokens.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetSettings}
        >
          Reset to Default
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
} 