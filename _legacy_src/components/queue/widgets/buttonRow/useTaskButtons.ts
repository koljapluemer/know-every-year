import type { TaskButton } from './TaskButtonTypes'

export function useTaskButtons() {
  /**
   * Creates rating buttons with the standard Wrong/Hard/Good/Easy pattern
   */
  const createRatingButtons = (
    onRating: (rating: 'wrong' | 'hard' | 'good' | 'easy') => void,
    options?: {
      disabled?: boolean
      size?: 'sm' | 'md' | 'lg'
    }
  ): TaskButton[] => [
    {
      id: 'wrong',
      label: 'Wrong',
      variant: 'error',
      size: options?.size || 'md',
      disabled: options?.disabled,
      onClick: () => onRating('wrong')
    },
    {
      id: 'hard',
      label: 'Hard',
      variant: 'warning',
      size: options?.size || 'md',
      disabled: options?.disabled,
      onClick: () => onRating('hard')
    },
    {
      id: 'good',
      label: 'Good',
      variant: 'info',
      size: options?.size || 'md',
      disabled: options?.disabled,
      onClick: () => onRating('good')
    },
    {
      id: 'easy',
      label: 'Easy',
      variant: 'success',
      size: options?.size || 'md',
      disabled: options?.disabled,
      onClick: () => onRating('easy')
    }
  ]

  /**
   * Creates a reveal button
   */
  const createRevealButton = (
    onReveal: () => void,
    options?: {
      label?: string
      size?: 'sm' | 'md' | 'lg'
      disabled?: boolean
    }
  ): TaskButton => ({
    id: 'reveal',
    label: options?.label || 'Reveal Answer',
    variant: 'primary',
    size: options?.size || 'lg',
    disabled: options?.disabled,
    onClick: onReveal
  })

  /**
   * Creates action buttons (like Skip, Done, etc.)
   */
  const createActionButtons = (
    actions: Array<{
      id: string
      label: string
      variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'ghost' | 'outline'
      size?: 'sm' | 'md' | 'lg'
      disabled?: boolean
      onClick: () => void
    }>
  ): TaskButton[] => actions.map(action => ({
    id: action.id,
    label: action.label,
    variant: action.variant || 'outline',
    size: action.size || 'md',
    disabled: action.disabled,
    onClick: action.onClick
  }))

  /**
   * Creates a single action button
   */
  const createActionButton = (
    id: string,
    label: string,
    onClick: () => void,
    options?: {
      variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'ghost' | 'outline'
      size?: 'sm' | 'md' | 'lg'
      disabled?: boolean
      icon?: string
    }
  ): TaskButton => ({
    id,
    label,
    variant: options?.variant || 'outline',
    size: options?.size || 'md',
    disabled: options?.disabled,
    icon: options?.icon,
    onClick
  })

  return {
    createRatingButtons,
    createRevealButton,
    createActionButtons,
    createActionButton
  }
} 