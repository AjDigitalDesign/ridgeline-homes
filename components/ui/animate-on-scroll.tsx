"use client";

import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fade-in"
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "scale-in";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function AnimateOnScroll({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 600,
  className,
  threshold = 0.1,
  as: Component = "div",
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useAnimateOnScroll({ threshold });

  const animationClass = {
    "fade-in": "animate-fade-in",
    "fade-in-up": "animate-fade-in-up",
    "fade-in-down": "animate-fade-in-down",
    "fade-in-left": "animate-fade-in-left",
    "fade-in-right": "animate-fade-in-right",
    "scale-in": "animate-scale-in",
  }[animation];

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  threshold = 0.1,
}: StaggerContainerProps) {
  const { ref, isVisible } = useAnimateOnScroll({ threshold });

  return (
    <div
      ref={ref}
      className={cn("stagger-children", isVisible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
