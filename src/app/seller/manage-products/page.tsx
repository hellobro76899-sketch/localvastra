"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  inStock: boolean;
}

export default function ManageProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/seller/products?uid=" + user.uid)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/seller/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((p) => p.filter((x) => x.id !== deleteId));
      setDeleteId(null);
      toast({ title: "Deleted", description: "Product removed" });
    } catch {
      toast({ title: "Error", description: "Could not delete", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link href="/seller/add-product">
          <Button>Add Product</Button>
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first product.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card overflow-hidden"
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={p.images?.[0] || "https://placehold.co/400x400?text=Product"}
                  alt={p.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-primary font-bold">₹{p.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{p.inStock ? "In Stock" : "Out of Stock"}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/products/${p.id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={`/seller/edit-product/${p.id}`}>
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
