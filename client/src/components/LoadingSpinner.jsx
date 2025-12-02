import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin text-primary",
        sizes[size],
        className
      )} 
    />
  );
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="xl" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
