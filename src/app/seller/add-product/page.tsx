'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2, X } from 'lucide-react'

interface Variant {
  size: string
  color: string
  stock: number
  price: number
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Orange',
  'Navy',
  'Grey',
]
const CATEGORIES = ['mens', 'womens']

export default function AddProductPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [category, setCategory] = useState('')
  const [variants, setVariants] = useState<Variant[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { size: '', color: '', stock: 0, price: parseFloat(basePrice) || 0 },
    ])
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim()
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url])
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      return
    }

    if (!name.trim() || !description.trim() || !category || variants.length === 0) {
      setError('Fill all required fields and add at least one variant')
      return
    }

    setLoading(true)
    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          description: description.trim(),
          base_price: parseFloat(basePrice) || 0,
          category: category.toLowerCase(),
          images: imageUrls,
          seller_id: user.id,
        })
        .select()
        .single()

      if (productError) throw productError

      // Create variants
      const variantData = variants.map((v) => ({
        product_id: product.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        price: v.price,
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantData)

      if (variantError) throw variantError

      router.push('/seller/manage-products')
    } catch (err) {
      console.error('[v0] Error adding product:', err)
      setError(err instanceof Error ? err.message : 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Product Details</h2>

          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Premium Cotton Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice">Base Price (₹) *</Label>
              <Input
                id="basePrice"
                type="number"
                placeholder="999"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Images</h2>
          <div>
            <Label htmlFor="imageUrl">Add Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              onKeyPress={(e) => e.key === "Enter" && handleImageUrl(e as any)}
              onBlur={(e) => handleImageUrl(e)}
            />
          </div>
          {imageUrls.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Added Images ({imageUrls.length})</p>
              <div className="space-y-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Variants (Size & Color)</h2>
            <Button type="button" onClick={handleAddVariant} variant="outline">
              Add Variant
            </Button>
          </div>

          {variants.length === 0 ? (
            <p className="text-muted-foreground text-sm">Add at least one variant for your product</p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-sm">Size</Label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-background text-foreground text-sm"
                        required
                      >
                        <option value="">Select size</option>
                        {SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm">Color</Label>
                      <select
                        value={variant.color}
                        onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-background text-foreground text-sm"
                        required
                      >
                        <option value="">Select color</option>
                        {COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm">Stock</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(idx, "stock", parseInt(e.target.value) || 0)}
                        className="text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Price (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value) || 0)}
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove Variant
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
