import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@shared/lib/utils"

const buttonVariants = cva(
  cn(
    "group/button inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-wide transition-all outline-none select-none",
    "border border-transparent rounded-lg",
    "focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900",
    "disabled:opacity-50 disabled:pointer-events-none",
    "motion-safe:active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "[color:var(--color-text-on-accent)] uppercase tracking-[0.08em]",
          "bg-[linear-gradient(135deg,var(--color-accent-gold)_0%,var(--color-accent-gold-hi)_100%)]",
          "border-accent-gold-hi shadow-gold-soft",
          "motion-safe:hover:enabled:-translate-y-px hover:enabled:shadow-gold-hi"
        ),
        secondary: cn(
          "text-accent-gold bg-transparent border-2 border-dark-600",
          "hover:enabled:border-accent-gold hover:enabled:bg-accent-gold/10",
          "active:enabled:bg-accent-gold/15"
        ),
        ghost: cn(
          "text-text-muted bg-transparent",
          "hover:enabled:text-accent-gold hover:enabled:bg-accent-gold/10"
        ),
        link: "text-accent-gold underline-offset-4 hover:underline bg-transparent",
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
      },
      size: {
        sm: "h-9 min-h-10 px-3 text-label",
        md: "h-10 min-h-10 px-4 text-label",
        lg: "h-12 min-h-12 px-6 text-body",
        icon: "size-10 min-h-10 min-w-10 p-0",
        default: "h-10 px-4 text-label",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
