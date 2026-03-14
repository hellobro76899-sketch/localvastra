import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDatabase, generateId } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const db = getDatabase();

    // Check if data already exists
    const existing = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    if (existing.count > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing.count });
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    // Create sellers
    const sellerId = generateId();
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)").run(
      sellerId, "seller@localvastra.com", "Gupta Textiles", passwordHash, "seller"
    );

    const buyerId = generateId();
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)").run(
      buyerId, "user@localvastra.com", "Priya Sharma", passwordHash, "user"
    );

    const seller2Id = generateId();
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)").run(
      seller2Id, "seller2@localvastra.com", "Shobha Ethnic", passwordHash, "seller"
    );

    const seller3Id = generateId();
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)").run(
      seller3Id, "seller3@localvastra.com", "Peter Garments", passwordHash, "seller"
    );

    // Create shops (Ranchi area coordinates)
    const shop1Id = generateId();
    db.prepare("INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      shop1Id, sellerId, "Gupta Textiles",
      "Premium fabrics and ethnic wear since 1985",
      "Main Road, Lalpur, Ranchi 834001",
      "+91 98765 43210", 23.3441, 85.3096
    );

    const shop2Id = generateId();
    db.prepare("INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      shop2Id, seller2Id, "Shobha Ethnic",
      "Traditional and modern ethnic wear for all occasions",
      "Albert Ekka Chowk, Ranchi 834001",
      "+91 87654 32109", 23.3567, 85.3340
    );

    const shop3Id = generateId();
    db.prepare("INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      shop3Id, seller3Id, "Peter's Garments",
      "Western and Indo-Western fashion for men and women",
      "Bariatu Road, Ranchi 834009",
      "+91 76543 21098", 23.3700, 85.3200
    );

    const shop4Id = generateId();
    db.prepare("INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      shop4Id, sellerId, "Ranchi Handloom House",
      "Authentic handloom products from Jharkhand artisans",
      "Kanke Road, Doranda, Ranchi 834002",
      "+91 65432 10987", 23.3600, 85.3400
    );

    const shop5Id = generateId();
    db.prepare("INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      shop5Id, seller2Id, "Fashion Street Ranchi",
      "Trendy boutique fashion and accessories",
      "Barir-Chonah, Ranchi 834001",
      "+91 54321 09876", 23.3500, 85.3150
    );

    // Create products — ~10 per category
    const products = [
      // ═══ MEN (10) ═══
      { shopId: shop1Id, sellerId, name: "Casual Shirt", desc: "Premium cotton casual shirt for everyday wear", price: 899, cat: "men", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Formal Blazer", desc: "Slim fit blazer for office and events", price: 3499, cat: "men", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
      { shopId: shop1Id, sellerId, name: "Men's Kurta Pajama", desc: "Traditional cotton kurta set for festive occasions", price: 1599, cat: "men", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Denim Jeans", desc: "Slim-fit stretch denim jeans in dark wash", price: 1299, cat: "men", img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400" },
      { shopId: shop4Id, sellerId, name: "Linen Shirt", desc: "Breathable handloom linen shirt for summer", price: 1199, cat: "men", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400" },
      { shopId: shop1Id, sellerId, name: "Polo T-Shirt", desc: "Classic polo neck t-shirt in olive green", price: 699, cat: "men", img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Men's Nehru Jacket", desc: "Silk blend Nehru jacket for weddings", price: 2999, cat: "men", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Chinos Trouser", desc: "Cotton chinos in beige - smart casual", price: 999, cat: "men", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400" },
      { shopId: shop4Id, sellerId, name: "Printed Shirt", desc: "Trendy floral print shirt for parties", price: 849, cat: "men", img: "https://images.unsplash.com/photo-1558171813-01e29f18b73c?w=400" },
      { shopId: shop1Id, sellerId, name: "Track Pants", desc: "Comfortable cotton track pants with pockets", price: 599, cat: "men", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400" },

      // ═══ WOMEN (10) ═══
      { shopId: shop2Id, sellerId: seller2Id, name: "Maroon Lehenga", desc: "Hand-embroidered bridal lehenga with dupatta", price: 4500, cat: "women", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Cotton Sarees", desc: "Handloom cotton saree with traditional border", price: 899, cat: "women", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Anarkali Suit", desc: "Flowing anarkali suit in royal blue", price: 2499, cat: "women", img: "https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Silk Dupatta", desc: "Pure silk dupatta with zari work", price: 1599, cat: "women", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Palazzo Set", desc: "Printed palazzo with kurti - Indo western", price: 1299, cat: "women", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop1Id, sellerId, name: "Chiffon Saree", desc: "Lightweight chiffon saree for parties", price: 1899, cat: "women", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop4Id, sellerId, name: "Block Print Kurti", desc: "Jaipur block print cotton kurti", price: 799, cat: "women", img: "https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Bridal Lehenga Set", desc: "Complete bridal set with jewelry matching", price: 12500, cat: "women", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Designer Gown", desc: "Indo-western designer gown for receptions", price: 5999, cat: "women", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop1Id, sellerId, name: "Embroidered Salwar", desc: "Thread embroidery salwar kameez set", price: 1999, cat: "women", img: "https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400" },

      // ═══ KIDS (10) ═══
      { shopId: shop2Id, sellerId: seller2Id, name: "Kids Ethnic Set", desc: "Colorful ethnic kurta set for boys", price: 799, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop1Id, sellerId, name: "Girls Lehenga", desc: "Mini lehenga choli for little princesses", price: 1299, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Kids Denim Jacket", desc: "Cool denim jacket for kids - unisex", price: 899, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Party Frock", desc: "Sparkly party frock with bow detail", price: 999, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop4Id, sellerId, name: "Boys Sherwani", desc: "Mini sherwani set for festive occasions", price: 1599, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop1Id, sellerId, name: "Kids T-Shirt Pack", desc: "Pack of 3 colorful cotton t-shirts", price: 599, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Girls Salwar Set", desc: "Printed cotton salwar kameez for girls", price: 699, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Boys Kurta Set", desc: "Festival special kurta pajama for boys", price: 849, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Kids Jacket", desc: "Warm winter jacket for kids - waterproof", price: 1499, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },
      { shopId: shop4Id, sellerId, name: "School Uniform Set", desc: "Complete school uniform set - shirt and trouser", price: 699, cat: "kids", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400" },

      // ═══ ETHNIC (10) ═══
      { shopId: shop1Id, sellerId, name: "Banarasi Silk Saree", desc: "Handwoven pure Banarasi silk with gold zari", price: 8500, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Lehonga Lehenga", desc: "Traditional lehonga with intricate mirror work", price: 4500, cat: "ethnic", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400" },
      { shopId: shop4Id, sellerId, name: "Pochampally Ikat", desc: "Double ikat weave saree from Telangana", price: 5600, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop1Id, sellerId, name: "Chanderi Cotton", desc: "Lightweight Chanderi saree with golden buti", price: 3200, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Tussar Silk Saree", desc: "Natural tussar silk with Kantha stitch", price: 4200, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop4Id, sellerId, name: "Dhoti Kurta Set", desc: "Traditional silk dhoti with matching angavastram", price: 3500, cat: "ethnic", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
      { shopId: shop1Id, sellerId, name: "Patola Saree", desc: "Gujarat patola saree with geometric patterns", price: 7800, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop2Id, sellerId: seller2Id, name: "Bridal Dupatta", desc: "Heavy embroidered bridal dupatta in red", price: 2800, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Puja Dhoti Set", desc: "Pure cotton dhoti set for puja ceremonies", price: 999, cat: "ethnic", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
      { shopId: shop4Id, sellerId, name: "Kalamkari Dupatta", desc: "Hand painted Kalamkari on cotton", price: 1800, cat: "ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },

      // ═══ BOUTIQUE (10) ═══
      { shopId: shop5Id, sellerId: seller2Id, name: "Indo-Western Dress", desc: "Contemporary fusion garment for modern women", price: 3499, cat: "boutique", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Crop Top Lehenga", desc: "Modern crop top with lehenga skirt", price: 4999, cat: "boutique", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Fusion Jacket", desc: "Kashmiri embroidery on denim jacket", price: 2999, cat: "boutique", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Cape Dress", desc: "Flowy cape style dress - cocktail ready", price: 3999, cat: "boutique", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Asymmetric Kurta", desc: "Designer asymmetric hemline kurta", price: 1799, cat: "boutique", img: "https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Dhoti Pants Set", desc: "Trendy dhoti pants with crop top", price: 2199, cat: "boutique", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Maxi Dress", desc: "Floor length maxi with block print", price: 2499, cat: "boutique", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Sharara Set", desc: "Boutique sharara with modern embroidery", price: 3299, cat: "boutique", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400" },
      { shopId: shop3Id, sellerId: seller3Id, name: "Peplum Top Set", desc: "Peplum top with palazzo - party perfect", price: 1999, cat: "boutique", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { shopId: shop5Id, sellerId: seller2Id, name: "Boho Kurti", desc: "Bohemian style kurti with tassel detail", price: 1399, cat: "boutique", img: "https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400" },
    ];

    for (const p of products) {
      db.prepare(
        "INSERT INTO products (id, seller_id, shop_id, name, description, price, category, images, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(generateId(), p.sellerId, p.shopId, p.name, p.desc, p.price, p.cat, JSON.stringify([p.img]), 1);
    }

    return NextResponse.json({ message: "Database seeded successfully!", users: 4, shops: 5, products: products.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed: " + (error as Error).message }, { status: 500 });
  }
}
