"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface ProductWithShop {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  shop?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    location?: { lat: number; lng: number };
  };
  distance?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithShop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="h-96 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/products"><Button className="mt-4">Back to Products</Button></Link>
        </div>
      </div>
    );
  }

  const img = product.images?.[0] || "https://placehold.co/600x600?text=Product";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 md:grid-cols-2"
        >
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image src={img} alt={product.name} fill className="object-cover" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.distance !== undefined && (
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {product.distance.toFixed(1)} km away
              </p>
            )}
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            {product.shop && (
              <div className="mt-6 rounded-lg border p-4">
                <h3 className="font-semibold">{product.shop.name}</h3>
                {product.shop.address && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {product.shop.address}
                  </p>
                )}
                {product.shop.phone && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    {product.shop.phone}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {product.shop?.location?.lat && product.shop?.location?.lng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${product.shop.location.lat},${product.shop.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Get Directions
                  </Button>
                </a>
              )}
              {product.shop?.phone && (
                <a href={`tel:${product.shop.phone}`}>
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Seller
                  </Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
