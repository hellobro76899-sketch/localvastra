"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/types";

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<{ id: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/seller/shop?uid=" + user.uid)
      .then((r) => r.json())
      .then((data) => setShop(data?.id ? data : null));
  }, [user]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((p) => [...p, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, j) => j !== i));
    setPreviews((prev) => prev.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shop) {
      toast({ title: "Error", description: "Create a shop profile first", variant: "destructive" });
      return;
    }
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) {
      toast({ title: "Error", description: "Invalid price", variant: "destructive" });
      return;
    }
    if (!name.trim() || !category) {
      toast({ title: "Error", description: "Fill required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", "products");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }

      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user.uid,
          shopId: shop.id,
          name: name.trim(),
          description: description.trim(),
          price: p,
          category: category.toLowerCase(),
          images: uploadedUrls,
          inStock,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      toast({ title: "Success", description: "Product added" });
      router.push("/seller/manage-products");
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!shop) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Set up your shop profile first.</p>
        <Button className="mt-4" onClick={() => router.push("/seller/shop-profile")}>Go to Shop Profile</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-6">
        Add Product
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="name">Product name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Stock</Label>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            <span>In Stock</span>
          </label>
        </div>
        <div>
          <Label>Images</Label>
          <div
            className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer hover:bg-muted/50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles({ target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <input type="file" accept="image/*" multiple className="hidden" id="upload" onChange={handleFiles} />
            <label htmlFor="upload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
            </label>
          </div>
          {previews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {previews.map((url, i) => (
                <div key={i} className="relative">
                  <Image src={url} alt="" width={96} height={96} className="h-24 w-24 rounded object-cover" unoptimized />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</Button>
      </motion.form>
    </div>
  );
}
