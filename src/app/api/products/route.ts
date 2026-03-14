import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')?.toLowerCase() || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    let query = supabase.from('products').select(
      `
      id,
      name,
      description,
      category,
      base_price,
      images,
      created_at,
      updated_at,
      seller_id,
      sellers(shop_name, shop_description, phone, address),
      product_variants(id, size, color, price, stock)
    `
    )

    if (category && category.toLowerCase() !== 'all') {
      query = query.ilike('category', category)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    query = query.limit(limit)

    const { data: products, error } = await query

    if (error) throw error

    // Transform data
    const formattedProducts = products?.map((product: any) => {
      // Find minimum price from variants
      const variantPrices = product.product_variants?.map(
        (v: any) => v.price
      ) || []
      const minPrice =
        variantPrices.length > 0
          ? Math.min(...variantPrices)
          : product.base_price

      // Check if in stock
      const inStock =
        product.product_variants?.some((v: any) => v.stock > 0) || false

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: minPrice,
        base_price: product.base_price,
        images: product.images || [],
        inStock,
        created_at: product.created_at,
        updated_at: product.updated_at,
        seller_id: product.seller_id,
        seller: product.sellers
          ? {
              id: product.seller_id,
              shop_name: product.sellers.shop_name,
              shop_description: product.sellers.shop_description,
              phone: product.sellers.phone,
              address: product.sellers.address,
            }
          : null,
        variants: product.product_variants || [],
      }
    })

    return NextResponse.json(formattedProducts || [])
  } catch (error) {
    console.error('[v0] Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
