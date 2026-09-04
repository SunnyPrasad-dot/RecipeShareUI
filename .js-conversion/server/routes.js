import { storage } from "./storage.js";
import { setupAuth, isAuthenticated } from "./replitAuth.js";
async function registerRoutes(httpServer, app) {
  await setupAuth(app);
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });
  app.get("/api/recipes", async (req, res) => {
    try {
      const { search, category, sort, tags, difficulty } = req.query;
      let categoryId;
      if (category) {
        const cat = await storage.getCategoryBySlug(category);
        categoryId = cat?.id;
      }
      const recipes = await storage.getRecipes({
        search,
        categoryId,
        difficulty
      });
      let sortedRecipes = [...recipes];
      if (sort === "popular") {
        sortedRecipes.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      } else if (sort === "rating") {
        sortedRecipes.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      } else if (sort === "quick") {
        sortedRecipes.sort((a, b) => {
          const aTime = (a.prepTime || 0) + (a.cookTime || 0);
          const bTime = (b.prepTime || 0) + (b.cookTime || 0);
          return aTime - bTime;
        });
      }
      res.json(sortedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  app.get("/api/recipes/featured", async (req, res) => {
    try {
      const recipes = await storage.getFeaturedRecipes();
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching featured recipes:", error);
      res.status(500).json({ message: "Failed to fetch featured recipes" });
    }
  });
  app.get("/api/recipes/recent", async (req, res) => {
    try {
      const recipes = await storage.getRecentRecipes();
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recent recipes:", error);
      res.status(500).json({ message: "Failed to fetch recent recipes" });
    }
  });
  app.get("/api/recipes/my", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipes = await storage.getRecipesByAuthor(userId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipeById(parseInt(req.params.id));
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      await storage.incrementViewCount(recipe.id);
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  app.post("/api/recipes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipe = await storage.createRecipe({
        ...req.body,
        authorId: userId
      });
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  app.patch("/api/recipes/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      const existing = await storage.getRecipeById(recipeId);
      if (!existing) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (existing.authorId !== userId) {
        return res.status(403).json({ message: "Not authorized to edit this recipe" });
      }
      const recipe = await storage.updateRecipe(recipeId, req.body);
      res.json(recipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  app.delete("/api/recipes/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      const existing = await storage.getRecipeById(recipeId);
      if (!existing) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (existing.authorId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this recipe" });
      }
      await storage.deleteRecipe(recipeId);
      res.json({ message: "Recipe deleted" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });
  app.get("/api/recipes/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(parseInt(req.params.id));
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app.post("/api/recipes/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      const { content } = req.body;
      const comment = await storage.addComment(userId, recipeId, content);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });
  app.get("/api/recipes/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatings(parseInt(req.params.id));
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });
  app.post("/api/recipes/:id/ratings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      const { score } = req.body;
      const rating = await storage.addOrUpdateRating(userId, recipeId, score);
      res.json(rating);
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ message: "Failed to add rating" });
    }
  });
  app.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  app.get("/api/favorites/recipes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipes = await storage.getFavoriteRecipes(userId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      res.status(500).json({ message: "Failed to fetch favorite recipes" });
    }
  });
  app.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { recipeId } = req.body;
      const favorite = await storage.addFavorite(userId, recipeId);
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  app.delete("/api/favorites/:recipeId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.recipeId);
      await storage.removeFavorite(userId, recipeId);
      res.json({ message: "Favorite removed" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  app.get("/api/meal-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { weekStart } = req.query;
      if (!weekStart) {
        return res.status(400).json({ message: "weekStart is required" });
      }
      const mealPlan = await storage.getMealPlan(userId, weekStart);
      res.json(mealPlan);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      res.status(500).json({ message: "Failed to fetch meal plan" });
    }
  });
  app.post("/api/meal-plans/items", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { weekStart, recipeId, dayOfWeek, mealType } = req.body;
      const item = await storage.addMealPlanItem(userId, weekStart, recipeId, dayOfWeek, mealType);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding meal plan item:", error);
      res.status(500).json({ message: "Failed to add meal plan item" });
    }
  });
  app.delete("/api/meal-plans/items/:itemId", isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      await storage.removeMealPlanItem(itemId);
      res.json({ message: "Item removed" });
    } catch (error) {
      console.error("Error removing meal plan item:", error);
      res.status(500).json({ message: "Failed to remove meal plan item" });
    }
  });
  app.patch("/api/users/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bio } = req.body;
      const user = await storage.updateUserProfile(userId, { bio });
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app.get("/api/users/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  return httpServer;
}
export {
  registerRoutes
};
