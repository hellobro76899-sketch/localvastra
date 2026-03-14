'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSeller, setIsSeller] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('id', user.id)
        .single()
      setIsSeller(!!seller)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsSeller(false)
    router.push('/')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full shadow-md"
      style={{ background: "linear-gradient(90deg, hsl(15 45% 30%), hsl(15 55% 42%))" }}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-orange-200 drop-shadow-sm" style={{ fontFamily: "var(--font-righteous), cursive" }}>
            Local<span className="text-white">Vastra</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
            Home
          </Link>
          {user ? (
            <>
              {isSeller && (
                <Link href="/seller/dashboard" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-white/70">Hi, {user.email?.split('@')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/signup">
                <div className="flex items-center gap-1 px-4 py-1.5 text-sm font-bold bg-white/15 text-white rounded-full border border-white/30 hover:bg-white/25 transition-colors">
                  Sign Up
                </div>
              </Link>
            </>
          )}

          {/* Add Product button for sellers */}
          {isSeller && (
            <Link href="/seller/add-product">
              <div className="flex items-center gap-1 px-4 py-1.5 text-sm font-bold bg-white/25 text-white rounded-full border border-white/50 hover:bg-white/35 transition-colors">
                <Plus className="h-4 w-4" /> Add Product
              </div>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20"
            style={{ background: 'hsl(15 45% 28%)' }}
          >
            <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm text-white/90 font-semibold"
              >
                Home
              </Link>
              {user ? (
                <>
                  {isSeller && (
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="py-2 text-sm text-white/90 font-semibold"
                    >
                      Dashboard
                    </Link>
                  )}
                  {isSeller && (
                    <Link
                      href="/seller/add-product"
                      onClick={() => setMobileOpen(false)}
                      className="py-2 text-sm text-white/90 font-semibold"
                    >
                      Add Product
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="py-2 text-sm text-white/70 text-left font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm text-white/90 font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm text-orange-200 font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
