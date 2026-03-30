'use client'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
  size?: 'xs' | 'sm'
}

function MarkdownRendererInner({ content, className, size = 'sm' }: MarkdownRendererProps) {
  const textSize = size === 'xs' ? 'text-xs' : 'text-sm'
  const headingBase = size === 'xs' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn('space-y-1.5 leading-relaxed', textSize, className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h2 className={cn('font-bold text-foreground mt-3 mb-1', size === 'xs' ? 'text-sm' : 'text-base')}>{children}</h2>,
        h2: ({ children }) => <h3 className={cn('font-semibold text-foreground mt-2 mb-1', headingBase)}>{children}</h3>,
        h3: ({ children }) => <h4 className={cn('font-semibold text-foreground mt-1.5 mb-0.5', headingBase)}>{children}</h4>,
        p: ({ children }) => <p className={cn(textSize, 'leading-relaxed')}>{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="space-y-0.5 list-disc list-inside">{children}</ul>,
        ol: ({ children }) => <ol className="space-y-0.5 list-decimal list-inside">{children}</ol>,
        li: ({ children }) => <li className={cn(textSize, 'leading-relaxed')}>{children}</li>,
        code: ({ children, className: codeClass }) => {
          const isBlock = codeClass?.startsWith('language-')
          if (isBlock) {
            return <code className={cn('block bg-muted rounded-md p-2 text-[11px] overflow-x-auto', codeClass)}>{children}</code>
          }
          return <code className="bg-muted px-1 py-0.5 rounded text-[11px]">{children}</code>
        },
        pre: ({ children }) => <pre className="bg-muted rounded-md p-2 overflow-x-auto my-1">{children}</pre>,
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}

export const MarkdownRenderer = memo(MarkdownRendererInner)
