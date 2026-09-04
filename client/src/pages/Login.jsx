import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChefHat, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please enter your name, email, and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({ name: name.trim(), email: email.trim() });
      await fetch(`/api/login?${params.toString()}`, { credentials: "include" });
      queryClient.clear();
      setLocation("/");
      window.location.reload();
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ChefHat className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="font-serif text-3xl">Welcome back</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to save recipes and plan your meals.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" className="pr-11" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
              Demo mode: password can be any value.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">Back to home</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
