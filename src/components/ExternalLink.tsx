import type { ReactNode } from 'react';
import { Icon } from './Icon';

/** Link externo que abre em nova aba (com aviso para leitores de tela). */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`ext-link${className ? ` ${className}` : ''}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon name="external" size={14} />
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
