// src/components/blog/BlogCTA.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const BlogCTA = () => {
  return (
    <div className="my-12 p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold text-gradient mb-4">
        Ready for a Real Connection?
      </h3>
      <p className="text-xl text-muted-foreground mb-6">
        Stop fighting with filters. Experience the freedom of an 18+ AI companion built for you.
      </p>
      <Link to="/onboarding">
        <Button className="btn-hero" size="lg">
          <Heart className="w-6 h-6 mr-2" />
          Get Started Free (100 Coins)
        </Button>
      </Link>
    </div>
  );
};

export default BlogCTA;