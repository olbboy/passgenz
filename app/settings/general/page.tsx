import { GeneralSettings } from "@/components/settings/general-settings"
import { Separator } from "@/components/ui/separator"

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure general application behavior and preferences.
        </p>
      </div>
      <Separator />
      <GeneralSettings />
    </div>
  )
} 