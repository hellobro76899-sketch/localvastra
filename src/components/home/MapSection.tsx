"use client";

import { useState, useEffect } from "react";
import { LoadScript, GoogleMap, InfoWindow, OverlayView } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Store, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/animations";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 28.6139, lng: 77.209 };

interface Shop {
  id: string;
  name: string;
  address?: string;
  location?: { lat: number; lng: number };
  distance?: number;
}

interface ProductWithShop {
  id: string;
  name: string;
  price: number;
  images?: string[];
  shop?: Shop;
}

interface MapSectionProps {
  userLocation?: { lat: number; lng: number } | null;
}

export function MapSection({ userLocation }: MapSectionProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<ProductWithShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
      params.set("radius", "10");
    }
    Promise.all([
      fetch(`/api/shops?${params}`).then((r) => r.json()),
      fetch(`/api/products?${params}`).then((r) => r.json()),
    ]).then(([shopsData, productsData]) => {
      setShops(Array.isArray(shopsData) ? shopsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    });
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) setCenter(userLocation);
  }, [userLocation]);

  const shopCoords = shops
    .filter((s) => s.location?.lat && s.location?.lng)
    .map((s) => s);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <section className="container mx-auto px-4 py-16 relative">
        <div className="absolute inset-0 folk-pattern-lines opacity-10 pointer-events-none" />
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-[2px] flex-1 bg-folk-terracotta/30 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-folk-mustard drop-shadow-sm text-center">
              Discover Local Artisans
            </h2>
            <div className="h-[2px] flex-1 bg-folk-terracotta/30 rounded-full" />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative p-3 md:p-6 bg-folk-ochre rounded-2xl border-4 border-double border-folk-terracotta shadow-xl mx-auto max-w-5xl">
            {shops.length === 0 ? (
              <div className="h-64 rounded-xl border-2 border-dashed border-folk-terracotta/50 bg-muted flex items-center justify-center text-muted-foreground text-center p-4">
                <div>
                  <MapPin className="h-10 w-10 mx-auto mb-3 text-folk-terracotta" />
                  <p className="text-lg font-serif text-folk-mustard">Loading shop locations...</p>
                  <p className="text-sm mt-1">Shop locations will appear here</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {shops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    whileHover={{ y: -3 }}
                    className="bg-background/80 rounded-xl p-4 border-2 border-dashed border-folk-terracotta/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-folk-mustard border-[3px] border-folk-terracotta rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center text-folk-terracotta shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold font-serif text-folk-mustard truncate">{shop.name}</h3>
                        {shop.address && <p className="text-xs text-muted-foreground mt-1 truncate">{shop.address}</p>}
                        {shop.distance !== undefined && <p className="text-xs font-medium mt-1">{shop.distance.toFixed(1)} km away</p>}
                        {shop.location && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.location.lat},${shop.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-folk-terracotta hover:underline mt-2 font-medium"
                          >
                            <MapPin className="h-3 w-3" /> Get Directions
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16 relative">
      <div className="absolute inset-0 folk-pattern-lines opacity-10 pointer-events-none" />
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[2px] flex-1 bg-folk-terracotta/30 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-folk-mustard drop-shadow-sm text-center">
            Discover Local Artisans
          </h2>
          <div className="h-[2px] flex-1 bg-folk-terracotta/30 rounded-full" />
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <div className="relative p-3 md:p-6 bg-folk-ochre rounded-2xl border-4 border-double border-folk-terracotta shadow-xl mx-auto max-w-5xl">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-folk-mustard -translate-x-[6px] -translate-y-[6px]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-folk-mustard translate-x-[6px] -translate-y-[6px]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-folk-mustard -translate-x-[6px] translate-y-[6px]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-folk-mustard translate-x-[6px] translate-y-[6px]" />
          
          <div className="rounded-xl overflow-hidden border-2 border-dashed border-folk-terracotta/50 bg-muted relative z-10">
        <LoadScript googleMapsApiKey={apiKey} loadingElement={<div className="h-96 bg-muted animate-pulse" />}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={{ disableDefaultUI: false, zoomControl: true }}
          >
            {userLocation && (
              <OverlayView position={userLocation} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-40 animate-ping" />
                  <div className="relative h-6 w-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg" />
                </div>
              </OverlayView>
            )}
            {shopCoords.map((shop) => (
              <OverlayView
                key={shop.id}
                position={{ lat: shop.location!.lat, lng: shop.location!.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div 
                  className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onClick={() => setSelectedShop(shop)}
                >
                  <div className="absolute -inset-2 bg-folk-terracotta rounded-full opacity-20 animate-ping group-hover:opacity-40" />
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative h-10 w-10 bg-folk-mustard border-[3px] border-folk-terracotta rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center text-folk-terracotta shadow-lg"
                  >
                    <Store className="h-5 w-5" />
                  </motion.div>
                </div>
              </OverlayView>
            ))}
            {selectedShop && (
              <InfoWindow
                position={{ lat: selectedShop.location!.lat, lng: selectedShop.location!.lng }}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold">{selectedShop.name}</h3>
                  {selectedShop.address && <p className="text-sm text-gray-600">{selectedShop.address}</p>}
                  {selectedShop.distance !== undefined && (
                    <p className="text-sm">{selectedShop.distance.toFixed(1)} km away</p>
                  )}
                  {products.find((p) => p.shop?.id === selectedShop.id) && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Sample: ₹{products.find((p) => p.shop?.id === selectedShop.id)!.price.toLocaleString()}</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.location!.lat},${selectedShop.location!.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
