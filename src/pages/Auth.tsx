import { useState } from "react";
import { Eye, EyeOff, Heart, Mail, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.png";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    agreeTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN API
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("token", response.data.token);
        if (!response?.data?.user?.hasCompletedOnboarding) {
          navigate("/onboarding");
        } else {
          navigate("/chat"); 
        }
      } else {
        // REGISTER API
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        if (!formData.agreeTerms) {
          alert("You must accept the terms & privacy policy");
          setLoading(false);
          return;
        }
        const response = await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender
        });
        console.log("Registration Success:", response.data);
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Auth Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-heart opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${0.8 + Math.random() * 0.5}rem`
            }}
          >💖</div>
        ))}
      </div>

      <Card className="w-full max-w-sm rounded-xl shadow-lg z-10">
        <CardHeader className="text-center py-6">
          <div className="flex items-center justify-center space-x-3">
            <img src={logo} alt="LoveAI Logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl font-bold text-gradient">LoveAI</h1>
          </div>
          <h2 className="text-lg font-medium mt-2">{isLogin ? "Welcome Back" : "Join LoveAI"}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isLogin
              ? "Sign in to continue your romantic journey"
              : "Start your journey to find love and companionship"}
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Username"
                  className="pl-10 rounded-xl border-border/50 focus:border-primary text-sm"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 rounded-xl border-border/50 focus:border-primary text-sm"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-9 rounded-xl border-border/50 focus:border-primary text-sm"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-5 w-5 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-10 pr-9 rounded-xl border-border/50 focus:border-primary text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-5 w-5 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>

                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="rounded-xl border-border/50 text-sm">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 text-xs mt-1">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", !!checked)}
                  />
                  <Label htmlFor="agreeTerms" className="text-muted-foreground">
                    I am 18+ and accept the{" "}
                    <a href="#" className="text-primary hover:underline">Terms & Privacy</a>
                  </Label>
                </div>
              </>
            )}

            <Button type="submit" className="w-full btn-romantic flex items-center justify-center text-sm">
              <Heart className="w-4 h-4 mr-1" />
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-xs mt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {loading ? (isLogin ? "Signing In..." : "Creating Account...") : (!isLogin ? "Sign In" : "Create Account")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
