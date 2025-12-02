import { Link } from "wouter";
import { ChefHat, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold">RecipeShare</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover, create, and share delicious recipes with a community of food enthusiasts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-social-github">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Discover</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/recipes" className="transition-colors hover:text-foreground">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=breakfast" className="transition-colors hover:text-foreground">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=lunch" className="transition-colors hover:text-foreground">
                  Lunch
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=dinner" className="transition-colors hover:text-foreground">
                  Dinner
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=desserts" className="transition-colors hover:text-foreground">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/meal-planner" className="transition-colors hover:text-foreground">
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="transition-colors hover:text-foreground">
                  Saved Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipes/new" className="transition-colors hover:text-foreground">
                  Create Recipe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/profile" className="transition-colors hover:text-foreground">
                  My Profile
                </Link>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RecipeShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
