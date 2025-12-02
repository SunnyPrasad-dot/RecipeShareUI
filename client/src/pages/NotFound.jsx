import { Link } from "wouter";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <span className="text-8xl font-bold text-muted-foreground/30">404</span>
      </div>
      <h1 className="mb-4 font-serif text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Oops! The page you're looking for doesn't exist or has been moved. 
        Let's get you back to discovering delicious recipes.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button className="gap-2" data-testid="button-go-home">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/recipes">
          <Button variant="outline" className="gap-2" data-testid="button-browse">
            <Search className="h-4 w-4" />
            Browse Recipes
          </Button>
        </Link>
      </div>
    </div>
  );
}
