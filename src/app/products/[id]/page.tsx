'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, ChevronLeft } from 'lucide-react'

interface ProductDetail {
  id: string
  name: string
  description: string
  category: string
  base_price: number
  images: string[]
  seller_id: string
  seller: {
    shop_name: string
    shop_description: string
    phone: string
    address: string
  }
  variants: Array<{
    id: string
    size: string
    color: string
    price: number
    stock: number
  }>
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      if (!response.ok) throw new Error('Product not found')
      const data = await response.json()
      setProduct(data)
      // Set default selections
      if (data.variants?.length > 0) {
        setSelectedSize(data.variants[0].size)
        setSelectedColor(data.variants[0].color)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-8 bg-muted w-2/3 rounded" />
            <div className="h-4 bg-muted w-1/2 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map((v) => v.size))]
  const colors = [...new Set(product.variants.map((v) => v.color))]

  // Get available variants for selected size
  const availableVariants = product.variants.filter(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  )

  // Get current price
  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )
  const currentPrice = currentVariant?.price || product.base_price
  const currentStock = currentVariant?.stock || 0
  const inStock = currentStock > 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: 'hsl(var(--lv-terracotta))' }}>
                ₹{currentPrice}
              </span>
              {currentPrice !== product.base_price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.base_price}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {inStock ? (
                <div
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: 'hsl(var(--lv-green))' }}
                >
                  ✓ In Stock ({currentStock} available)
                </div>
              ) : (
                <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-destructive bg-destructive/10">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Size *
                </label>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Color *
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              className="w-full h-12 text-base"
              style={{
                backgroundColor: inStock ? 'hsl(var(--lv-terracotta))' : '#ccc',
                cursor: inStock ? 'pointer' : 'not-allowed',
              }}
              disabled={!inStock}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Seller Info */}
            <div
              className="p-4 rounded-lg border border-border space-y-3"
            >
              <h3 className="font-semibold text-lg">{product.seller.shop_name}</h3>
              {product.seller.shop_description && (
                <p className="text-sm text-muted-foreground">
                  {product.seller.shop_description}
                </p>
              )}
              <div className="space-y-2 text-sm">
                {product.seller.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span>{product.seller.address}</span>
                  </div>
                )}
                {product.seller.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{product.seller.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
