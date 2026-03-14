"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const defaultCenter = { lat: 28.6139, lng: 77.209 };

export default function ShopProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/seller/shop?uid=" + user.uid)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setShopId(data.id);
          setName(data.name || "");
          setDescription(data.description || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          if (data.location?.lat && data.location?.lng) {
            setLocation({ lat: data.location.lat, lng: data.location.lng });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat != null && lng != null) setLocation({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Error", description: "Shop name required", variant: "destructive" });
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const url = shopId ? `/api/seller/shop/${shopId}` : "/api/seller/shop";
      const method = shopId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user.uid,
          name: name.trim(),
          description: description.trim(),
          address: address.trim(),
          phone: phone.trim(),
          location: location || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data?.id) setShopId(data.id);
      toast({ title: "Success", description: "Shop profile saved" });
    } catch {
      toast({ title: "Error", description: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-6">
        Shop Profile
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="name">Shop name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {apiKey && (
          <div>
            <Label>Shop location (click on map to set)</Label>
            <div className="mt-2 h-64 rounded-lg overflow-hidden border">
              <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={location || defaultCenter}
                  zoom={12}
                  onClick={handleMapClick}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </LoadScript>
            </div>
            {location && <p className="text-xs text-muted-foreground mt-1">Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
          </div>
        )}

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </motion.form>
    </div>
  );
}
