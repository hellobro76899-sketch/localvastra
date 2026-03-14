"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BounceIn } from "@/components/ui/animations";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({ title: "Error", description: "Fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Success", description: "Logged in successfully" });
      router.push("/");
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast({ title: "Error", description: "Enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(forgotEmail);
      toast({ title: "Success", description: "Check your email for reset link" });
      setShowForgot(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BounceIn className="w-full max-w-md">
      <div className="rounded-xl folk-border bg-card p-6 shadow-lg">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-orange-800" style={{ fontFamily: "var(--font-righteous)" }}>LocalVastra</Link>
        </div>

        {!showForgot ? (
          <>
            <h1 className="text-xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="button" className="text-sm text-primary hover:underline" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
                Back to Login
              </Button>
            </form>
          </>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </BounceIn>
  );
}
