import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tagColors = {
  vegan: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
  vegetarian: "bg-lime-100 text-lime-700 hover:bg-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:hover:bg-lime-900/50",
  "gluten-free": "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50",
  "dairy-free": "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
  "quick-meal": "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50",
  "low-carb": "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50",
  "high-protein": "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
  healthy: "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50",
  comfort: "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50",
  spicy: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
};

export function TagBadge({ 
  tag, 
  selected = false, 
  onClick, 
  removable = false,
  onRemove,
  className 
}) {
  const colorClass = tagColors[tag.slug] || "bg-secondary text-secondary-foreground";
  
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className={cn(
        "cursor-pointer transition-all",
        !selected && colorClass,
        selected && "ring-2 ring-primary ring-offset-2",
        className
      )}
      onClick={handleClick}
      data-testid={`tag-${tag.slug}`}
    >
      {tag.name}
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 rounded-full hover:bg-black/10"
          data-testid={`remove-tag-${tag.slug}`}
        >
          &times;
        </button>
      )}
    </Badge>
  );
}
