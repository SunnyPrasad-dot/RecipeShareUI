import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChefHat, Heart, Calendar, Settings, Edit, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getInitials, formatDate } from "@/lib/utils";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view your profile",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user?.bio]);

  const { data: myRecipes, isLoading: loadingRecipes } = useQuery({
    queryKey: ["/api/recipes/my"],
    enabled: isAuthenticated,
  });

  const { data: favoriteRecipes, isLoading: loadingFavorites } = useQuery({
    queryKey: ["/api/favorites/recipes"],
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
  });

  const updateBioMutation = useMutation({
    mutationFn: async (newBio) => {
      await apiRequest("PATCH", "/api/users/profile", { bio: newBio });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingBio(false);
      toast({ title: "Profile updated", description: "Your bio has been updated" });
    },
  });

  if (authLoading) {
    return <LoadingPage message="Loading profile..." />;
  }

  if (!user) {
    return null;
  }

  const favoriteIds = new Set(favoriteRecipes?.map(r => r.id) || []);

  return (
    <div className="min-h-screen pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl sm:h-32 sm:w-32">
                <AvatarImage src={user.profileImageUrl} className="object-cover" />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground sm:text-3xl">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h1 className="mb-2 font-serif text-3xl font-bold sm:text-4xl">
                {user.firstName} {user.lastName}
              </h1>
              {user.email && (
                <p className="mb-3 text-muted-foreground">{user.email}</p>
              )}
              
              {isEditingBio ? (
                <div className="max-w-md space-y-3">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-20"
                    data-testid="input-bio"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => updateBioMutation.mutate(bio)}
                      disabled={updateBioMutation.isPending}
                      data-testid="button-save-bio"
                    >
                      {updateBioMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditingBio(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="max-w-md text-muted-foreground">
                    {user.bio || "No bio yet. Click to add one!"}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsEditingBio(true)}
                    data-testid="button-edit-bio"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <p className="mt-3 text-sm text-muted-foreground">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stats?.recipeCount || myRecipes?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Recipes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stats?.favoriteCount || favoriteRecipes?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stats?.mealPlanCount || 0}</p>
                <p className="text-xs text-muted-foreground">Meal Plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="recipes" className="gap-2" data-testid="tab-my-recipes">
                <ChefHat className="h-4 w-4" />
                My Recipes
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2" data-testid="tab-favorites">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes">
              {loadingRecipes ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))}
                </div>
              ) : myRecipes && myRecipes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {myRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favoriteIds.has(recipe.id)}
                      showAuthor={false}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="myRecipes" />
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {loadingFavorites ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
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
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="favorites" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
