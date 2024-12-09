import { ThemeSettings } from "@/components/settings/theme-settings"
import { Separator } from "@/components/ui/separator"

export default function ThemeSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of your application.
        </p>
      </div>
      <Separator />
      <ThemeSettings />
    </div>
  )
} 