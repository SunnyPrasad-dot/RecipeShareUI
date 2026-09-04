import {
  users,
  categories,
  tags,
  recipes,
  recipeTags,
  favorites,
  ratings,
  comments,
  mealPlans,
  mealPlanItems
} from "@shared/schema";
import { db } from "./db.js";
import { eq, and, desc, sql, ilike, or, inArray } from "drizzle-orm";
class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserProfile(userId, data) {
    const [user] = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }
  async getCategories() {
    return await db.select().from(categories);
  }
  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }
  async getCategoryById(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  async getTags() {
    return await db.select().from(tags);
  }
  async getRecipeTags(recipeId) {
    const result = await db.select({ tag: tags }).from(recipeTags).innerJoin(tags, eq(recipeTags.tagId, tags.id)).where(eq(recipeTags.recipeId, recipeId));
    return result.map((r) => r.tag);
  }
  async getAverageRating(recipeId) {
    const result = await db.select({
      average: sql`COALESCE(AVG(${ratings.score}), 0)`,
      count: sql`COUNT(${ratings.id})`
    }).from(ratings).where(eq(ratings.recipeId, recipeId));
    return {
      average: parseFloat(result[0]?.average || "0"),
      count: parseInt(result[0]?.count || "0")
    };
  }
  async enrichRecipe(recipe) {
    const author = recipe.authorId ? await this.getUser(recipe.authorId) : null;
    const category = recipe.categoryId ? await this.getCategoryById(recipe.categoryId) : null;
    const recipeTags2 = await this.getRecipeTags(recipe.id);
    const avgRating = await this.getAverageRating(recipe.id);
    return {
      ...recipe,
      author,
      category,
      tags: recipeTags2,
      averageRating: avgRating.average,
      ratingCount: avgRating.count
    };
  }
  async getRecipes(filters = {}) {
    const conditions = [eq(recipes.isPublished, true)];
    if (filters.search) {
      conditions.push(
        or(
          ilike(recipes.title, `%${filters.search}%`),
          ilike(recipes.description, `%${filters.search}%`)
        )
      );
    }
    if (filters.categoryId) {
      conditions.push(eq(recipes.categoryId, filters.categoryId));
    }
    if (filters.difficulty) {
      conditions.push(eq(recipes.difficulty, filters.difficulty));
    }
    const result = await db.select().from(recipes).where(and(...conditions)).orderBy(desc(recipes.createdAt));
    return await Promise.all(result.map((recipe) => this.enrichRecipe(recipe)));
  }
  async getRecipeById(id) {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    if (!recipe) return null;
    return await this.enrichRecipe(recipe);
  }
  async getRecipesByAuthor(authorId) {
    const result = await db.select().from(recipes).where(eq(recipes.authorId, authorId)).orderBy(desc(recipes.createdAt));
    return await Promise.all(result.map((recipe) => this.enrichRecipe(recipe)));
  }
  async getFeaturedRecipes() {
    const result = await db.select().from(recipes).where(eq(recipes.isPublished, true)).orderBy(desc(recipes.viewCount)).limit(8);
    return await Promise.all(result.map((recipe) => this.enrichRecipe(recipe)));
  }
  async getRecentRecipes() {
    const result = await db.select().from(recipes).where(eq(recipes.isPublished, true)).orderBy(desc(recipes.createdAt)).limit(8);
    return await Promise.all(result.map((recipe) => this.enrichRecipe(recipe)));
  }
  async createRecipe(data) {
    const { tagIds, ...recipeData } = data;
    const [recipe] = await db.insert(recipes).values(recipeData).returning();
    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map(
          (tagId) => db.insert(recipeTags).values({ recipeId: recipe.id, tagId })
        )
      );
    }
    return recipe;
  }
  async updateRecipe(id, data) {
    const { tagIds, ...recipeData } = data;
    const [recipe] = await db.update(recipes).set({ ...recipeData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(recipes.id, id)).returning();
    if (tagIds !== void 0) {
      await db.delete(recipeTags).where(eq(recipeTags.recipeId, id));
      if (tagIds.length > 0) {
        await Promise.all(
          tagIds.map(
            (tagId) => db.insert(recipeTags).values({ recipeId: id, tagId })
          )
        );
      }
    }
    return recipe;
  }
  async deleteRecipe(id) {
    await db.delete(recipeTags).where(eq(recipeTags.recipeId, id));
    await db.delete(favorites).where(eq(favorites.recipeId, id));
    await db.delete(ratings).where(eq(ratings.recipeId, id));
    await db.delete(comments).where(eq(comments.recipeId, id));
    await db.delete(mealPlanItems).where(eq(mealPlanItems.recipeId, id));
    await db.delete(recipes).where(eq(recipes.id, id));
  }
  async incrementViewCount(id) {
    await db.update(recipes).set({ viewCount: sql`${recipes.viewCount} + 1` }).where(eq(recipes.id, id));
  }
  async getFavorites(userId) {
    return await db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
  }
  async getFavoriteRecipes(userId) {
    const userFavorites = await this.getFavorites(userId);
    const recipeIds = userFavorites.map((f) => f.recipeId);
    if (recipeIds.length === 0) return [];
    const result = await db.select().from(recipes).where(inArray(recipes.id, recipeIds));
    return await Promise.all(result.map((recipe) => this.enrichRecipe(recipe)));
  }
  async addFavorite(userId, recipeId) {
    const [favorite] = await db.insert(favorites).values({ userId, recipeId }).returning();
    return favorite;
  }
  async removeFavorite(userId, recipeId) {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId)));
  }
  async getRatings(recipeId) {
    return await db.select().from(ratings).where(eq(ratings.recipeId, recipeId));
  }
  async addOrUpdateRating(userId, recipeId, score) {
    const existing = await db.select().from(ratings).where(and(eq(ratings.userId, userId), eq(ratings.recipeId, recipeId)));
    if (existing.length > 0) {
      const [rating] = await db.update(ratings).set({ score }).where(and(eq(ratings.userId, userId), eq(ratings.recipeId, recipeId))).returning();
      return rating;
    } else {
      const [rating] = await db.insert(ratings).values({ userId, recipeId, score }).returning();
      return rating;
    }
  }
  async getComments(recipeId) {
    const result = await db.select().from(comments).where(eq(comments.recipeId, recipeId)).orderBy(desc(comments.createdAt));
    return await Promise.all(
      result.map(async (comment) => {
        const user = await this.getUser(comment.userId);
        return { ...comment, user };
      })
    );
  }
  async addComment(userId, recipeId, content) {
    const [comment] = await db.insert(comments).values({ userId, recipeId, content }).returning();
    const user = await this.getUser(userId);
    return { ...comment, user };
  }
  async getMealPlan(userId, weekStart) {
    const weekDate = new Date(weekStart);
    weekDate.setHours(0, 0, 0, 0);
    let [plan] = await db.select().from(mealPlans).where(
      and(
        eq(mealPlans.userId, userId),
        eq(mealPlans.weekStart, weekDate)
      )
    );
    if (!plan) {
      [plan] = await db.insert(mealPlans).values({ userId, weekStart: weekDate }).returning();
    }
    const items = await db.select().from(mealPlanItems).where(eq(mealPlanItems.mealPlanId, plan.id));
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const recipe = await this.getRecipeById(item.recipeId);
        return { ...item, recipe };
      })
    );
    return { ...plan, items: enrichedItems };
  }
  async addMealPlanItem(userId, weekStart, recipeId, dayOfWeek, mealType) {
    const plan = await this.getMealPlan(userId, weekStart);
    const [item] = await db.insert(mealPlanItems).values({ mealPlanId: plan.id, recipeId, dayOfWeek, mealType }).returning();
    const recipe = await this.getRecipeById(recipeId);
    return { ...item, recipe };
  }
  async removeMealPlanItem(itemId) {
    await db.delete(mealPlanItems).where(eq(mealPlanItems.id, itemId));
  }
  async getUserStats(userId) {
    const recipeCountResult = await db.select({ count: sql`COUNT(*)` }).from(recipes).where(eq(recipes.authorId, userId));
    const favoriteCountResult = await db.select({ count: sql`COUNT(*)` }).from(favorites).where(eq(favorites.userId, userId));
    const mealPlanCountResult = await db.select({ count: sql`COUNT(*)` }).from(mealPlans).where(eq(mealPlans.userId, userId));
    return {
      recipeCount: parseInt(recipeCountResult[0]?.count || "0"),
      favoriteCount: parseInt(favoriteCountResult[0]?.count || "0"),
      mealPlanCount: parseInt(mealPlanCountResult[0]?.count || "0")
    };
  }
}
const storage = new DatabaseStorage();
export {
  DatabaseStorage,
  storage
};
