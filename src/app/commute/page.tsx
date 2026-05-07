"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Navigation, Clock, Zap, Train, Bus } from "lucide-react";
import { useColleges } from "@/lib/contexts/CollegeContext";
import { collegeCoordinates } from "@/lib/data/college_coordinates";
import { metroConnectivity } from "@/lib/data/metro_connectivity";
import { metroLines } from "@/lib/data/metro_lines";
import { bmtcConnectivity } from "@/lib/data/bmtc_connectivity";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-white/5 animate-pulse rounded-2xl flex items-center justify-center border border-white/10">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <MapPin className="w-8 h-8 animate-bounce text-primary/50" />
        <span className="text-sm font-medium tracking-widest uppercase">Initializing Map...</span>
      </div>
    </div>
  )
});

// Haversine formula to calculate straight-line distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function CommuteOptimizer() {
  const { colleges } = useColleges();
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<'search' | 'metro' | 'bmtc'>('metro');
  const [selectedMetroLine, setSelectedMetroLine] = useState<'Green' | 'Purple' | 'Yellow' | null>('Purple');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  const mappedColleges = useMemo(() => {
    return colleges
      .filter(c => collegeCoordinates[c.college_id])
      .map(c => {
        const coords = collegeCoordinates[c.college_id];
        let distance = null;
        let estTime = null;

        if (userLocation) {
          distance = calculateDistance(userLocation[0], userLocation[1], coords.lat, coords.lng);
          estTime = Math.round(distance * 4) + 10;
        }

        return {
          id: c.college_id,
          name: c.full_name,
          lat: coords.lat,
          lng: coords.lng,
          tier: c.tier,
          fees: c.fees,
          distance,
          estTime,
          metro: metroConnectivity[c.college_id],
          bmtc: bmtcConnectivity[c.college_id]
        };
      })
      .filter(c => {
        if (viewMode === 'metro') return !!c.metro;
        if (viewMode === 'bmtc') return !!c.bmtc;
        return true;
      })
      .sort((a, b) => {
        if (a.distance && b.distance) return a.distance - b.distance;
        return 0;
      });
  }, [userLocation, viewMode, colleges]);

  const bmtcOrigins = useMemo(() => {
    const origins = new Set<string>();
    Object.values(bmtcConnectivity).forEach(b => {
      if (b.origin) origins.add(b.origin);
    });
    return Array.from(origins).sort();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Karnataka")}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        setUserLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setError("Location not found. Please try entering a more specific area or town in Karnataka.");
      }
    } catch (err) {
      setError("Failed to geocode address. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser or environment.");
      return;
    }

    setIsSearching(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Location acquired:", latitude, longitude);
        setUserLocation([latitude, longitude]);
        setAddress("📍 Current Location");
        setIsSearching(false);
        setError("");
        
        // Auto-switch to search mode to show distance results
        setViewMode('search');
      },
      (err) => {
        console.error("❌ Geolocation Error:", err);
        let msg = "Unable to retrieve your location.";
        if (err.code === 1) msg = "Location access denied. Please enable GPS permissions.";
        else if (err.code === 2) msg = "Location unavailable (Signal lost).";
        else if (err.code === 3) msg = "Location request timed out.";
        
        setError(msg);
        setIsSearching(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  const mapCenter: [number, number] = useMemo(() => userLocation || [12.9716, 77.5946] as [number, number], [userLocation]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Navigation className="w-4 h-4" />
              Transit Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Transit Mapper 🗺️
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Plan your commute with ease. Explore Metro connectivity, BMTC bus routes, or calculate point-to-point distances.
            </p>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shrink-0 w-full lg:w-[450px]">
            <button
              onClick={() => setViewMode('search')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${
                viewMode === 'search' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-3 h-3" />
              Search
            </button>
            <button
              onClick={() => setViewMode('metro')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${
                viewMode === 'metro' ? 'bg-[#91278F] text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Train className="w-3 h-3" />
              Metro
            </button>
            <button
              onClick={() => setViewMode('bmtc')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${
                viewMode === 'bmtc' ? 'bg-[#00529B] text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Bus className="w-3 h-3" />
              BMTC Bus
            </button>
          </div>
        </div>

        {viewMode === 'search' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
            <div className="col-span-1 flex flex-col gap-6 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl h-full overflow-hidden">
              <form onSubmit={handleSearch} className="space-y-4 shrink-0">
                <label className="text-sm font-bold text-white/80">Your Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="E.g. Jayanagar 4th Block"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-3 text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isSearching && address === "📍 Current Location" ? "Locating..." : isSearching ? "Searching..." : "Calculate Route"}
                  </button>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={isSearching}
                    className={`px-4 bg-white/5 text-white font-bold rounded-xl py-3 text-sm border border-white/10 hover:bg-white/10 transition-all active:scale-95 ${address === "📍 Current Location" ? 'bg-primary/20 border-primary text-primary' : ''}`}
                    title="Use GPS Location"
                  >
                    <MapPin className={`w-4 h-4 ${address === "📍 Current Location" ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
                {error && <p className="text-red-400 text-[10px] font-bold bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
                {address === "📍 Current Location" && !error && !isSearching && (
                  <p className="text-green-400 text-[10px] font-bold bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                    Location acquired! Showing nearby colleges.
                  </p>
                )}
              </form>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-4">
                {mappedColleges.map((college) => (
                  <div 
                    key={college.id} 
                    onClick={() => setSelectedCollegeId(college.id)}
                    className={`bg-black/40 border rounded-2xl p-4 cursor-pointer transition-all duration-200 group ${
                      selectedCollegeId === college.id 
                        ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' 
                        : 'border-white/5 hover:border-primary/30 hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-white/10">
                        {college.id}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm leading-tight transition-colors line-clamp-2 ${
                      selectedCollegeId === college.id ? 'text-primary' : 'text-white group-hover:text-primary'
                    }`}>
                      {college.name}
                    </h3>
                    <div className="mt-3 flex flex-col gap-1.5">
                      {college.metro && (
                        <div className="flex items-center gap-2">
                          <Train className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] font-bold text-white/60">
                            {college.metro.station} ({college.metro.distance})
                          </span>
                        </div>
                      )}
                      {college.bmtc && (
                        <div className="flex items-center gap-2">
                          <Bus className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-bold text-white/60 truncate">
                            {college.bmtc.nearest_stop}
                          </span>
                        </div>
                      )}
                    </div>
                    {college.distance !== null && (
                      <div className="mt-3 text-right">
                        <div className="flex items-center gap-1.5 justify-end text-white font-bold">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {college.estTime} mins
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {college.distance.toFixed(1)} km away
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
              <Map colleges={mappedColleges} center={mapCenter} selectedCollegeId={selectedCollegeId} />
            </div>
          </div>
        ) : viewMode === 'metro' ? (
          <div className="flex flex-col gap-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => { setSelectedMetroLine('Purple'); setSelectedStation(null); }}
                className={`p-6 rounded-2xl flex items-center justify-between transition-all border ${
                  selectedMetroLine === 'Purple' ? 'bg-[#91278F] border-[#91278F] shadow-lg text-white' : 'bg-white/[0.02] border-white/5 text-muted-foreground'
                }`}
              >
                <Train className="w-6 h-6" />
                <span className="font-black text-xl">Purple Line</span>
              </button>
              <button
                onClick={() => { setSelectedMetroLine('Green'); setSelectedStation(null); }}
                className={`p-6 rounded-2xl flex items-center justify-between transition-all border ${
                  selectedMetroLine === 'Green' ? 'bg-[#00A651] border-[#00A651] shadow-lg text-white' : 'bg-white/[0.02] border-white/5 text-muted-foreground'
                }`}
              >
                <Train className="w-6 h-6" />
                <span className="font-black text-xl">Green Line</span>
              </button>
              <button
                onClick={() => { setSelectedMetroLine('Yellow'); setSelectedStation(null); }}
                className={`p-6 rounded-2xl flex items-center justify-between transition-all border ${
                  selectedMetroLine === 'Yellow' ? 'bg-[#FFD400] border-[#FFD400] shadow-lg text-black' : 'bg-white/[0.02] border-white/5 text-muted-foreground'
                }`}
              >
                <Train className="w-6 h-6" />
                <span className="font-black text-xl">Yellow Line</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                {metroLines.find(l => l.name.includes(selectedMetroLine || ''))?.stations.map((station) => {
                  const hasColleges = mappedColleges.filter(c => c.metro?.station.includes(station)).length > 0;
                  return (
                    <button
                      key={station}
                      onClick={() => hasColleges && setSelectedStation(station)}
                      className={`w-full text-left p-3 mb-2 rounded-xl transition-all border ${
                        selectedStation === station ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent'
                      } ${!hasColleges ? 'opacity-30' : 'hover:bg-white/5'}`}
                    >
                      <span className="text-sm font-bold">{station}</span>
                    </button>
                  );
                })}
              </div>
              <div className="lg:col-span-8 space-y-4">
                {mappedColleges
                  .filter(c => c.metro?.line === selectedMetroLine && (!selectedStation || c.metro?.station.includes(selectedStation)))
                  .map(college => (
                    <div key={college.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex justify-between items-center group hover:bg-white/[0.05]">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{college.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Nearest Station: {college.metro?.station}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{college.metro?.distance}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Transit Rating</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setSelectedOrigin(null)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${!selectedOrigin ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10'}`}
              >
                All Origins
              </button>
              {bmtcOrigins.map(origin => (
                <button
                  key={origin}
                  onClick={() => setSelectedOrigin(origin)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    selectedOrigin === origin ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {origin}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mappedColleges
                .filter(c => c.bmtc && (!selectedOrigin || c.bmtc.origin === selectedOrigin))
                .map(college => (
                  <div key={college.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                          {college.id}
                        </div>
                        <div className="text-[10px] font-bold text-white/40">{college.bmtc?.origin}</div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-blue-400 transition-colors">{college.name}</h3>
                      <div className="space-y-3 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Nearest Stop</div>
                            <div className="text-sm font-bold text-white/90">{college.bmtc?.nearest_stop}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Bus className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Major Routes</div>
                            <div className="text-xs font-medium text-white/70 leading-relaxed">{college.bmtc?.routes}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Walk from Stop</div>
                            <div className="text-sm font-bold text-green-400">{college.bmtc?.walking_time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedCollegeId(college.id); setViewMode('search'); }}
                      className="mt-6 w-full py-2 bg-white/5 hover:bg-blue-600 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10"
                    >
                      View on Map
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
