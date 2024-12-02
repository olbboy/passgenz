import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { PasswordAnalysis } from "@/lib/types"

interface PasswordOutputProps {
  password: string;
  analysis: PasswordAnalysis | null;
  onGenerate: () => void;
  onCopy: () => void;
}

export function PasswordOutput({ password, analysis, onGenerate, onCopy }: PasswordOutputProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
          <span className="text-xl font-mono flex-1 font-[family-name:var(--font-geist-mono)]">
            {password || 'Click generate'}
          </span>
          <Button variant="outline" size="icon" onClick={onGenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 