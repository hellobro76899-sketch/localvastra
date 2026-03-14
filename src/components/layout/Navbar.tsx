"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

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
              {userProfile?.role === "seller" && (
                <Link href="/seller/dashboard" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-white/70">Hi, {user.name}</span>
              <button
                onClick={() => logout()}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
              Log In
            </Link>
          )}

          {/* Sell / Register button */}
          <Link href={user && userProfile?.role === "seller" ? "/seller/add-product" : "/signup"}>
            <div className="flex items-center gap-1 px-4 py-1.5 text-sm font-bold bg-white/15 text-white rounded-full border border-white/30 hover:bg-white/25 transition-colors">
              <Plus className="h-4 w-4" /> Register Shop
            </div>
          </Link>
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20"
            style={{ background: "hsl(15 45% 28%)" }}
          >
            <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-white/90 font-semibold">Home</Link>
              {user ? (
                <>
                  {userProfile?.role === "seller" && (
                    <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-white/90 font-semibold">Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="py-2 text-sm text-white/70 text-left font-semibold">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-white/90 font-semibold">Log In</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-orange-200 font-semibold">Sign Up as Seller</Link>
                </>
              )}
              <Link href={user && userProfile?.role === "seller" ? "/seller/add-product" : "/signup"} onClick={() => setMobileOpen(false)}>
                <div className="mt-2 bg-white/15 text-white rounded-full py-2 text-center font-bold flex justify-center items-center gap-1 border border-white/30">
                  <Plus className="h-5 w-5" /> Register Shop
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
