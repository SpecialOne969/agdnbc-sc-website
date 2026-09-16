import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  children: React.ReactNode
  from?: 'bottom' | 'left' | 'right' | 'scale' | 'fade'
  delay?: number
  className?: string
}

export default function Animate({ children, from = 'bottom', delay = 0, className = '' }: Props) {
  const ref = useScrollReveal()
  const dirClass = from === 'fade' ? '' : `from-${from}`
  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
