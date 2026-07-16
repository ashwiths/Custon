import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 rounded-[16px] shadow-sm",
        outline: "btn-secondary",
        secondary:
          "bg-[rgba(255,255,255,0.45)] text-[#734E46] border border-[rgba(115,78,70,0.2)] rounded-[16px] hover:bg-[rgba(255,255,255,0.7)] backdrop-blur-sm",
        ghost:
          "bg-transparent text-[#734E46] hover:bg-[rgba(255,255,255,0.35)] rounded-[12px]",
        link: "underline-offset-4 hover:underline text-[#A67165] bg-transparent",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-[14px] rounded-[16px]",
        sm: "h-8 px-4 text-[13px] rounded-[12px]",
        lg: "h-12 px-8 text-[15px] rounded-[16px]",
        icon: "h-9 w-9 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
