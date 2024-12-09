"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useGeneralStore } from "@/lib/stores/general-store"
import { useToast } from "@/components/ui/use-toast"

export function GeneralSettings() {
  const { toast } = useToast()
  const { 
    saveHistory, 
    maxHistoryItems, 
    autoFormat, 
    defaultTimeout,
    updateSettings,
    resetSettings
  } = useGeneralStore()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been saved successfully."
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Save Request History</Label>
            <p className="text-sm text-muted-foreground">
              Save your password generation history for future reference
            </p>
          </div>
          <Switch
            checked={saveHistory}
            onCheckedChange={(checked) => 
              updateSettings({ saveHistory: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-format JSON</Label>
            <p className="text-sm text-muted-foreground">
              Automatically format JSON responses for better readability
            </p>
          </div>
          <Switch
            checked={autoFormat}
            onCheckedChange={(checked) =>
              updateSettings({ autoFormat: checked })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label>Maximum History Items</Label>
          <Input
            type="number"
            value={maxHistoryItems}
            onChange={(e) =>
              updateSettings({ 
                maxHistoryItems: parseInt(e.target.value) 
              })
            }
            min={1}
            max={100}
          />
          <p className="text-sm text-muted-foreground">
            Maximum number of items to keep in history (1-100)
          </p>
        </div>

        <div className="grid gap-2">
          <Label>Request Timeout (ms)</Label>
          <Input
            type="number"
            value={defaultTimeout}
            onChange={(e) =>
              updateSettings({ 
                defaultTimeout: parseInt(e.target.value) 
              })
            }
            min={1000}
            max={60000}
            step={1000}
          />
          <p className="text-sm text-muted-foreground">
            Default timeout for API requests in milliseconds (1000-60000)
          </p>
        </div>
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