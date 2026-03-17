import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MarkdownContent({ content, className, inline = false }: MarkdownContentProps) {
  if (inline) {
    return (
      <div className={cn('inline', className)}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <span>{children}</span>,
          }}
        >
          {content}
        </Markdown>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:text-text prose-headings:font-semibold',
        'prose-p:text-text-secondary prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-text prose-strong:font-semibold',
        'prose-code:rounded prose-code:bg-bg-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-normal prose-code:text-text',
        'prose-pre:rounded-lg prose-pre:bg-bg-tertiary',
        'prose-ul:text-text-secondary prose-ol:text-text-secondary',
        'prose-li:marker:text-text-tertiary',
        'prose-blockquote:border-l-primary prose-blockquote:text-text-secondary',
        'prose-hr:border-border',
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
