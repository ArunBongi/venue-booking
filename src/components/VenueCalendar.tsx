import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VenueCalendarProps {
  venueId: string;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export const VenueCalendar = ({ venueId, selectedDate, onSelectDate }: VenueCalendarProps) => {
  // Query existing bookings, excluding cancelled ones
  const { data: existingBookings } = useQuery({
    queryKey: ["bookings", venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("venue_id", venueId)
        .eq("status", "pending"); // Only get pending bookings

      if (error) throw error;
      return data;
    },
  });

  // Create array of booked dates
  const bookedDates = existingBookings?.map(booking => new Date(booking.start_date)) || [];

  // Disable past dates and booked dates
  const disabledDays = [
    { before: new Date() },
    ...bookedDates,
  ];

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      disabled={disabledDays}
      className="rounded-md border"
      modifiers={{ booked: bookedDates }}
      modifiersStyles={{
        booked: { 
          backgroundColor: "rgb(239 68 68 / 0.1)",
          color: "rgb(239 68 68)",
          cursor: "not-allowed" 
        }
      }}
      classNames={{
        day_today: "bg-transparent",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
      }}
    />
  );
};