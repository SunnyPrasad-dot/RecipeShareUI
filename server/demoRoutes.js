const demoUser = {
  id: "demo-user",
  email: "demo@recipeshare.local",
  firstName: "Demo",
  lastName: "Chef",
  profileImageUrl: null,
  bio: "Exploring RecipeShare in local demo mode."
};
const categories = [
  { id: 1, name: "Breakfast", slug: "breakfast", icon: "croissant" },
  { id: 2, name: "Lunch", slug: "lunch", icon: "sandwich" },
  { id: 3, name: "Dinner", slug: "dinner", icon: "utensils" },
  { id: 4, name: "Desserts", slug: "desserts", icon: "cake" },
  { id: 5, name: "Soups", slug: "soups", icon: "soup" },
  { id: 6, name: "Salads", slug: "salads", icon: "salad" },
  { id: 7, name: "Snacks", slug: "snacks", icon: "cookie" },
  { id: 8, name: "Drinks", slug: "drinks", icon: "wine" }
];
const tags = [
  { id: 1, name: "Quick Meal", slug: "quick-meal", color: "orange" },
  { id: 2, name: "Healthy", slug: "healthy", color: "teal" },
  { id: 3, name: "Vegetarian", slug: "vegetarian", color: "lime" },
  { id: 4, name: "Vegan", slug: "vegan", color: "green" },
  { id: 5, name: "Gluten-Free", slug: "gluten-free", color: "amber" },
  { id: 6, name: "High Protein", slug: "high-protein", color: "red" },
  { id: 7, name: "Comfort Food", slug: "comfort", color: "rose" },
  { id: 8, name: "Spicy", slug: "spicy", color: "red" }
];
const recipes = [
  {
    id: 1,
    title: "Golden Vegetable Pasta",
    slug: "golden-vegetable-pasta",
    description: "A quick, colorful pasta dinner for busy evenings.",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    categoryId: 3,
    category: categories[2],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[0], tags[1]],
    ingredients: [{ name: "Pasta", amount: "300", unit: "g" }, { name: "Seasonal vegetables", amount: "2", unit: "cups" }],
    instructions: [{ text: "Cook pasta until al dente." }, { text: "Saute vegetables and toss with pasta." }],
    isPublished: true,
    viewCount: 128,
    averageRating: 4.8,
    ratingCount: 12
  },
  {
    id: 2,
    title: "Berry Breakfast Bowl",
    slug: "berry-breakfast-bowl",
    description: "Creamy yogurt, berries, and crunchy granola.",
    imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&q=80",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
    categoryId: 1,
    category: categories[0],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[1], tags[2]],
    ingredients: [{ name: "Greek yogurt", amount: "2", unit: "cups" }, { name: "Mixed berries", amount: "1", unit: "cup" }],
    instructions: [{ text: "Layer yogurt, berries, and granola in bowls." }],
    isPublished: true,
    viewCount: 94,
    averageRating: 4.6,
    ratingCount: 8
  },
  {
    id: 3,
    title: "Smoky Tomato Shakshuka",
    slug: "smoky-tomato-shakshuka",
    description: "Jammy tomatoes, warm spices, and baked eggs served with crusty bread.",
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=900&q=80",
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    difficulty: "medium",
    categoryId: 1,
    category: categories[0],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[2], tags[7]],
    ingredients: [{ name: "Eggs", amount: "6", unit: "large" }, { name: "Crushed tomatoes", amount: "2", unit: "cups" }],
    instructions: [{ text: "Simmer tomatoes with paprika and cumin." }, { text: "Make wells, add eggs, and cover until set." }],
    isPublished: true,
    viewCount: 186,
    averageRating: 4.9,
    ratingCount: 21
  },
  {
    id: 4,
    title: "Crispy Green Goddess Salad",
    slug: "crispy-green-goddess-salad",
    description: "Crunchy greens, avocado, herbs, and a bright lemon dressing.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80",
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
    categoryId: 6,
    category: categories[5],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[1], tags[3], tags[4]],
    ingredients: [{ name: "Romaine lettuce", amount: "2", unit: "heads" }, { name: "Avocado", amount: "1", unit: "ripe" }],
    instructions: [{ text: "Whisk the dressing until smooth." }, { text: "Toss greens and vegetables just before serving." }],
    isPublished: true,
    viewCount: 76,
    averageRating: 4.5,
    ratingCount: 6
  },
  {
    id: 5,
    title: "Coconut Lentil Curry",
    slug: "coconut-lentil-curry",
    description: "A silky, fragrant curry with red lentils and coconut milk.",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80",
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: "medium",
    categoryId: 3,
    category: categories[2],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[3], tags[6], tags[7]],
    ingredients: [{ name: "Red lentils", amount: "1", unit: "cup" }, { name: "Coconut milk", amount: "1", unit: "can" }],
    instructions: [{ text: "Toast spices in oil until fragrant." }, { text: "Add lentils and coconut milk, then simmer until tender." }],
    isPublished: true,
    viewCount: 212,
    averageRating: 4.7,
    ratingCount: 17
  },
  {
    id: 6,
    title: "Miso Sesame Ramen",
    slug: "miso-sesame-ramen",
    description: "A cozy bowl of noodles with miso broth, mushrooms, and greens.",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: "medium",
    categoryId: 5,
    category: categories[4],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[0], tags[2], tags[7]],
    ingredients: [{ name: "Ramen noodles", amount: "2", unit: "packs" }, { name: "White miso", amount: "2", unit: "tbsp" }],
    instructions: [{ text: "Build the miso broth with stock and sesame paste." }, { text: "Cook noodles separately and combine with toppings." }],
    isPublished: true,
    viewCount: 164,
    averageRating: 4.8,
    ratingCount: 14
  },
  {
    id: 7,
    title: "Honey Cinnamon Granola",
    slug: "honey-cinnamon-granola",
    description: "Golden clusters of oats, nuts, seeds, and warm cinnamon.",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=80",
    prepTime: 10,
    cookTime: 25,
    servings: 8,
    difficulty: "easy",
    categoryId: 7,
    category: categories[6],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[1], tags[2]],
    ingredients: [{ name: "Rolled oats", amount: "3", unit: "cups" }, { name: "Honey", amount: "1/3", unit: "cup" }],
    instructions: [{ text: "Mix oats, nuts, cinnamon, and honey." }, { text: "Bake until crisp and cool completely before storing." }],
    isPublished: true,
    viewCount: 59,
    averageRating: 4.4,
    ratingCount: 5
  },
  {
    id: 8,
    title: "Mango Lime Cooler",
    slug: "mango-lime-cooler",
    description: "A bright tropical cooler with fresh mango, lime, and mint.",
    imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=900&q=80",
    prepTime: 8,
    cookTime: 0,
    servings: 4,
    difficulty: "easy",
    categoryId: 8,
    category: categories[7],
    authorId: demoUser.id,
    author: demoUser,
    tags: [tags[3], tags[1]],
    ingredients: [{ name: "Mango", amount: "2", unit: "ripe" }, { name: "Lime juice", amount: "1/4", unit: "cup" }],
    instructions: [{ text: "Blend mango, lime, mint, and chilled water." }, { text: "Serve over ice with a lime wedge." }],
    isPublished: true,
    viewCount: 88,
    averageRating: 4.6,
    ratingCount: 7
  }
];
let favorites = [{ id: 1, userId: demoUser.id, recipeId: 1 }];
let demoLoggedIn = false;
let mealPlanItems = [
  { id: 1, recipeId: 1, dayOfWeek: 1, mealType: "dinner", weekStart: null, recipe: recipes[0] },
  { id: 2, recipeId: 2, dayOfWeek: 2, mealType: "breakfast", weekStart: null, recipe: recipes[1] },
  { id: 3, recipeId: 5, dayOfWeek: 4, mealType: "dinner", weekStart: null, recipe: recipes[4] }
];
let nextMealItemId = 4;
function registerDemoRoutes(app) {
  app.get("/api/auth/user", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(demoLoggedIn ? demoUser : null);
  });
  app.get("/api/login", (req, res) => {
    const name = String(req.query.name || "").trim();
    const email = String(req.query.email || "").trim();
    if (name) {
      const nameParts = name.split(/\s+/);
      demoUser.firstName = nameParts.shift();
      demoUser.lastName = nameParts.join(" ");
    }
    if (email) demoUser.email = email;
    demoLoggedIn = true;
    res.redirect("/");
  });
  app.get("/api/logout", (_req, res) => {
    demoLoggedIn = false;
    res.redirect("/");
  });
  app.get("/api/categories", (_req, res) => res.json(categories));
  app.get("/api/tags", (_req, res) => res.json(tags));
  app.get("/api/recipes", (req, res) => {
    const { search, category, difficulty, sort } = req.query;
    let result = recipes.filter((recipe) => {
      const matchesSearch = !search || `${recipe.title} ${recipe.description}`.toLowerCase().includes(String(search).toLowerCase());
      const matchesCategory = !category || recipe.category.slug === category;
      const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
    if (sort === "popular") result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    if (sort === "rating") result = [...result].sort((a, b) => b.averageRating - a.averageRating);
    if (sort === "quick") result = [...result].sort((a, b) => a.prepTime + a.cookTime - b.prepTime - b.cookTime);
    res.json(result);
  });
  app.get("/api/recipes/featured", (_req, res) => res.json(recipes.slice(0, 2)));
  app.get("/api/recipes/recent", (_req, res) => res.json(recipes.slice(0, 2)));
  app.get("/api/recipes/my", (_req, res) => res.json(recipes));
  app.get("/api/recipes/:id", (req, res) => {
    const recipe = recipes.find((item) => item.id === Number(req.params.id));
    recipe ? res.json(recipe) : res.status(404).json({ message: "Recipe not found" });
  });
  app.get("/api/recipes/:id/comments", (req, res) => {
    const recipe = recipes.find((item) => item.id === Number(req.params.id));
    res.json(recipe ? [{ id: 1, content: "This is now a family favorite!", user: demoUser, createdAt: (/* @__PURE__ */ new Date()).toISOString() }] : []);
  });
  app.get("/api/recipes/:id/ratings", (req, res) => {
    const recipe = recipes.find((item) => item.id === Number(req.params.id));
    res.json(recipe ? [{ id: 1, score: Math.round(recipe.averageRating), user: demoUser }] : []);
  });
  app.post("/api/recipes/:id/comments", (req, res) => {
    res.status(201).json({ id: Date.now(), content: req.body.content, user: demoUser, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/recipes/:id/ratings", (req, res) => {
    res.json({ id: Date.now(), score: Number(req.body.score), user: demoUser });
  });
  app.get("/api/favorites", (_req, res) => res.json(favorites));
  app.get("/api/favorites/recipes", (_req, res) => res.json(favorites.map((favorite) => recipes.find((recipe) => recipe.id === favorite.recipeId)).filter(Boolean)));
  app.post("/api/favorites", (req, res) => {
    const recipeId = Number(req.body.recipeId);
    if (!favorites.some((favorite) => favorite.recipeId === recipeId)) favorites.push({ id: favorites.length + 1, userId: demoUser.id, recipeId });
    res.status(201).json({ message: "Favorite added" });
  });
  app.delete("/api/favorites/:recipeId", (req, res) => {
    favorites = favorites.filter((favorite) => favorite.recipeId !== Number(req.params.recipeId));
    res.json({ message: "Favorite removed" });
  });
  app.get("/api/meal-plans", (req, res) => {
    const { weekStart } = req.query;
    const filteredItems = weekStart
      ? mealPlanItems.filter((item) => item.weekStart === weekStart || item.weekStart === null)
      : mealPlanItems;
    res.json({ id: 1, items: filteredItems });
  });
  app.post("/api/meal-plans/items", (req, res) => {
    const recipe = recipes.find((item2) => item2.id === Number(req.body.recipeId));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    const item = {
      id: nextMealItemId++,
      recipeId: recipe.id,
      dayOfWeek: Number(req.body.dayOfWeek),
      mealType: req.body.mealType,
      weekStart: req.body.weekStart || null,
      recipe
    };
    mealPlanItems.push(item);
    res.status(201).json(item);
  });
  app.delete("/api/meal-plans/items/:itemId", (req, res) => {
    mealPlanItems = mealPlanItems.filter((item) => item.id !== Number(req.params.itemId));
    res.json({ message: "Item removed" });
  });
  app.get("/api/users/stats", (_req, res) => res.json({ recipeCount: recipes.length, favoriteCount: favorites.length, mealPlanCount: mealPlanItems.length }));
  app.patch("/api/users/profile", (_req, res) => res.json(demoUser));
}
export {
  registerDemoRoutes
};
