export type ButtonVariant = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'ghost' | 'outline'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonLayout = 'horizontal' | 'vertical' | 'grid'
export type ButtonAlignment = 'left' | 'center' | 'right'

export interface TaskButton {
  id: string
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  visible?: boolean
  onClick: () => void
  icon?: string // For lucide icons
}

export interface TaskButtonsConfig {
  layout?: ButtonLayout
  alignment?: ButtonAlignment
  gap?: 'sm' | 'md' | 'lg'
  wrap?: boolean
}

// Common button presets
export const RATING_BUTTONS: TaskButton[] = [
  { id: 'wrong', label: 'Wrong', variant: 'error', onClick: () => {} },
  { id: 'hard', label: 'Hard', variant: 'warning', onClick: () => {} },
  { id: 'good', label: 'Good', variant: 'info', onClick: () => {} },
  { id: 'easy', label: 'Easy', variant: 'success', onClick: () => {} }
]

export const REVEAL_BUTTON: TaskButton = {
  id: 'reveal',
  label: 'Reveal Answer',
  variant: 'primary',
  size: 'lg',
  onClick: () => {}
}
