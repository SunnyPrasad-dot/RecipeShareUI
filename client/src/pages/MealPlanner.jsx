import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, Plus, X, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

function getWeekDates(date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

function formatWeekRange(dates) {
  const start = dates[0];
  const end = dates[6];
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
}

export default function MealPlanner() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState("dinner");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const weekDates = getWeekDates(currentDate);
  const weekStart = weekDates[0].toISOString();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to use the meal planner",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: mealPlan, isLoading: loadingPlan } = useQuery({
    queryKey: ["/api/meal-plans", weekStart],
    enabled: isAuthenticated,
  });

  const { data: favoriteRecipes } = useQuery({
    queryKey: ["/api/favorites/recipes"],
    enabled: isAuthenticated,
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ recipeId, dayOfWeek, mealType }) => {
      const res = await apiRequest("POST", "/api/meal-plans/items", {
        weekStart,
        recipeId,
        dayOfWeek,
        mealType,
      });
      return { response: res, recipeId, dayOfWeek, mealType };
    },
    onSuccess: ({ recipeId, dayOfWeek, mealType }) => {
      const selectedRecipe = favoriteRecipes?.find((recipe) => recipe.id === recipeId);
      const dayLabel = DAYS_OF_WEEK[dayOfWeek] || "This day";
      const recipeLabel = selectedRecipe?.title || "Recipe";

      queryClient.setQueryData(["/api/meal-plans", weekStart], (current = { id: 1, items: [] }) => ({
        ...current,
        items: [
          ...(current.items || []),
          {
            id: Date.now(),
            recipeId,
            dayOfWeek,
            mealType,
            weekStart,
            recipe: selectedRecipe,
          },
        ],
      }));
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Recipe added",
        description: `${recipeLabel} added to ${dayLabel} (${mealType})`,
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId) => {
      await apiRequest("DELETE", `/api/meal-plans/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      toast({ title: "Recipe removed", description: "Recipe removed from meal plan" });
    },
  });

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMealsForDay = (dayIndex) => {
    if (!mealPlan?.items) return {};
    
    const dayMeals = {};
    mealPlan.items
      .filter(item => item.dayOfWeek === dayIndex)
      .forEach(item => {
        if (!dayMeals[item.mealType]) {
          dayMeals[item.mealType] = [];
        }
        dayMeals[item.mealType].push(item);
      });
    
    return dayMeals;
  };

  const openAddDialog = (dayIndex, mealType) => {
    setSelectedDay(dayIndex);
    setSelectedMealType(mealType);
    setIsAddDialogOpen(true);
  };

  const handleAddRecipe = (recipeId) => {
    addItemMutation.mutate({
      recipeId,
      dayOfWeek: selectedDay,
      mealType: selectedMealType,
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen">
      <section className="border-b bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold">Meal Planner</h1>
                <p className="text-muted-foreground">
                  Plan your weekly meals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)} data-testid="button-prev-week">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday} data-testid="button-today">
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek(1)} data-testid="button-next-week">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-lg font-medium">
            {formatWeekRange(weekDates)}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {loadingPlan ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="xl" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-7">
              {weekDates.map((date, dayIndex) => {
                const dayMeals = getMealsForDay(dayIndex);
                const dayName = DAYS_OF_WEEK[dayIndex];
                const dateNum = date.getDate();

                return (
                  <Card 
                    key={dayIndex} 
                    className={cn(
                      "overflow-hidden",
                      isToday(date) && "ring-2 ring-primary"
                    )}
                  >
                    <CardHeader className={cn(
                      "p-3 text-center",
                      isToday(date) ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <div className="text-sm font-medium">{dayName.slice(0, 3)}</div>
                      <div className="text-2xl font-bold">{dateNum}</div>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2">
                      {MEAL_TYPES.map((mealType) => (
                        <div key={mealType} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium capitalize text-muted-foreground">
                              {mealType}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => openAddDialog(dayIndex, mealType)}
                              data-testid={`button-add-${dayIndex}-${mealType}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {dayMeals[mealType]?.map((item) => (
                            <div
                              key={item.id}
                              className="group relative flex items-center gap-2 rounded-md bg-muted/50 p-2"
                            >
                              {item.recipe?.imageUrl ? (
                                <img
                                  src={item.recipe.imageUrl}
                                  alt={item.recipe.title}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <span className="flex-1 truncate text-xs">
                                {item.recipe?.title}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeItemMutation.mutate(item.id)}
                                data-testid={`button-remove-item-${item.id}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!loadingPlan && (!mealPlan?.items || mealPlan.items.length === 0) && (
            <div className="mt-8">
              <EmptyState type="mealPlan" />
            </div>
          )}
        </div>
      </section>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Recipe to {selectedDay !== null && DAYS_OF_WEEK[selectedDay]}'s {selectedMealType}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {favoriteRecipes && favoriteRecipes.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium">Your Favorites</h3>
                <div className="grid gap-2">
                  {favoriteRecipes.map((recipe) => (
                    <Button
                      key={recipe.id}
                      variant="outline"
                      className="h-auto justify-start gap-3 p-3"
                      onClick={() => handleAddRecipe(recipe.id)}
                      disabled={addItemMutation.isPending}
                      data-testid={`button-select-recipe-${recipe.id}`}
                    >
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                          <ChefHat className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.category?.name}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No favorite recipes yet. Save some recipes to add them to your meal plan!
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
