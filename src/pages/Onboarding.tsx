import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Heart, Shield, AlertTriangle, Sparkles } from "lucide-react";

interface OnboardingState {
  orientation: string;
  companionGender: string;
  tonePreference: string[];
  adultMode: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdultModal, setShowAdultModal] = useState(false);
  const [tempAdultMode, setTempAdultMode] = useState(false);
  
  const [preferences, setPreferences] = useState<OnboardingState>({
    orientation: "",
    companionGender: "",
    tonePreference: [],
    adultMode: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const orientationOptions = [
    { id: "straight", label: "Straight", icon: "💕", description: "Attracted to opposite gender" },
    { id: "gay", label: "Gay", icon: "🏳️‍🌈", description: "Attracted to same gender" },
    { id: "lesbian", label: "Lesbian", icon: "🏳️‍🌈", description: "Women attracted to women" },
    { id: "bisexual", label: "Bisexual", icon: "💖", description: "Attracted to multiple genders" },
    { id: "other", label: "Other", icon: "✨", description: "Other orientation" }
  ];

  const genderOptions = [
    { id: "male", label: "Male", icon: "👨", description: "Masculine AI companion" },
    { id: "female", label: "Female", icon: "👩", description: "Feminine AI companion" },
    { id: "both", label: "Both", icon: "👫", description: "Mix of both genders" },
    { id: "surprise", label: "Surprise Me", icon: "🎭", description: "Let us choose for you" }
  ];

  const toneOptions = [
    { id: "sweet", label: "Sweet", icon: "🍯", description: "Gentle, caring, and nurturing" },
    { id: "romantic", label: "Romantic", icon: "🌹", description: "Passionate and loving" },
    { id: "flirty", label: "Flirty", icon: "😘", description: "Playful and charming" },
    { id: "bold", label: "Bold", icon: "🔥", description: "Confident and direct" }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate("/characters", { state: { preferences } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return preferences.orientation !== "";
      case 2: return preferences.companionGender !== "";
      case 3: return preferences.tonePreference.length > 0;
      case 4: return true; // Adult mode is optional
      default: return false;
    }
  };

  const handleOrientationSelect = (orientation: string) => {
    setPreferences(prev => ({ ...prev, orientation }));
  };

  const handleGenderSelect = (gender: string) => {
    setPreferences(prev => ({ ...prev, companionGender: gender }));
  };

  const handleToneToggle = (tone: string) => {
    setPreferences(prev => ({
      ...prev,
      tonePreference: prev.tonePreference.includes(tone)
        ? prev.tonePreference.filter(t => t !== tone)
        : [...prev.tonePreference, tone]
    }));
  };

  const handleAdultModeToggle = (enabled: boolean) => {
    if (enabled) {
      setTempAdultMode(true);
      setShowAdultModal(true);
    } else {
      setPreferences(prev => ({ ...prev, adultMode: false }));
    }
  };

  const confirmAdultMode = () => {
    setPreferences(prev => ({ ...prev, adultMode: true }));
    setShowAdultModal(false);
  };

  const cancelAdultMode = () => {
    setTempAdultMode(false);
    setShowAdultModal(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-heart opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${0.8 + Math.random() * 0.4}rem`
            }}
          >
            💖
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            Let's Get to Know You
          </h1>
          <p className="text-muted-foreground">
            Help us find your perfect AI companion
          </p>
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="card-romantic min-h-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient flex items-center justify-center gap-2">
              {currentStep === 1 && <Heart className="w-6 h-6" />}
              {currentStep === 2 && <Sparkles className="w-6 h-6" />}
              {currentStep === 3 && <span className="text-2xl">🎭</span>}
              {currentStep === 4 && <Shield className="w-6 h-6" />}
              
              {currentStep === 1 && "What kind of connection are you looking for?"}
              {currentStep === 2 && "Preferred AI Companion Gender?"}
              {currentStep === 3 && "Choose Your Conversation Style"}
              {currentStep === 4 && "Privacy & Safety Settings"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Orientation */}
            {currentStep === 1 && (
              <div className="grid gap-4">
                {orientationOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      preferences.orientation === option.id
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary shadow-glow'
                        : 'hover:bg-accent/5'
                    }`}
                    onClick={() => handleOrientationSelect(option.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{option.label}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      {preferences.orientation === option.id && (
                        <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-heart" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 2: Gender Preference */}
            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-4">
                {genderOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg aspect-square ${
                      preferences.companionGender === option.id
                        ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-glow'
                        : 'hover:bg-accent/5'
                    }`}
                    onClick={() => handleGenderSelect(option.id)}
                  >
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-3">
                      <div className="text-4xl">{option.icon}</div>
                      <h3 className="font-semibold text-foreground">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      {preferences.companionGender === option.id && (
                        <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-heart" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 3: Tone Preference */}
            {currentStep === 3 && (
              <div>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Select one or more conversation styles (you can change this later)
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {toneOptions.map((option) => (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        preferences.tonePreference.includes(option.id)
                          ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-glow'
                          : 'hover:bg-accent/5'
                      }`}
                      onClick={() => handleToneToggle(option.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-3xl">{option.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {preferences.tonePreference.includes(option.id) && (
                          <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-heart" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Adult Mode */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Adult Content Settings
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Enable more mature conversations and content (18+ only)
                    </p>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="adult-mode" className="text-base font-semibold">
                          Adult Mode (18+)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enables mature themes and intimate conversations
                        </p>
                      </div>
                      <Switch
                        id="adult-mode"
                        checked={preferences.adultMode}
                        onCheckedChange={handleAdultModeToggle}
                        className="scale-110"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
                  <Shield className="w-4 h-4 mx-auto mb-2" />
                  Your privacy and safety are our top priority. All conversations are encrypted and private.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="rounded-full px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="btn-hero px-8"
          >
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <Heart className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Adult Mode Confirmation Dialog */}
      <Dialog open={showAdultModal} onOpenChange={setShowAdultModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              Age Verification Required
            </DialogTitle>
            <DialogDescription className="space-y-3 text-sm">
              <p>
                By enabling Adult Mode, you confirm that you are:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>At least 18 years old</li>
                <li>Legally allowed to view adult content in your jurisdiction</li>
                <li>Understand this enables mature conversation topics</li>
                <li>Consent to receiving adult-oriented content</li>
              </ul>
              <p className="font-semibold">
                This setting can be changed anytime in your profile settings.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelAdultMode}>
              Cancel
            </Button>
            <Button onClick={confirmAdultMode} className="bg-amber-600 hover:bg-amber-700">
              I am 18+ and Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Onboarding;