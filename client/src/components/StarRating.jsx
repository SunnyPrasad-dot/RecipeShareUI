import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = "md", 
  interactive = false,
  onRatingChange,
  showCount = false,
  count = 0,
  className 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= (hoverRating || rating);
          
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={cn(
                "transition-colors",
                interactive && "cursor-pointer hover:scale-110"
              )}
              data-testid={`star-${starValue}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-none text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-muted-foreground">
          ({count})
        </span>
      )}
    </div>
  );
}
