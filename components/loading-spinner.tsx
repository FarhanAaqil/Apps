import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
}

export default function LoadingSpinner({ size = "medium" }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-8 w-8",
  }

  return (
    <div className="flex justify-center items-center">
      <div className={cn("animate-spin rounded-full border-t-2 border-b-2 border-gray-900", sizeClasses[size])}></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
