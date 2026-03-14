"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function ManageProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", user.id);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("[v0] Error fetching products:", error);
        toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, supabase, toast]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      // Delete variants first
      await supabase.from("product_variants").delete().eq("product_id", deleteId);

      // Delete product
      const { error } = await supabase.from("products").delete().eq("id", deleteId);

      if (error) throw error;

      setProducts((p) => p.filter((x) => x.id !== deleteId));
      setDeleteId(null);
      toast({ title: "Success", description: "Product deleted" });
    } catch (error) {
      console.error("[v0] Delete error:", error);
      toast({ title: "Error", description: "Could not delete product", variant: "destructive" });
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products yet. Add your first product.</p>
          <Link href="/seller/add-product">
            <Button>Add Product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={p.images?.[0] || "https://via.placeholder.com/400x300?text=Product"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{p.name}</h3>
                <p className="text-primary font-bold">₹{p.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground capitalize">{p.category}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/products/${p.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/seller/edit-product/${p.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(p.id)} className="flex-1">
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
            <DialogDescription>This will permanently delete the product and all its variants. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
