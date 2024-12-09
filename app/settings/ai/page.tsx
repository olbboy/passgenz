import { AISettings } from "@/components/settings/ai-settings"
import { Separator } from "@/components/ui/separator"

export default function AISettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">AI Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI providers and model settings.
        </p>
      </div>
      <Separator />
      <AISettings />
    </div>
  )
} 