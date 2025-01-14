import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

interface BookingPaymentProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

const BookingPayment = ({ bookingId, amount, onSuccess }: BookingPaymentProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with a payment provider
      // For now, we'll simulate a successful payment
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "completed",
          status: "confirmed"
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Payment successful!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">${amount}</div>
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingPayment;