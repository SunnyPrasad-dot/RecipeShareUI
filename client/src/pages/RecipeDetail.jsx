import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Printer,
  Edit,
  Trash2,
  Calendar,
  ArrowLeft,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StarRating } from "@/components/StarRating";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTime, formatDate, getInitials, cn } from "@/lib/utils";

export default function RecipeDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [servings, setServings] = useState(null);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["/api/recipes", id],
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ["/api/recipes", id, "comments"],
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const { data: ratings } = useQuery({
    queryKey: ["/api/recipes", id, "ratings"],
  });

  const isFavorite = favorites?.some(f => f.recipeId === parseInt(id));
  const isAuthor = user?.id === recipe?.authorId;

  useEffect(() => {
    if (recipe?.servings) {
      setServings(recipe.servings);
    }
  }, [recipe?.servings]);

  useEffect(() => {
    if (ratings && user) {
      const existingRating = ratings.find(r => r.userId === user.id);
      if (existingRating) {
        setUserRating(existingRating.score);
      }
    }
  }, [ratings, user]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { recipeId: parseInt(id) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "Recipe removed from your favorites" 
          : "Recipe saved to your favorites",
      });
    },
  });

  const rateMutation = useMutation({
    mutationFn: async (score) => {
      await apiRequest("POST", `/api/recipes/${id}/ratings`, { score });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes", id, "ratings"] });
      toast({ title: "Rating submitted", description: "Thank you for your feedback!" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content) => {
      await apiRequest("POST", `/api/recipes/${id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes", id, "comments"] });
      setComment("");
      toast({ title: "Comment added", description: "Your comment has been posted" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/recipes/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Recipe deleted", description: "Your recipe has been deleted" });
      setLocation("/recipes");
    },
  });

  const handleRating = (score) => {
    if (!isAuthenticated) {
      toast({ 
        title: "Login required", 
        description: "Please log in to rate recipes",
        variant: "destructive"
      });
      return;
    }
    setUserRating(score);
    rateMutation.mutate(score);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    if (!isAuthenticated) {
      toast({ 
        title: "Login required", 
        description: "Please log in to comment",
        variant: "destructive"
      });
      return;
    }
    commentMutation.mutate(comment);
  };

  const adjustIngredient = (amount, baseServings) => {
    if (!amount || !baseServings || !servings) return amount;
    const ratio = servings / baseServings;
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return amount;
    const adjusted = parsed * ratio;
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(2);
  };

  if (isLoading) {
    return <LoadingPage message="Loading recipe..." />;
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Recipe not found</h1>
        <Link href="/recipes">
          <Button>Browse Recipes</Button>
        </Link>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];

  return (
    <div className="min-h-screen pb-16">
      <div className="relative h-72 sm:h-96 md:h-[28rem]">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ChefHat className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute left-4 top-4">
          <Link href="/recipes">
            <Button variant="secondary" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
          <div className="container mx-auto">
            {recipe.category && (
              <Badge className="mb-3 bg-white/20 text-white backdrop-blur-sm">
                {recipe.category.name}
              </Badge>
            )}
            <h1 className="mb-4 font-serif text-3xl font-bold drop-shadow-lg sm:text-4xl md:text-5xl">
              {recipe.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {recipe.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white/30">
                    <AvatarImage src={recipe.author.profileImageUrl} className="object-cover" />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {getInitials(recipe.author.firstName, recipe.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{recipe.author.firstName} {recipe.author.lastName}</span>
                </div>
              )}
              
              {recipe.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <StarRating rating={recipe.averageRating} size="sm" />
                  <span>({recipe.ratingCount || 0})</span>
                </div>
              )}
              
              <span className="text-white/60">
                {formatDate(recipe.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Card className="relative -mt-6 mb-8">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {recipe.prepTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prep Time</p>
                    <p className="font-medium">{formatTime(recipe.prepTime)}</p>
                  </div>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cook Time</p>
                    <p className="font-medium">{formatTime(recipe.cookTime)}</p>
                  </div>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                    <p className="font-medium">{formatTime(totalTime)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Servings</p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      data-testid="button-decrease-servings"
                    >
                      -
                    </Button>
                    <span className="font-medium">{servings}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setServings(servings + 1)}
                      data-testid="button-increase-servings"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="font-medium capitalize">{recipe.difficulty}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={toggleFavoriteMutation.isPending}
                  data-testid="button-toggle-favorite"
                >
                  {isFavorite ? (
                    <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.print()} data-testid="button-print">
                <Printer className="h-5 w-5" />
              </Button>
              {isAuthor && (
                <>
                  <Link href={`/recipes/${id}/edit`}>
                    <Button variant="outline" size="icon" data-testid="button-edit">
                      <Edit className="h-5 w-5" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive" data-testid="button-delete">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your recipe.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate()}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {recipe.description && (
          <p className="mb-8 text-lg text-muted-foreground">{recipe.description}</p>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Ingredients
                  {servings !== recipe.servings && (
                    <Badge variant="outline" className="text-xs">
                      Adjusted for {servings} servings
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <span>
                        {ingredient.amount && (
                          <span className="font-medium">
                            {adjustIngredient(ingredient.amount, recipe.servings)}{" "}
                          </span>
                        )}
                        {ingredient.unit && <span>{ingredient.unit} </span>}
                        {ingredient.name}
                        {ingredient.notes && (
                          <span className="text-muted-foreground"> ({ingredient.notes})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-6">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="leading-relaxed">{instruction.text || instruction}</p>
                        {instruction.tip && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            <strong>Tip:</strong> {instruction.tip}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-12">
          <h2 className="mb-6 font-serif text-2xl font-bold">Rate This Recipe</h2>
          <div className="flex items-center gap-4">
            <StarRating
              rating={userRating}
              size="lg"
              interactive={isAuthenticated}
              onRatingChange={handleRating}
            />
            {userRating > 0 && (
              <span className="text-muted-foreground">
                You rated this {userRating} star{userRating !== 1 ? 's' : ''}
              </span>
            )}
            {!isAuthenticated && (
              <span className="text-sm text-muted-foreground">
                <a href="/api/login" className="text-primary hover:underline">Log in</a> to rate
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-6 font-serif text-2xl font-bold">
            Comments ({comments?.length || 0})
          </h2>

          {isAuthenticated && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profileImageUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts about this recipe..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-3"
                      data-testid="input-comment"
                    />
                    <Button 
                      onClick={handleComment}
                      disabled={!comment.trim() || commentMutation.isPending}
                      data-testid="button-submit-comment"
                    >
                      {commentMutation.isPending ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.user?.profileImageUrl} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(c.user?.firstName, c.user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">
                            {c.user?.firstName} {c.user?.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{c.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
