'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!email || !password || (role === 'customer' && !name) || (role === 'seller' && !shopName)) {
      setError('Please fill all required fields')
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: role === 'customer' ? name : shopName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Create user profile
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name: role === 'customer' ? name : shopName,
        role,
      })

      if (userError && userError.code !== 'PGRST116') throw userError

      // If seller, create seller profile
      if (role === 'seller') {
        const { error: sellerError } = await supabase.from('sellers').insert({
          id: authData.user.id,
          shop_name: shopName,
        })

        if (sellerError && sellerError.code !== 'PGRST116') throw sellerError
      }

      router.push('/signup/success')
    } catch (error: unknown) {
      console.error('[v0] Signup error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-card p-8 shadow-lg border border-border">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-3xl font-bold"
              style={{ fontFamily: 'var(--font-righteous)', color: 'hsl(var(--lv-terracotta))' }}
            >
              LocalVastra
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Discover Local Fashion</p>
          </div>

          <h1 className="text-2xl font-semibold mb-2">Sign Up</h1>
          <p className="text-sm text-muted-foreground mb-6">Create your account</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-3 mb-6">
              <Label>I am a *</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" style={{ borderColor: 'hsl(var(--border))' }}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Customer</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" style={{ borderColor: 'hsl(var(--border))' }}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Seller (Shop Owner)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {role === 'customer' ? (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  placeholder="Your shop name"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeatPassword">Confirm Password *</Label>
              <Input
                id="repeatPassword"
                type="password"
                placeholder="••••••••"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              style={{
                backgroundColor: 'hsl(var(--lv-terracotta))',
                color: 'hsl(var(--lv-cream))',
              }}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
