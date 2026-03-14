"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Store, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState({
    products: 0,
    totalRevenue: 0,
    orders: 0,
    shopConfigured: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch product count
        const { data: products, error: productError } = await supabase
          .from("products")
          .select("id", { count: "exact" })
          .eq("seller_id", user.id);

        // Fetch seller info
        const { data: seller, error: sellerError } = await supabase
          .from("sellers")
          .select("*")
          .eq("id", user.id)
          .single();

        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total_amount")
          .eq("seller_id", user.id);

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        setStats({
          products: products?.length || 0,
          totalRevenue,
          orders: orders?.length || 0,
          shopConfigured: !!seller?.shop_name,
        });
      } catch (error) {
        console.error("[v0] Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your shop and products</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Products Card */}
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
            <Button variant="outline" size="sm" className="mt-4">
              View All
            </Button>
          </Link>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.orders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </motion.div>

        {/* Shop Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.shopConfigured ? "✓" : "○"}</p>
              <p className="text-sm text-muted-foreground">Shop Profile</p>
            </div>
          </div>
          <Link href="/seller/shop-profile">
            <Button variant="outline" size="sm" className="mt-4">
              {stats.shopConfigured ? "Edit" : "Set up"}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/seller/add-product">
            <Button>Add New Product</Button>
          </Link>
          <Link href="/seller/manage-products">
            <Button variant="outline">Manage Products</Button>
          </Link>
          <Link href="/seller/shop-profile">
            <Button variant="outline">Edit Shop Profile</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
