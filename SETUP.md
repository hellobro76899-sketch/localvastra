# LocalVastra E-Commerce Platform - Setup Guide

## Overview
A complete full-stack e-commerce platform built with Next.js 16, Supabase, and Tailwind CSS. Supports multiple sellers managing products with size/color variants.

## Database Schema

### Key Tables
- **users**: User profiles (customers and sellers)
- **sellers**: Extended seller information (shop name, description, address)
- **products**: Product listings with base price and category
- **product_variants**: Size/color combinations with individual prices and stock
- **orders**: Order management (pending, completed, etc.)
- **order_items**: Individual items in orders

### Categories
- Mens
- Womens
- All (displays all products)

### Sizes
XS, S, M, L, XL, XXL

## Key Features

### For Customers
1. **Home Page** - Browse products by category with search
2. **Product Details** - View product info, select size/color variants, seller details
3. **Authentication** - Sign up and login with email/password
4. **User Dashboard** - View profile and logged-in status

### For Sellers
1. **Seller Dashboard** - View stats (products, revenue, orders)
2. **Add Products** - Create products with:
   - Basic info (name, description, category, base price)
   - Multiple product images (via URLs)
   - Size & color variants with individual pricing and stock levels
3. **Manage Products** - Edit/delete products and variants
4. **Shop Profile** - Configure shop information
5. **Analytics** - Track revenue and order metrics

## Database Setup

The database schema is defined in `/scripts/001_create_tables.sql`. To set it up:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the contents of `scripts/001_create_tables.sql`
5. Execute the query

This creates all necessary tables with Row-Level Security (RLS) policies.

## Authentication

The app uses Supabase Auth with email/password. When signing up:
- **Customers**: Choose "Customer" role to browse products
- **Sellers**: Choose "Seller" role to manage products and shop

Sellers automatically get:
- Access to `/seller/dashboard`
- Ability to add and manage products
- Shop profile configuration

## API Routes

### Products
- `GET /api/products` - Fetch all products (with filters for category, search, limit)
- `GET /api/products/[id]` - Get single product details with variants
- `POST /api/seller/products` - Create new product (seller only)
- `GET /api/seller/products` - Get seller's products (seller only)

## Environment Variables

Required in your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

These are automatically configured if Supabase is connected via Vercel.

## Running Locally

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000`

## Testing the App

### Test Flow
1. **Sign up as Customer**
   - Go to `/signup`
   - Choose "Customer" role
   - Browse products on home page

2. **Sign up as Seller**
   - Go to `/signup`
   - Choose "Seller" role
   - Access `/seller/dashboard`
   - Add products with variants via `/seller/add-product`

3. **View Products**
   - Click on any product from home page
   - See all size/color combinations
   - View seller information

## Color Scheme

The app uses the LocalVastra brand colors:
- Primary (Terracotta): `hsl(15 55% 42%)`
- Ochre/Light: `hsl(36 55% 78%)`
- Green (In Stock): `hsl(140 45% 40%)`
- Cream/Background: `hsl(40 40% 96%)`

## Notes

- Customers can browse and view products but cart/checkout is a placeholder (Add to Cart button exists for future expansion)
- File uploads are via URLs only (no direct upload currently)
- Order management system is set up but not yet fully implemented on the UI
- All data is persisted in Supabase with proper RLS policies for data security
