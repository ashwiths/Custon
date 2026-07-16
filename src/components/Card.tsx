import * as React from "react"
import { cn } from "@/utils/cn"

/* ─── Card ────────────────────────────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("glass-card", className)}
    {...props}
  />
))
Card.displayName = "Card"

/* ─── CardHeader ─────────────────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col", className)}
    style={{ padding: "24px 24px 0 24px", gap: "4px" }}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* ─── CardTitle ──────────────────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("card-title", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* ─── CardDescription ────────────────────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("small-text", className)}
    style={{ marginTop: "2px" }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* ─── CardContent ────────────────────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ padding: "20px 24px" }}
    {...props}
  />
))
CardContent.displayName = "CardContent"

/* ─── CardFooter ─────────────────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    style={{ padding: "0 24px 24px 24px", gap: "12px" }}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
