import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Find Your Perfect Venue
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover and book amazing venues for your next event
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/venues">
              <Button size="lg">Browse Venues</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;