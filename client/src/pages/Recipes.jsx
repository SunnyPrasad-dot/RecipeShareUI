import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Recipes() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const params = new URLSearchParams(searchParams);
  const initialSearch = params.get("search") || "";
  const initialCategory = params.get("category") || "";
  const initialSort = params.get("sort") || "recent";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState(initialSort);
  const [difficulty, setDifficulty] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["/api/recipes", { search: searchQuery, category: selectedCategory, sort: sortBy, tags: selectedTags.join(","), difficulty }],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const favoriteIds = new Set(favorites?.map(f => f.recipeId) || []);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (recipeId) => {
      if (!isAuthenticated) {
        setLocation("/login");
        return;
      }
      const isAdding = !favoriteIds.has(recipeId);
      if (favoriteIds.has(recipeId)) {
        await apiRequest("DELETE", `/api/favorites/${recipeId}`);
      } else {
        await apiRequest("POST", "/api/favorites", { recipeId });
      }
      return { recipeId, isAdding };
    },
    onSuccess: (result) => {
      if (!result) return;
      queryClient.setQueryData(["/api/favorites"], (current = []) => {
        if (result.isAdding) {
          return [...current, { id: Date.now(), userId: "demo-user", recipeId: result.recipeId }];
        }
        return current.filter((favorite) => favorite.recipeId !== result.recipeId);
      });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/recipes"] });
      toast({
        title: "Favorites updated",
        description: result.isAdding ? "Recipe added to your favorites." : "Recipe removed from your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
    },
  });

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
    setDifficulty("");
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0 || difficulty;

  return (
    <div className="min-h-screen">
      <section className="border-b bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="mb-2 font-serif text-3xl font-bold">Browse Recipes</h1>
            <p className="text-muted-foreground">
              Discover delicious recipes from our community
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes by name, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-recipe-search"
              />
            </div>

            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="quick">Quick & Easy</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2" data-testid="button-filters">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0">
                        {(selectedCategory ? 1 : 0) + selectedTags.length + (difficulty ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="mb-3 font-medium">Category</h3>
                      <div className="space-y-2">
                        {categories?.map((category) => (
                          <div key={category.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategory === category.slug}
                              onCheckedChange={(checked) => 
                                setSelectedCategory(checked ? category.slug : "")
                              }
                            />
                            <label htmlFor={`category-${category.id}`} className="text-sm">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium">Difficulty</h3>
                      <div className="space-y-2">
                        {["easy", "medium", "hard"].map((level) => (
                          <div key={level} className="flex items-center gap-2">
                            <Checkbox
                              id={`difficulty-${level}`}
                              checked={difficulty === level}
                              onCheckedChange={(checked) => 
                                setDifficulty(checked ? level : "")
                              }
                            />
                            <label htmlFor={`difficulty-${level}`} className="text-sm capitalize">
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags?.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagToggle(tag.id)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={clearFilters}
                      >
                        Clear All
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {categories?.find(c => c.slug === selectedCategory)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory("")}
                  />
                </Badge>
              )}
              {difficulty && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {difficulty}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setDifficulty("")}
                  />
                </Badge>
              )}
              {selectedTags.map(tagId => {
                const tag = tags?.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="gap-1">
                    {tag.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagToggle(tagId)}
                    />
                  </Badge>
                ) : null;
              })}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : recipes && recipes.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favoriteIds.has(recipe.id)}
                    onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState type="search" />
          )}
        </div>
      </section>
    </div>
  );
}
