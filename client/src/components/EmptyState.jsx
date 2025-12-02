import { ChefHat, Search, Heart, Calendar, BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const emptyStateConfigs = {
  recipes: {
    icon: BookOpen,
    title: "No recipes found",
    description: "Be the first to share a delicious recipe with the community!",
    action: { label: "Create Recipe", href: "/recipes/new" },
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
    action: null,
  },
  favorites: {
    icon: Heart,
    title: "No favorites yet",
    description: "Start saving recipes you love to easily find them later!",
    action: { label: "Browse Recipes", href: "/recipes" },
  },
  mealPlan: {
    icon: Calendar,
    title: "Your meal plan is empty",
    description: "Add recipes to your meal plan to organize your week.",
    action: { label: "Browse Recipes", href: "/recipes" },
  },
  myRecipes: {
    icon: ChefHat,
    title: "You haven't created any recipes yet",
    description: "Share your culinary creations with the world!",
    action: { label: "Create Your First Recipe", href: "/recipes/new" },
  },
};

export function EmptyState({ type = "recipes", className, customAction }) {
  const config = emptyStateConfigs[type] || emptyStateConfigs.recipes;
  const Icon = config.icon;
  const action = customAction || config.action;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 text-center",
      className
    )}>
      <div className="mb-6 rounded-full bg-muted p-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{config.title}</h3>
      <p className="mb-6 max-w-md text-muted-foreground">{config.description}</p>
      {action && (
        <Link href={action.href}>
          <Button className="gap-2" data-testid={`button-empty-state-${type}`}>
            <Plus className="h-4 w-4" />
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
