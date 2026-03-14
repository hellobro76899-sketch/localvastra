"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search, MapPin, Navigation, Heart, Star, Eye, Map as MapIcon,
  Camera, X, Upload, ShoppingBag, BadgeCheck, Sparkles, MessageCircle, Send, Filter
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CATEGORIES } from "@/types";
import type { ProductWithShop } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

/* ═══════════ CATEGORY ICONS ═══════════ */
const CATEGORY_ICONS: Record<string, string> = {
  Men: "👔", Women: "👗", Kids: "👶", Ethnic: "🪔", Boutique: "✨",
};

/* ═══════════ SAMPLE LOCALITIES ═══════════ */
const LOCALITIES = [
  "Lalpur", "Albert Ekka Chowk", "Bariatu", "Barir-Chonah", "Kanke", "Doranda"
];

/* ═══════════ SAMPLE PRODUCTS (fallback when DB is empty) ═══════════ */
const SAMPLE_PRODUCTS: ProductWithShop[] = [
  // MEN
  { id: "s1", sellerId: "x", shopId: "x", name: "Casual Shirt", description: "Premium cotton casual shirt", price: 899, category: "men", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Gupta Textiles", description: "", address: "Main Road, Lalpur, Ranchi", phone: "", location: { lat: 23.3441, lng: 85.3096 }, createdAt: "", updatedAt: "" }, distance: 0.65 },
  { id: "s2", sellerId: "x", shopId: "x", name: "Formal Blazer", description: "Slim fit blazer", price: 3499, category: "men", images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Peter's Garments", description: "", address: "Albert Ekka Chowk, Ranchi", phone: "", location: { lat: 23.3567, lng: 85.334 }, createdAt: "", updatedAt: "" }, distance: 1.2 },
  { id: "s3", sellerId: "x", shopId: "x", name: "Men's Kurta Pajama", description: "Traditional cotton kurta set", price: 1599, category: "men", images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Gupta Textiles", description: "", address: "Main Road, Lalpur, Ranchi", phone: "", location: { lat: 23.3441, lng: 85.3096 }, createdAt: "", updatedAt: "" }, distance: 0.65 },
  { id: "s4", sellerId: "x", shopId: "x", name: "Polo T-Shirt", description: "Classic polo in olive green", price: 699, category: "men", images: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Shobha Ethnic", description: "", address: "Albert Ekka Chowk, Ranchi", phone: "", location: { lat: 23.3567, lng: 85.334 }, createdAt: "", updatedAt: "" }, distance: 0.8 },
  // WOMEN
  { id: "s5", sellerId: "x", shopId: "x", name: "Maroon Lehenga", description: "Hand-embroidered bridal lehenga", price: 4500, category: "women", images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Shobha Ethnic", description: "", address: "Lalpur, Ranchi 834001", phone: "", location: { lat: 23.3441, lng: 85.3096 }, createdAt: "", updatedAt: "" }, distance: 0.8 },
  { id: "s6", sellerId: "x", shopId: "x", name: "Cotton Sarees", description: "Handloom cotton saree", price: 899, category: "women", images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Gupta Textiles", description: "", address: "Main Road, Lalpur, Ranchi", phone: "", location: { lat: 23.3441, lng: 85.3096 }, createdAt: "", updatedAt: "" }, distance: 0.65 },
  { id: "s7", sellerId: "x", shopId: "x", name: "Anarkali Suit", description: "Royal blue flowing anarkali", price: 2499, category: "women", images: ["https://images.unsplash.com/photo-1583391733956-6f7ad3370e7f?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Fashion Street Ranchi", description: "", address: "Barir-Chonah, Ranchi", phone: "", location: { lat: 23.35, lng: 85.315 }, createdAt: "", updatedAt: "" }, distance: 1.5 },
  // ETHNIC
  { id: "s8", sellerId: "x", shopId: "x", name: "Banarasi Silk Saree", description: "Handwoven pure silk with gold zari", price: 8500, category: "ethnic", images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Gupta Textiles", description: "", address: "Main Road, Lalpur, Ranchi", phone: "", location: { lat: 23.3441, lng: 85.3096 }, createdAt: "", updatedAt: "" }, distance: 0.65 },
  { id: "s9", sellerId: "x", shopId: "x", name: "Lehonga Lehenga", description: "Intricate mirror work lehonga", price: 4500, category: "ethnic", images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Shobha Ethnic", description: "", address: "Albert Ekka Chowk, Ranchi", phone: "", location: { lat: 23.3567, lng: 85.334 }, createdAt: "", updatedAt: "" }, distance: 0.8 },
  // BOUTIQUE
  { id: "s10", sellerId: "x", shopId: "x", name: "Indo-Western Dress", description: "Contemporary fusion garment", price: 3499, category: "boutique", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Fashion Street Ranchi", description: "", address: "Barir-Chonah, Ranchi", phone: "", location: { lat: 23.35, lng: 85.315 }, createdAt: "", updatedAt: "" }, distance: 1.5 },
  { id: "s11", sellerId: "x", shopId: "x", name: "Crop Top Lehenga", description: "Modern crop top with lehenga skirt", price: 4999, category: "boutique", images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Fashion Street Ranchi", description: "", address: "Barir-Chonah, Ranchi", phone: "", location: { lat: 23.35, lng: 85.315 }, createdAt: "", updatedAt: "" }, distance: 1.5 },
  { id: "s12", sellerId: "x", shopId: "x", name: "Linen Shirt", description: "Handloom linen shirt for summer", price: 1199, category: "men", images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400"], inStock: true, createdAt: "", updatedAt: "", shop: { id: "x", sellerId: "x", name: "Ranchi Handloom House", description: "", address: "Kanke Road, Doranda, Ranchi", phone: "", location: { lat: 23.36, lng: 85.34 }, createdAt: "", updatedAt: "" }, distance: 2.0 },
];

/* ═══════════ PREDEFINED CHAT QUESTIONS ═══════════ */
const PREDEFINED_QUESTIONS = [
  "What is LocalVastra?",
  "How to register my shop?",
  "How to find shops near me?",
  "Can I buy products online?"
];

/* ═══════════════════════════════════════════════════════════════
   SCROLL-ANIMATED WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up: { y: 50 }, down: { y: -50 }, left: { x: 60 }, right: { x: -60 } };
  const d = dirs[direction] || dirs.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...d }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [products, setProducts] = useState<ProductWithShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [productQuery, setProductQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [radius, setRadius] = useState(5);
  const [locating, setLocating] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [heartAnimating, setHeartAnimating] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Visual search state
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [visualSearchResults, setVisualSearchResults] = useState<ProductWithShop[]>([]);
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chatbot State
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Hi there! Welcome to LocalVastra. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatbot]);

  const handleChatSubmit = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const msgContext = [...chatMessages, { role: 'user', text }];
    setChatMessages(msgContext as {role: 'bot'|'user', text: string}[]);
    setChatInput("");
    
    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let reply = "I'm still learning, but I'm here to help you discover local fashion! For specific queries, try our pre-defined questions.";
      
      if (lowerText.includes("register") || lowerText.includes("shop")) {
        reply = "To register your shop, simply click on the 'Register Your Shop' link in the footer to learn about our business model and partnership process.";
      } else if (lowerText.includes("near me") || lowerText.includes("location") || lowerText.includes("find")) {
        reply = "You can find shops near you by clicking the location pin 📍 in the search bar, or by adjusting the Search Radius slider in the left menu.";
      } else if (lowerText.includes("buy") || lowerText.includes("purchase") || lowerText.includes("order") || lowerText.includes("online")) {
        reply = "LocalVastra connects you with local shops for offline purchases. You can explore products online and visit the store to try them on!";
      } else if (lowerText.includes("localvastra") || lowerText.includes("what is")) {
        reply = "LocalVastra is your local fashion discovery platform! We aim to bring 'Market ka har raaz, ab aapke pass' (Your local shops to your phone).";
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
         reply = "Hello! How can I assist you with LocalVastra today?";
      }

      setChatMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 600);
  };

  // Geolocation
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
      params.set("radius", String(radius));
    }
    if (activeCategory) params.set("category", activeCategory);
    if (productQuery) params.set("q", productQuery);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 10000) params.set("maxPrice", String(priceRange[1]));

    fetch(`/api/products?${params}&limit=50`)
      .then((r) => r.json())
      .then((prods) => {
        const data = Array.isArray(prods) ? prods : [];
        // If no products from API, use sample data
        setProducts(data.length > 0 ? data : SAMPLE_PRODUCTS);
      })
      .catch(() => setProducts(SAMPLE_PRODUCTS))
      .finally(() => setLoading(false));
  }, [userLocation, radius, activeCategory, productQuery, priceRange]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const handleNearMe = () => {
    setLocating(true);
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setRadius(5); setLocating(false); },
      () => setLocating(false)
    );
  };

  const toggleLike = (productId: string) => {
    setHeartAnimating(productId);
    setTimeout(() => setHeartAnimating(null), 400);
    setLikedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const setRating = (productId: string, stars: number) => {
    setRatings(prev => ({ ...prev, [productId]: stars }));
  };

  const formatDistance = (d?: number) => {
    if (d === undefined) return null;
    if (d < 1) return `${Math.round(d * 1000)}m`;
    return `${d.toFixed(1)} km`;
  };

  const toggleLocality = (loc: string) => {
    setSelectedLocalities(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  // ── Visual Search (Google Lens style) ──
  const handleVisualSearchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSearchImage(ev.target?.result as string);
      performVisualSearch();
    };
    reader.readAsDataURL(file);
  };

  const performVisualSearch = () => {
    setSearching(true);
    // Simulate visual search — pick random products as "similar" results
    setTimeout(() => {
      const allProds = products.length > 0 ? products : SAMPLE_PRODUCTS;
      const shuffled = [...allProds].sort(() => Math.random() - 0.5);
      setVisualSearchResults(shuffled.slice(0, 6));
      setSearching(false);
    }, 1500);
  };

  // Products grouped by category for section display
  const trendingProducts = products.slice(0, 6);
  const nearbyProducts = products.length > 6 ? products.slice(6, 12) : products.slice(0, Math.min(6, products.length));
  const newArrivals = products.length > 4 ? [...products].reverse().slice(0, 6) : products.slice(0, Math.min(6, products.length));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(35 30% 95%)" }}>
      <Navbar />

      {/* ═══ HERO SECTION with parallax-like entrance ═══ */}
      <section className="lv-hero-wave pb-24 pt-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "hsl(40 70% 50%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10" style={{ background: "hsl(15 55% 60%)", filter: "blur(60px)" }} />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-md"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Market ka har raaz, ab aapke pass
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-white/80 mb-8"
          >
            Discover Local Fashion, Buy Offline
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="lv-search-bar w-full max-w-xl mx-auto">
              <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Kurtas, Jeans, Lehengas in Ranchi..."
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm sm:text-base placeholder:text-gray-400"
              />
              <button
                onClick={handleNearMe}
                disabled={locating}
                className="ml-2 p-2 rounded-full hover:bg-gray-100 text-orange-600 transition-colors shrink-0"
                title="Use current location"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ CATEGORY PILLS — scroll reveal ═══ */}
      <ScrollReveal className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="flex justify-center gap-3 flex-wrap">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(activeCategory === cat.toLowerCase() ? "" : cat.toLowerCase())}
              className={`lv-category-pill ${activeCategory === cat.toLowerCase() ? "active" : ""}`}
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat] || "🏷️"}</span>
              <span className="text-xs font-semibold text-gray-700">{cat}</span>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="container mx-auto px-4 pb-10 flex-1">
        {/* Title + Map Toggle */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {productQuery || activeCategory ? "Search Results" : "Product Cards"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 text-sm font-bold shadow-sm hover:bg-orange-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                {showMobileFilters ? "Hide Filters" : "Filters"}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">Map View</span>
                <button
                  onClick={() => setShowMapView(!showMapView)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${showMapView ? "bg-orange-700" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${showMapView ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ═══ LEFT SIDEBAR ═══ */}
          <ScrollReveal direction="left" className={`${showMobileFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="lv-sidebar sticky top-20 space-y-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-50 px-4 py-3 rounded-lg border border-orange-200">
                <BadgeCheck className="h-5 w-5 text-orange-700" />
                <span className="text-sm font-bold text-orange-800">Verified Local Shops</span>
                <span className="text-lg">🏅</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Search Radius</h3>
                <input type="range" min="1" max="10" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span><span>{radius}km</span><span>10km</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Areas/Localities</h3>
                <div className="space-y-2">
                  {LOCALITIES.map((loc) => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={selectedLocalities.includes(loc)} onChange={() => toggleLocality(loc)} className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Price Range</h3>
                <input type="range" min="0" max="10000" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span><span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ═══ PRODUCT AREA ═══ */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border h-64 sm:h-80 animate-pulse flex flex-col overflow-hidden">
                    <div className="bg-gray-200 h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : showMapView ? (
              <MapViewSection products={products.length > 0 ? products : SAMPLE_PRODUCTS} formatDistance={formatDistance} userLocation={userLocation} />
            ) : (
              <div className="space-y-12">
                {/* ── SECTION 1: Trending Now ── */}
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-5">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-gray-800">🔥 Trending Now</h3>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  </ScrollReveal>
                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {trendingProducts.map((product) => (
                      <StaggerItem key={product.id + "-t"}>
                        <ProductCardLV
                          product={product}
                          dist={formatDistance(product.distance)}
                          liked={likedProducts.has(product.id)}
                          onToggleLike={() => toggleLike(product.id)}
                          rating={ratings[product.id] || 0}
                          onRate={(stars) => setRating(product.id, stars)}
                          animating={heartAnimating === product.id}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

                {/* ── SECTION 2: Shops Near You ── */}
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-5">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-800">📍 Shops Near You</h3>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  </ScrollReveal>
                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {nearbyProducts.map((product) => (
                      <StaggerItem key={product.id + "-n"}>
                        <ProductCardLV
                          product={product}
                          dist={formatDistance(product.distance)}
                          liked={likedProducts.has(product.id)}
                          onToggleLike={() => toggleLike(product.id)}
                          rating={ratings[product.id] || 0}
                          onRate={(stars) => setRating(product.id, stars)}
                          animating={heartAnimating === product.id}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

                {/* ── SECTION 3: New Arrivals ── */}
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-5">
                      <ShoppingBag className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-800">✨ New Arrivals</h3>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  </ScrollReveal>
                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {newArrivals.map((product) => (
                      <StaggerItem key={product.id + "-a"}>
                        <ProductCardLV
                          product={product}
                          dist={formatDistance(product.distance)}
                          liked={likedProducts.has(product.id)}
                          onToggleLike={() => toggleLike(product.id)}
                          rating={ratings[product.id] || 0}
                          onRate={(stars) => setRating(product.id, stars)}
                          animating={heartAnimating === product.id}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ═══ FLOATING BUTTONS ═══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Chatbot Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          onClick={() => setShowChatbot(true)}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white group relative"
          style={{ background: "linear-gradient(135deg, hsl(36 50% 48%), hsl(20 30% 18%))" }}
          title="Customer Support Chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          {!showChatbot && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />}
        </motion.button>

        {/* Visual Search Button (Google Lens style) */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          onClick={() => setShowVisualSearch(true)}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white group"
          style={{ background: "linear-gradient(135deg, hsl(15 55% 42%), hsl(40 70% 50%))" }}
          title="Search by Image (Google Lens)"
        >
          <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      {/* ═══ CHATBOT WIDGET ═══ */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[60] w-[calc(100vw-48px)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 120px)", height: "500px" }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between text-white" style={{ background: "linear-gradient(135deg, hsl(15 55% 42%), hsl(40 70% 50%))" }}>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="font-bold">LocalVastra Support</h3>
              </div>
              <button onClick={() => setShowChatbot(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-sm' : 'bg-white border text-gray-800 rounded-tl-sm'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Predefined Questions */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
              {PREDEFINED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleChatSubmit(q)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit(chatInput)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 rounded-full px-4 py-2 text-sm outline-none transition-all"
              />
              <button 
                onClick={() => handleChatSubmit(chatInput)}
                disabled={!chatInput.trim()}
                className="p-2 rounded-full bg-orange-600 text-white disabled:opacity-50 hover:bg-orange-700 transition-colors shrink-0"
              >
                <Send className="h-4 w-4 relative left-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ VISUAL SEARCH MODAL ═══ */}
      <AnimatePresence>
        {showVisualSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setShowVisualSearch(false); setSearchImage(null); setVisualSearchResults([]); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, hsl(15 55% 42%), hsl(40 70% 50%))" }}>
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Search by Image</h3>
                    <p className="text-xs text-gray-500">Upload a photo to find similar products</p>
                  </div>
                </div>
                <button onClick={() => { setShowVisualSearch(false); setSearchImage(null); setVisualSearchResults([]); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Upload Area */}
              <div className="p-5">
                {!searchImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-orange-300 rounded-xl p-10 text-center cursor-pointer hover:bg-orange-50/50 transition-colors group"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="h-12 w-12 text-orange-400 mx-auto mb-3 group-hover:text-orange-600 transition-colors" />
                    </motion.div>
                    <p className="text-gray-700 font-semibold mb-1">Upload a clothing photo</p>
                    <p className="text-sm text-gray-500">Take a photo or upload from gallery</p>
                    <p className="text-xs text-gray-400 mt-3">Supports JPG, PNG, WebP</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleVisualSearchUpload}
                    />
                  </div>
                ) : (
                  <div>
                    {/* Uploaded image preview */}
                    <div className="relative rounded-xl overflow-hidden mb-5 border">
                      <img src={searchImage} alt="Uploaded" className="w-full max-h-48 object-cover" />
                      <button
                        onClick={() => { setSearchImage(null); setVisualSearchResults([]); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Results */}
                    {searching ? (
                      <div className="text-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-3 border-orange-200 border-t-orange-600 rounded-full mx-auto mb-3"
                          style={{ borderWidth: 3 }}
                        />
                        <p className="text-gray-600 font-medium">Searching for similar products...</p>
                        <p className="text-sm text-gray-400 mt-1">Analyzing patterns, colors & style</p>
                      </div>
                    ) : visualSearchResults.length > 0 ? (
                      <div>
                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-orange-600" />
                          Similar Products Found ({visualSearchResults.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {visualSearchResults.map((p, i) => (
                            <motion.div
                              key={p.id + "-vs-" + i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-gray-50 rounded-lg border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <div className="relative aspect-square bg-gray-100">
                                <Image src={p.images?.[0] || "https://placehold.co/200x200?text=Item"} alt={p.name} fill className="object-cover" sizes="150px" />
                              </div>
                              <div className="p-2.5">
                                <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                                <p className="text-sm font-bold text-orange-800">₹{p.price?.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 truncate mt-0.5">{p.shop?.name}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FOOTER ═══ */}
      <ScrollReveal>
        <footer className="border-t" style={{ background: "hsl(35 20% 92%)" }}>
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
            <Link href="/signup" className="text-orange-800 hover:text-orange-900 font-semibold underline underline-offset-4">
              Register Your Shop (Business Model info)
            </Link>
            <Link href="/" className="text-orange-800 hover:text-orange-900 font-semibold underline underline-offset-4">
              How to Shop Locally
            </Link>
            <Link href="/" className="text-orange-800 hover:text-orange-900 font-semibold underline underline-offset-4">
              Contact Us
            </Link>
          </div>
          <div className="py-4 text-center text-xs border-t" style={{ background: "hsl(15 45% 30%)" }}>
            <span className="text-white/70">© 2026 LocalVastra – Discover Local Fashion, Buy Offline</span>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD – LocalVastra Style
   ════════════════════════════════════════════════════════════════════ */
function ProductCardLV({
  product, dist, liked, onToggleLike, rating, onRate, animating,
}: {
  product: ProductWithShop; dist: string | null; liked: boolean; onToggleLike: () => void;
  rating: number; onRate: (stars: number) => void; animating: boolean;
}) {
  const imageUrl = product.images?.[0] || "https://placehold.co/400x300?text=Product";
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please login to add items to your cart.");
      router.push("/login");
      return;
    }
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="lv-product-card flex flex-col relative group h-full">
      {/* Image */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] bg-gray-100 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {product.inStock && <div className="lv-badge-stock">In Stock</div>}
        <button
          onClick={(e) => { e.preventDefault(); onToggleLike(); }}
          className={`lv-heart-btn ${liked ? "liked" : ""} ${animating ? "lv-heart-pop" : ""}`}
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4 flex flex-col flex-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-xs sm:text-base line-clamp-2 sm:line-clamp-1 group-hover:text-orange-800 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm sm:text-lg font-bold text-orange-800 mt-0.5 sm:mt-1">₹{product.price?.toLocaleString()}</p>

        {/* Star Rating */}
        <div className="lv-stars mt-1 sm:mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => onRate(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
              className={`lv-star ${(hoverRating || rating) >= s ? "filled" : ""}`}>
              <Star className="h-3 w-3 sm:h-4 sm:w-4" fill={(hoverRating || rating) >= s ? "currentColor" : "none"} />
            </button>
          ))}
          {rating > 0 && <span className="text-[10px] sm:text-xs text-gray-500 ml-1">{rating}.0</span>}
        </div>

        {/* Shop info + Address */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] sm:text-sm font-semibold text-gray-700 truncate max-w-full">{product.shop?.name}</span>
            <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">- Verified</span>
            <span className="text-[10px] sm:text-sm">🏅</span>
            {dist && (
              <span className="text-[9px] sm:text-xs text-green-700 font-medium flex items-center gap-0.5 w-full sm:w-auto">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {dist}
              </span>
            )}
          </div>
          {product.shop?.address && (
            <p className="text-[9px] sm:text-xs text-gray-500 mt-1 flex items-start gap-1">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 mt-0.5 text-red-400" />
              <span className="line-clamp-1 sm:line-clamp-2">{product.shop.address}</span>
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex gap-1.5 sm:gap-2 mb-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
            >
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
              Add to Cart
            </button>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${product.shop?.location?.lat},${product.shop?.location?.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg border text-gray-700 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
              <span className="hidden xl:inline">View Shop on Map</span>
              <span className="xl:hidden">Map</span>
            </a>
            <Link href={`/products/${product.id}`} className="px-2 py-1.5 sm:px-3 py-2 text-[10px] sm:text-xs font-semibold text-gray-600 hover:text-orange-800 underline underline-offset-2 flex items-center justify-center border border-transparent hover:bg-gray-50 rounded-md sm:rounded-lg transition-colors">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MAP VIEW SECTION
   ════════════════════════════════════════════════════════════════════ */
function MapViewSection({
  products, formatDistance, userLocation,
}: {
  products: ProductWithShop[];
  formatDistance: (d?: number) => string | null;
  userLocation: { lat: number; lng: number } | null;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[550px]">
      {/* Map Panel */}
      <ScrollReveal direction="left">
        <div className="relative rounded-xl bg-gray-100 border border-gray-200 shadow-inner overflow-hidden min-h-[400px]">
          {userLocation ? (
            <iframe
              width="100%" height="100%"
              style={{ border: 0, minHeight: 400 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=13&output=embed`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
              <MapPin className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-700">Local Map View</p>
              <p className="text-sm text-gray-500 mt-2">Enable location to see shops on the map</p>
              <button
                onClick={() => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => window.location.reload()); }}
                className="mt-4 px-4 py-2 bg-orange-700 text-white text-sm font-semibold rounded-lg hover:bg-orange-800 transition-colors"
              >
                <Navigation className="h-4 w-4 inline mr-1" /> Enable Location
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Product List */}
      <ScrollReveal direction="right">
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1 custom-scrollbar">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-orange-700" /> Product by Distance
          </h3>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
            {products.map((product) => {
              const imgUrl = product.images?.[0] || "https://placehold.co/200x200?text=Item";
              return (
                <StaggerItem key={product.id + "-map"}>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative w-full aspect-square bg-gray-50">
                      <Image src={imgUrl} alt={product.name} fill className="object-cover" sizes="200px" />
                    </div>
                    <div className="p-2 sm:p-3">
                      <p className="font-bold text-gray-800 text-xs sm:text-sm truncate">{product.shop?.name || product.name}</p>
                      <p className="text-sm sm:text-base font-bold text-orange-800 mt-0.5">₹{product.price?.toLocaleString()}</p>
                      {product.shop?.address && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{product.shop.address}</p>}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${product.shop?.location?.lat},${product.shop?.location?.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-1.5 sm:mt-2 w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg text-white transition-colors"
                        style={{ background: "hsl(15 55% 42%)" }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
}
