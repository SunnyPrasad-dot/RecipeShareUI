import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Plus, Menu, X, ChefHat, Heart, Calendar, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";

export function Header({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setLocation(`/recipes?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { credentials: "include" });
    } catch (error) {
      console.warn("Logout request failed", error);
    }

    queryClient.clear();
    setLocation("/");
    window.location.reload();
  };

  const navItems = [
    { href: "/recipes", label: "Browse Recipes", icon: ChefHat },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/meal-planner", label: "Meal Planner", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="hidden font-serif text-xl font-bold sm:inline-block">
              RecipeShare
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <form onSubmit={handleSearch} className="hidden w-full max-w-sm sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
                data-testid="input-search"
              />
            </div>
          </form>

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link href="/recipes/new">
                <Button size="default" className="hidden gap-2 sm:flex" data-testid="button-create-recipe">
                  <Plus className="h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.firstName, user?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user?.firstName, user?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer items-center gap-2" data-testid="link-profile">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex cursor-pointer items-center gap-2" data-testid="link-favorites-menu">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/meal-planner" className="flex cursor-pointer items-center gap-2" data-testid="link-meal-planner-menu">
                      <Calendar className="h-4 w-4" />
                      Meal Planner
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleLogout();
                    }}
                    className="flex cursor-pointer items-center gap-2 text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <a href="/login">
              <Button data-testid="button-login">Log In</Button>
            </a>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-mobile"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/recipes/new">
                <Button className="w-full justify-start gap-2" onClick={() => setIsMenuOpen(false)}>
                  <Plus className="h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
