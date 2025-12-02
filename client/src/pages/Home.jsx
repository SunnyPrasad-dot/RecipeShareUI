import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChefHat, TrendingUp, Clock, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { CategoryCard } from "@/components/CategoryCard";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  const { data: featuredRecipes, isLoading: loadingFeatured } = useQuery({
    queryKey: ["/api/recipes", "featured"],
  });

  const { data: recentRecipes, isLoading: loadingRecent } = useQuery({
    queryKey: ["/api/recipes", "recent"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
  });

  const favoriteIds = new Set(favorites?.map(f => f.recipeId) || []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 font-serif text-3xl font-bold sm:text-4xl">
                Welcome back, {user?.firstName || "Chef"}! 
              </h1>
              <p className="text-muted-foreground">
                Ready to discover or create something delicious today?
              </p>
            </div>
            <Link href="/recipes/new">
              <Button size="lg" className="gap-2" data-testid="button-create-recipe-home">
                <Plus className="h-4 w-4" />
                Create New Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Browse by Category</h2>
                <p className="text-muted-foreground">Find recipes by meal type</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  recipeCount={category.recipeCount || 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Trending Recipes</h2>
                <p className="text-muted-foreground">Most popular this week</p>
              </div>
            </div>
            <Link href="/recipes?sort=popular">
              <Button variant="ghost" className="gap-2" data-testid="link-view-all-trending">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredRecipes && featuredRecipes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredRecipes.slice(0, 4).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteIds.has(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="recipes" />
          )}
        </div>
      </section>

      <section className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Recently Added</h2>
                <p className="text-muted-foreground">Fresh from the community</p>
              </div>
            </div>
            <Link href="/recipes?sort=recent">
              <Button variant="ghost" className="gap-2" data-testid="link-view-all-recent">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingRecent ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : recentRecipes && recentRecipes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentRecipes.slice(0, 4).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteIds.has(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="recipes" />
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-orange-500 p-8 text-white sm:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <ChefHat className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Share Your Culinary Creations</h2>
                  <p className="text-white/80">
                    Got a recipe the world needs to taste? Share it with our community!
                  </p>
                </div>
              </div>
              <Link href="/recipes/new">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="gap-2 bg-white text-primary hover:bg-white/90"
                  data-testid="button-create-recipe-cta"
                >
                  <Plus className="h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
