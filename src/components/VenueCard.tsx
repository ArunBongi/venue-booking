import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    location: string;
    price: number;
    type: string;
    image_url: string | null;
  };
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={venue.image_url || "/placeholder.svg"}
          alt={venue.name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{venue.name}</CardTitle>
          <Badge variant="secondary">{venue.type}</Badge>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {venue.location}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${venue.price}</p>
        <p className="text-muted-foreground">per day</p>
      </CardContent>
      <CardFooter>
        <Link to={`/venues/${venue.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};