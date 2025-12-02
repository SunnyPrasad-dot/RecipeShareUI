import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Croissant, 
  Sandwich, 
  UtensilsCrossed, 
  Cake, 
  Soup, 
  Salad, 
  Cookie,
  Wine
} from "lucide-react";

const categoryIcons = {
  breakfast: Croissant,
  lunch: Sandwich,
  dinner: UtensilsCrossed,
  desserts: Cake,
  soups: Soup,
  salads: Salad,
  snacks: Cookie,
  drinks: Wine,
};

const categoryColors = {
  breakfast: "from-amber-400 to-orange-500",
  lunch: "from-green-400 to-emerald-500",
  dinner: "from-rose-400 to-pink-500",
  desserts: "from-purple-400 to-violet-500",
  soups: "from-yellow-400 to-amber-500",
  salads: "from-lime-400 to-green-500",
  snacks: "from-cyan-400 to-blue-500",
  drinks: "from-fuchsia-400 to-pink-500",
};

export function CategoryCard({ category, recipeCount = 0, className }) {
  const Icon = categoryIcons[category.slug] || UtensilsCrossed;
  const colorClass = categoryColors[category.slug] || "from-gray-400 to-gray-500";

  return (
    <Link href={`/recipes?category=${category.slug}`}>
      <Card 
        className={cn(
          "group relative overflow-visible cursor-pointer hover-elevate",
          className
        )}
        data-testid={`card-category-${category.slug}`}
      >
        <div className={cn(
          "flex flex-col items-center justify-center p-6 text-white",
          "bg-gradient-to-br rounded-lg",
          colorClass
        )}>
          <div className="mb-3 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-white/80">{recipeCount} recipes</p>
        </div>
      </Card>
    </Link>
  );
}
