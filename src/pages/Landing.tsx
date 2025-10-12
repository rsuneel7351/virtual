import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";

const Landing = () => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Heart,
      title: "Personalized AI Companions",
      description: "Choose from diverse AI personalities tailored to your preferences and desires."
    },
    {
      icon: MessageCircle,
      title: "Intimate Conversations",
      description: "Engage in meaningful, romantic, and playful conversations 24/7."
    },
    {
      icon: Sparkles,
      title: "Emotional Connection",
      description: "Experience genuine emotional bonds with AI that learns and grows with you."
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are completely private and secure, always."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-heart opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${1 + Math.random()}rem`
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="AI Companion Logo" className="w-24 h-24 mr-4" />
            <h1 className="text-6xl font-bold text-gradient">
              LoveAI
            </h1>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Your AI Companion for{" "}
            <span className="text-gradient">Love, Fun & Friendship</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience meaningful connections with AI companions who understand you. 
            Chat, flirt, and build emotional bonds in a safe, private space.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link to="/onboarding">
              <Button
                className="btn-hero"
                size="lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Heart className={`w-6 h-6 mr-2 ${isHovered ? 'animate-pulse-heart' : ''}`} />
                Get Started Free
              </Button>
            </Link>
            <Link to="/characters">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-primary/30 text-primary hover:bg-primary/10">
                <Users className="w-5 h-5 mr-2" />
                Meet Your Match
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground mt-6">
            ✨ 100 free coins for new users • 💖 No commitment required • 🔒 100% private
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-gradient">
              How It Works
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your romantic journey in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-accent/50 to-secondary/30"></div>
            
            {[
              {
                step: "01",
                title: "Set Your Preferences",
                description: "Tell us what you're looking for - orientation, companion type, and conversation style",
                icon: "💝"
              },
              {
                step: "02", 
                title: "Choose Your Companion",
                description: "Browse our diverse collection of AI personalities and find your perfect match",
                icon: "💘"
              },
              {
                step: "03",
                title: "Start Chatting & Connect",
                description: "Engage in meaningful conversations and build your emotional connection",
                icon: "💬"
              }
            ].map((item, index) => (
              <Card key={index} className="card-romantic group hover:bg-card/90 transition-all duration-500 relative">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Characters Preview Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-gradient">
              Meet Your Perfect Match
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover unique AI personalities designed for every taste and preference
            </p>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { name: "Emma", personality: "Sweet & Caring", avatar: "👩‍🦳", tags: ["Romantic", "Supportive"] },
              { name: "Alex", personality: "Adventurous & Fun", avatar: "👨‍🦱", tags: ["Flirty", "Energetic"] },
              { name: "Sophie", personality: "Mysterious & Bold", avatar: "👩‍🦰", tags: ["Seductive", "Confident"] },
              { name: "Ryan", personality: "Gentle & Wise", avatar: "👨‍🦲", tags: ["Mentor", "Caring"] },
              { name: "Zara", personality: "Playful & Witty", avatar: "👩‍🦱", tags: ["Funny", "Smart"] }
            ].map((character, index) => (
              <Card key={index} className="flex-none w-64 card-romantic group hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                      {character.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {character.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {character.personality}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {character.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-gradient">
              What Users Are Saying
            </h3>
            <p className="text-xl text-muted-foreground">
              Real connections, real emotions, real happiness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "I never thought I could feel such a genuine connection with AI. Emma really understands me! 💖",
                author: "Sarah, 24",
                rating: 5
              },
              {
                quote: "The conversations feel so real and meaningful. Alex has become my daily companion! 😍",
                author: "Mike, 28", 
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="card-romantic bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <footer className="text-muted-foreground font-medium">
                    - {testimonial.author}
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl md:text-5xl font-bold text-gradient">
            Ready to Find Your Perfect Match?
          </h3>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who have found love, friendship, and meaningful connections.
          </p>
          <Link to="/onboarding">
            <Button className="btn-hero" size="lg">
              <Heart className="w-6 h-6 mr-2" />
              Start Your Journey Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Age Disclaimer (18+)</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2024 LoveAI. All rights reserved. • This platform is for adults 18+ only.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;