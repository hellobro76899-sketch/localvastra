import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get seller products
    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_variants(id, size, color, price, stock)
      `
      )
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(products)
  } catch (error) {
    console.error('[v0] Fetch products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if seller
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!seller) {
      return NextResponse.json(
        { error: 'Not a seller' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, category, base_price, images, variants } = body

    // Validate input
    if (!name || !category || base_price === null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        name,
        description,
        category,
        base_price,
        images: images || [],
      })
      .select()
      .single()

    if (productError) throw productError

    // Create variants
    if (variants && variants.length > 0) {
      const variantData = variants.map((v: any) => ({
        product_id: product.id,
        size: v.size,
        color: v.color,
        price: v.price || base_price,
        stock: v.stock || 0,
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantData)

      if (variantError) throw variantError
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[v0] Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
