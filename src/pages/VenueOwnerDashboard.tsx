import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Building, Calendar, MessageCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import BookingCancellation from "@/components/BookingCancellation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VenueOwnerDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      toast.error("Please login to access the venue owner dashboard");
      navigate("/login");
      return;
    }
  }, [session, navigate]);

  const { data: venues, isLoading: venuesLoading, refetch: refetchVenues } = useQuery({
    queryKey: ["owner-venues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select(`
          *,
          bookings(*)
        `)
        .eq("owner_id", session?.user.id);

      if (error) {
        toast.error("Failed to fetch venues");
        throw error;
      }
      return data;
    },
    enabled: !!session,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["owner-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          *,
          venue:venues(*),
          sender:profiles(*)
        `)
        .eq("receiver_id", session?.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch messages");
        throw error;
      }
      return data;
    },
    enabled: !!session,
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("Booking cancelled successfully");
      refetchVenues();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const handleChatReply = async (senderId: string, venueId: string) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert([
          {
            sender_id: session?.user.id,
            receiver_id: senderId,
            venue_id: venueId,
            content: "Thank you for your interest. How can I help you?",
          },
        ]);

      if (error) throw error;
      toast.success("Reply sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reply");
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Building className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Venue Owner Dashboard</h1>
        </div>

        {(venuesLoading || messagesLoading) ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="venues" className="space-y-6">
            <TabsList>
              <TabsTrigger value="venues">My Venues</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="venues">
              <div className="grid gap-6">
                {venues?.map((venue) => (
                  <Card key={venue.id}>
                    <CardHeader>
                      <CardTitle>{venue.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{venue.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium">${venue.price}/day</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Active Bookings</p>
                            <p className="font-medium">
                              {venue.bookings.filter(b => b.status === "pending").length}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/venues/${venue.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="grid gap-6">
                {venues?.flatMap(venue => 
                  venue.bookings.map(booking => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{venue.name}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Dates</p>
                              <p className="font-medium">
                                {new Date(booking.start_date).toLocaleDateString()} -{" "}
                                {new Date(booking.end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Payment Status</p>
                              <p className="font-medium">{booking.payment_status}</p>
                            </div>
                          </div>
                          {booking.status === 'pending' && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="w-full"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="grid gap-6">
                {messages?.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            From: {message.sender.full_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Venue: {message.venue.name}
                          </p>
                          <p className="mt-2">{message.content}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChatReply(message.sender_id, message.venue_id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default VenueOwnerDashboard;