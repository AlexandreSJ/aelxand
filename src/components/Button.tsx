import type { ReactNode } from 'react'

type Props = {
  href?: string
  variant?: 'red' | 'outline' | 'ghost'
  size?: 'sm'
  onClick?: () => void
  children: ReactNode
}

export function Button({ href, variant = 'outline', size, onClick, children }: Props) {
  const cls = `btn btn--${variant}${size ? ' btn--sm' : ''}`
  if (href) {
    const ext = href.startsWith('http')
    return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
  }
  return <button type="button" className={cls} onClick={onClick}>{children}</button>
}
