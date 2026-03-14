import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_variants(id, size, color, price, stock),
        sellers(shop_name, shop_description, phone, address)
      `
      )
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform data
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      base_price: product.base_price,
      images: product.images || [],
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

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('[v0] Product detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
