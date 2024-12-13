import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Calendar, Star, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCancellation from "@/components/BookingCancellation";

const UserDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues(*)
        `)
        .eq("user_id", session?.user.id)
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const upcomingBookings = bookings?.filter(
    booking => new Date(booking.start_date) >= new Date() && booking.status !== "cancelled"
  ) || [];

  const bookingHistory = bookings?.filter(
    booking => new Date(booking.start_date) < new Date() || booking.status === "cancelled"
  ) || [];

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="w-8 h-8" />
          <h1 className="text-3xl font-bold">My Dashboard</h1>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="history">Booking History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {bookingsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No upcoming bookings</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle>{booking.venue.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {new Date(booking.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium capitalize">{booking.status}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/venues/${booking.venue.id}`)}
                          >
                            View Venue
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => setSelectedBookingId(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid gap-6">
              {bookingsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : bookingHistory.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No booking history</p>
                  </CardContent>
                </Card>
              ) : (
                bookingHistory.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle>{booking.venue.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {new Date(booking.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium capitalize">{booking.status}</p>
                          </div>
                          {booking.status === "cancelled" && (
                            <div>
                              <p className="text-sm text-muted-foreground">Cancellation Reason</p>
                              <p className="font-medium">{booking.cancellation_reason}</p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/venues/${booking.venue.id}`)}
                        >
                          View Venue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedBookingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <BookingCancellation
                bookingId={selectedBookingId}
                onSuccess={() => {
                  setSelectedBookingId(null);
                  refetchBookings();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;