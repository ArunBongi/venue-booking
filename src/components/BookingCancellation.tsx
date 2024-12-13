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
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason.trim()
        })
        .eq("id", bookingId);

      if (error) throw error;

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