import { Link } from "wouter";
import { Search, ChefHat, Heart, Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: ChefHat,
      title: "Share Your Recipes",
      description: "Create and share your favorite recipes with a passionate community of home chefs.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Bookmark recipes you love for quick access anytime, anywhere.",
    },
    {
      icon: Calendar,
      title: "Meal Planning",
      description: "Plan your weekly meals with our intuitive meal planner feature.",
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with food enthusiasts, share tips, and discover new cuisines.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Home Chef",
      content: "RecipeShare has transformed how I organize and share my recipes. The meal planner is a game-changer!",
      rating: 5,
    },
    {
      name: "Michael R.",
      role: "Food Blogger",
      content: "The community here is amazing. I've discovered so many incredible recipes from talented home cooks.",
      rating: 5,
    },
    {
      name: "Emily K.",
      role: "Busy Mom",
      content: "Planning meals for my family has never been easier. I love the bookmark feature!",
      rating: 5,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recipes?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80')] bg-cover bg-center opacity-10" />
        
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ChefHat className="h-4 w-4" />
              Welcome to RecipeShare
            </div>
            
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Discover, Create &{" "}
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Share Delicious
              </span>{" "}
              Recipes
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Join a community of food enthusiasts. Find inspiring recipes, save your favorites, 
              and plan your meals for the week.
            </p>
            
            <form onSubmit={handleSearch} className="mx-auto mb-8 flex max-w-lg gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg"
                  data-testid="input-hero-search"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8" data-testid="button-hero-search">
                Search
              </Button>
            </form>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/api/login">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/recipes">
                <Button variant="outline" size="lg" data-testid="button-browse-recipes">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl">
              Everything You Need to Cook Better
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From discovering new recipes to planning your meals, we've got you covered.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-elevate">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl">
              What Our Community Says
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of happy home chefs who love using RecipeShare.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl">
              Ready to Start Cooking?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join RecipeShare today and become part of our growing community of food lovers.
            </p>
            <a href="/api/login">
              <Button size="lg" className="gap-2" data-testid="button-join-now">
                Join Now - It's Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
