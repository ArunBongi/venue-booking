import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/venue-booking");
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/venue-booking" className="text-2xl font-bold text-primary">
          VenueBook
        </Link>
        <div className="space-x-4">
          <Link to="/venues">
            <Button variant="ghost">Browse Venues</Button>
          </Link>
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {profile?.is_venue_owner && (
                <>
                  <Link to="/venue-owner">
                    <Button variant="ghost">My Venues</Button>
                  </Link>
                  <Link to="/add-venue">
                    <Button variant="ghost">List Your Venue</Button>
                  </Link>
                </>
              )}
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};