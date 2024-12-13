import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { VenueCalendar } from "@/components/VenueCalendar";
import { MapPin, Loader2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const VenueDetails = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBooking, setIsBooking] = useState(false);

  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          owner: profiles(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleBooking = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsBooking(true);

    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const { error } = await supabase
        .from('bookings')
        .insert([{
          venue_id: id,
          user_id: session.user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'pending',
          payment_status: 'pending',
          payment_amount: venue.price
        }]);

      if (error) throw error;
      
      toast.success("Booking request sent successfully!");
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to book venue");
    } finally {
      setIsBooking(false);
    }
  };

  const handleChat = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          venue_id: id,
          sender_id: session.user.id,
          receiver_id: venue.owner.id,
          content: "Hi, I'm interested in your venue!",
        }]);

      if (error) throw error;
      toast.success("Message sent to owner!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to send message");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-xl">Venue not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={venue.image_url || "/placeholder.svg"}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{venue.type}</Badge>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.location}
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">${venue.price}</p>
            <p className="text-muted-foreground mb-4">per day</p>
            <p className="text-gray-600 mb-6">{venue.description}</p>
            <div className="flex gap-4">
              <Button 
                onClick={handleBooking} 
                disabled={isBooking || !selectedDate}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Now'
                )}
              </Button>
              <Button variant="outline" onClick={handleChat}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Owner
              </Button>
            </div>
            {!session && (
              <p className="text-sm text-muted-foreground mt-2">
                Please login to book this venue or chat with the owner
              </p>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <VenueCalendar
                venueId={id || ''}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              {selectedDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected date: {selectedDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueDetails;