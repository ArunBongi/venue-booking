import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <HelpCircle className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Help & Support</h1>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="booking">
                  <AccordionTrigger>How do I book a venue?</AccordionTrigger>
                  <AccordionContent>
                    Browse through our venues, select your preferred date, and click the "Book Now" button. You'll need to be logged in to complete the booking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cancel">
                  <AccordionTrigger>Can I cancel my booking?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your booking through your dashboard. Please check the venue's cancellation policy for any applicable fees.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment">
                  <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                  <AccordionContent>
                    We currently accept major credit cards and bank transfers. More payment options will be added soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help? Our support team is here to assist you.
              </p>
              <p className="text-sm">
                Email: support@venuebook.com<br />
                Phone: 1-800-VENUE-BOOK<br />
                Hours: Monday - Friday, 9 AM - 6 PM EST
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;