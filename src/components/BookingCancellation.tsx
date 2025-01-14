import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingCancellationProps {
  bookingId: string;
  onSuccess: () => void;
  onClose?: () => void;
}

const BookingCancellation = ({ bookingId, onSuccess, onClose }: BookingCancellationProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancellation = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setLoading(true);
    try {
      // Get booking details first
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues(name, owner_id),
          user:profiles(full_name)
        `)
        .eq("id", bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Update booking status
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason.trim()
        })
        .eq("id", bookingId);

      if (updateError) throw updateError;

      // Send notification to venue owner
      const { error: ownerMessageError } = await supabase
        .from("chat_messages")
        .insert([
          {
            sender_id: bookingData.user_id,
            receiver_id: bookingData.venue.owner_id,
            venue_id: bookingData.venue_id,
            content: `Booking cancelled for ${bookingData.venue.name}. Reason: ${reason}`
          }
        ]);

      if (ownerMessageError) throw ownerMessageError;

      toast.success("Booking cancelled successfully");
      onSuccess();
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <XCircle className="w-6 h-6" />
          Cancel Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Please provide a reason for cancellation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[100px]"
        />
        
        <div className="flex gap-3 justify-end">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Back
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleCancellation}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCancellation;