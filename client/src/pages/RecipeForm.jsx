import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Plus, Trash2, GripVertical, Upload, X, ArrowLeft, Save, ChefHat } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { isUnauthorizedError } from "@/lib/authUtils";

const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  prepTime: z.coerce.number().min(0).optional(),
  cookTime: z.coerce.number().min(0).optional(),
  servings: z.coerce.number().min(1, "At least 1 serving required").default(4),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  categoryId: z.coerce.number().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required"),
    amount: z.string().optional(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, "At least one ingredient is required"),
  instructions: z.array(z.object({
    text: z.string().min(1, "Instruction text is required"),
    tip: z.string().optional(),
  })).min(1, "At least one instruction is required"),
  tagIds: z.array(z.number()).optional(),
});

export default function RecipeForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: recipe, isLoading: loadingRecipe } = useQuery({
    queryKey: ["/api/recipes", id],
    enabled: isEditing,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const form = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
      prepTime: 0,
      cookTime: 0,
      servings: 4,
      difficulty: "medium",
      categoryId: undefined,
      ingredients: [{ name: "", amount: "", unit: "", notes: "" }],
      instructions: [{ text: "", tip: "" }],
      tagIds: [],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = 
    useFieldArray({ control: form.control, name: "ingredients" });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = 
    useFieldArray({ control: form.control, name: "instructions" });

  useEffect(() => {
    if (recipe && isEditing) {
      form.reset({
        title: recipe.title || "",
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        videoUrl: recipe.videoUrl || "",
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || "medium",
        categoryId: recipe.categoryId,
        ingredients: recipe.ingredients?.length > 0 
          ? recipe.ingredients 
          : [{ name: "", amount: "", unit: "", notes: "" }],
        instructions: recipe.instructions?.length > 0 
          ? (recipe.instructions.map(i => typeof i === 'string' ? { text: i, tip: "" } : i))
          : [{ text: "", tip: "" }],
        tagIds: recipe.tags?.map(t => t.id) || [],
      });
    }
  }, [recipe, isEditing, form]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to create or edit recipes",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        slug: slugify(data.title),
        authorId: user.id,
      };
      
      if (isEditing) {
        return await apiRequest("PATCH", `/api/recipes/${id}`, payload);
      } else {
        return await apiRequest("POST", "/api/recipes", payload);
      }
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      const result = await response.json();
      toast({
        title: isEditing ? "Recipe updated" : "Recipe created",
        description: isEditing 
          ? "Your recipe has been updated successfully"
          : "Your recipe has been published",
      });
      setLocation(`/recipes/${result.id || id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTagToggle = (tagId) => {
    const currentTags = form.getValues("tagIds") || [];
    if (currentTags.includes(tagId)) {
      form.setValue("tagIds", currentTags.filter(id => id !== tagId));
    } else {
      form.setValue("tagIds", [...currentTags, tagId]);
    }
  };

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (authLoading || (isEditing && loadingRecipe)) {
    return <LoadingPage message="Loading..." />;
  }

  const selectedTagIds = form.watch("tagIds") || [];

  return (
    <div className="min-h-screen pb-16">
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation(isEditing ? `/recipes/${id}` : "/recipes")}
              data-testid="button-back-form"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-xl font-bold sm:text-2xl">
                {isEditing ? "Edit Recipe" : "Create New Recipe"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Update your recipe details" : "Share your culinary creation with the world"}
              </p>
            </div>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="gap-2"
            data-testid="button-save-recipe"
          >
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving..." : (isEditing ? "Update" : "Publish")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Grandma's Famous Apple Pie" 
                          {...field} 
                          data-testid="input-recipe-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your recipe..." 
                          className="min-h-24"
                          {...field} 
                          data-testid="input-recipe-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            data-testid="input-recipe-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://youtube.com/watch?v=..." 
                            {...field} 
                            data-testid="input-recipe-video"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time (min)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            data-testid="input-prep-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (min)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            data-testid="input-cook-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            data-testid="input-servings"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag.id)}
                        data-testid={`tag-select-${tag.slug}`}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendIngredient({ name: "", amount: "", unit: "", notes: "" })}
                  className="gap-2"
                  data-testid="button-add-ingredient"
                >
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3">
                    <div className="grid flex-1 gap-3 sm:grid-cols-4">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Amount" 
                                {...field} 
                                data-testid={`input-ingredient-amount-${index}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Unit (cup, tbsp)" 
                                {...field} 
                                data-testid={`input-ingredient-unit-${index}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormControl>
                              <Input 
                                placeholder="Ingredient name *" 
                                {...field} 
                                data-testid={`input-ingredient-name-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {ingredientFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="text-destructive"
                        data-testid={`button-remove-ingredient-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Instructions</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendInstruction({ text: "", tip: "" })}
                  className="gap-2"
                  data-testid="button-add-instruction"
                >
                  <Plus className="h-4 w-4" />
                  Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructionFields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <FormField
                        control={form.control}
                        name={`instructions.${index}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe this step..." 
                                className="min-h-20"
                                {...field} 
                                data-testid={`input-instruction-text-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`instructions.${index}.tip`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Pro tip (optional)" 
                                {...field} 
                                data-testid={`input-instruction-tip-${index}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {instructionFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                        className="text-destructive"
                        data-testid={`button-remove-instruction-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation(isEditing ? `/recipes/${id}` : "/recipes")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
                className="gap-2"
                data-testid="button-submit-recipe"
              >
                <Save className="h-4 w-4" />
                {mutation.isPending ? "Saving..." : (isEditing ? "Update Recipe" : "Publish Recipe")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
