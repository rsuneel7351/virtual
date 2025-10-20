import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gradient mb-6">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <p className="text-lg">
                            We'd love to hear from you! Whether you have a question about our features, a support request, or feedback on how we can improve, please reach out.
                        </p>
                        <p>Please note that this is for technical support and business inquiries only. Our AI companions cannot be reached through this form.</p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">General Support</h3>
                                <p>For help with your account or technical issues or any query:</p>
                                <a href="mailto:sunraz1666@gmail.com" className="text-primary hover:underline">sunraz1666@gmail.com</a>
                            </div>

                        </div>
                    </div>

                    {/* Optional Contact Form */}
                    {/* <form className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Send us a message</h2>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Your Email</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="What is your message about?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="Write your message here..." rows={6} />
            </div>
            <Button type="submit" size="lg" className="btn-hero w-full">
              Send Message
            </Button>
          </form> */}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;