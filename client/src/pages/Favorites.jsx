import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Favorites() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view your favorites",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const { data: favoriteRecipes, isLoading: loadingRecipes } = useQuery({
    queryKey: ["/api/favorites/recipes"],
    enabled: isAuthenticated,
  });

  const favoriteIds = new Set(favorites?.map(f => f.recipeId) || []);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (recipeId) => {
      await apiRequest("DELETE", `/api/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/recipes"] });
      toast({
        title: "Removed from favorites",
        description: "Recipe has been removed from your favorites",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="border-b bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">My Favorites</h1>
              <p className="text-muted-foreground">
                {favoriteRecipes?.length || 0} saved recipe{(favoriteRecipes?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading || loadingRecipes ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : favoriteRecipes && favoriteRecipes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={true}
                  onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="favorites" />
          )}
        </div>
      </section>
    </div>
  );
}
