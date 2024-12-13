import { Navbar } from "@/components/Navbar";
import { VenueCard } from "@/components/VenueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [venueType, setVenueType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues', searchQuery, venueType, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*');

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      // Apply venue type filter
      if (venueType && venueType !== 'all') {
        query = query.eq('type', venueType);
      }

      // Apply price range filter
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input 
            placeholder="Search venues..." 
            className="md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={venueType} onValueChange={setVenueType}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Venue Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="wedding">Wedding Venue</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="party">Party Venue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-500">$0 - $500</SelectItem>
              <SelectItem value="501-1000">$501 - $1000</SelectItem>
              <SelectItem value="1001">$1001+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues?.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
            {venues?.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No venues found matching your criteria
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Venues;