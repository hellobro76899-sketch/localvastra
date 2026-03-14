"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Store, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, hasShop: false });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/seller/products?uid=" + user.uid).then((r) => r.json()),
      fetch("/api/seller/shop?uid=" + user.uid).then((r) => r.json()),
    ])
      .then(([products, shop]) => {
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          hasShop: !!shop?.id,
        });
      })
      .catch(() => {});
  }, [user]);

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your shop and products</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.products}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </div>
          <Link href="/seller/manage-products">
            <Button variant="outline" size="sm" className="mt-4">View all</Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.hasShop ? "Configured" : "Not set"}</p>
              <p className="text-sm text-muted-foreground">Shop Profile</p>
            </div>
          </div>
          <Link href="/seller/shop-profile">
            <Button variant="outline" size="sm" className="mt-4">
              {stats.hasShop ? "Edit" : "Set up"}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">+ Add</p>
              <p className="text-sm text-muted-foreground">New Product</p>
            </div>
          </div>
          <Link href="/seller/add-product">
            <Button size="sm" className="mt-4">Add Product</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
