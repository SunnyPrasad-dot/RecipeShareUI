import { db } from "./db.js";
import { categories, tags } from "@shared/schema.js";

const defaultCategories = [
  { name: "Breakfast", slug: "breakfast", icon: "croissant" },
  { name: "Lunch", slug: "lunch", icon: "sandwich" },
  { name: "Dinner", slug: "dinner", icon: "utensils" },
  { name: "Desserts", slug: "desserts", icon: "cake" },
  { name: "Soups", slug: "soups", icon: "soup" },
  { name: "Salads", slug: "salads", icon: "salad" },
  { name: "Snacks", slug: "snacks", icon: "cookie" },
  { name: "Drinks", slug: "drinks", icon: "wine" },
];

const defaultTags = [
  { name: "Vegan", slug: "vegan", color: "green" },
  { name: "Vegetarian", slug: "vegetarian", color: "lime" },
  { name: "Gluten-Free", slug: "gluten-free", color: "amber" },
  { name: "Dairy-Free", slug: "dairy-free", color: "blue" },
  { name: "Quick Meal", slug: "quick-meal", color: "orange" },
  { name: "Low Carb", slug: "low-carb", color: "purple" },
  { name: "High Protein", slug: "high-protein", color: "red" },
  { name: "Healthy", slug: "healthy", color: "teal" },
  { name: "Comfort Food", slug: "comfort", color: "rose" },
  { name: "Spicy", slug: "spicy", color: "red" },
];

async function seed() {
  console.log("Seeding database...");

  try {
    // Insert categories
    for (const category of defaultCategories) {
      await db
        .insert(categories)
        .values(category)
        .onConflictDoNothing({ target: categories.slug });
    }
    console.log("Categories seeded");

    // Insert tags
    for (const tag of defaultTags) {
      await db
        .insert(tags)
        .values(tag)
        .onConflictDoNothing({ target: tags.slug });
    }
    console.log("Tags seeded");

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
