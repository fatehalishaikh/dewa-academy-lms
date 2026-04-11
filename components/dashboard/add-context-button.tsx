import { Sparkles, Check } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useChatContext, type ContextEntry } from '@/stores/chat-context-store'

export function AddContextButton({ id, entry }: { id: string; entry: ContextEntry }) {
  const { contexts, addContext, removeContext } = useChatContext()
  const active = id in contexts

  function toggle() {
    if (active) removeContext(id)
    else addContext(id, entry)
  }

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={toggle}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors border ${
          active
            ? 'bg-primary/15 text-primary border-primary/30'
            : 'bg-muted/60 text-muted-foreground border-transparent hover:border-primary/20 hover:text-primary'
        }`}
      >
        {active ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs max-w-[180px] text-center">
        {active ? 'Remove from AI context' : 'Add this section\'s data to the AI assistant context'}
      </TooltipContent>
    </Tooltip>
  )
}
