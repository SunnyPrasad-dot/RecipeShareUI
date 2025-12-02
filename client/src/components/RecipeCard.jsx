import { Link } from "wouter";
import { Clock, Users, Heart, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatTime, getInitials } from "@/lib/utils";

export function RecipeCard({ 
  recipe, 
  isFavorite = false, 
  onToggleFavorite,
  showAuthor = true,
  className 
}) {
  const {
    id,
    title,
    slug,
    description,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    difficulty,
    author,
    averageRating,
    ratingCount,
    tags = [],
  } = recipe;

  const totalTime = (prepTime || 0) + (cookTime || 0);

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <Link href={`/recipes/${id}`}>
      <Card 
        className={cn(
          "group overflow-visible cursor-pointer transition-all duration-300 hover-elevate",
          className
        )}
        data-testid={`card-recipe-${id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
              data-testid={`button-favorite-${id}`}
            >
              {isFavorite ? (
                <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          )}

          {difficulty && (
            <Badge 
              className={cn(
                "absolute left-2 top-2 text-xs font-medium uppercase",
                difficultyColors[difficulty] || difficultyColors.medium
              )}
            >
              {difficulty}
            </Badge>
          )}

          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="line-clamp-2 font-serif text-lg font-bold text-white drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>

        <CardContent className="p-4">
          {showAuthor && author && (
            <div className="mb-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.profileImageUrl} alt={author.firstName || 'User'} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {getInitials(author.firstName, author.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {author.firstName} {author.lastName}
              </span>
            </div>
          )}

          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(totalTime)}</span>
              </div>
            )}
            {servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{servings} servings</span>
              </div>
            )}
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{averageRating.toFixed(1)}</span>
                {ratingCount > 0 && (
                  <span className="text-xs">({ratingCount})</span>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.id || tag.name} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-3 flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
