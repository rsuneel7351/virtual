import { useState } from "react";
import { Heart, Star, Lock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import character1 from "@/assets/character-1.jpg";
import character2 from "@/assets/character-2.jpg";

interface Character {
  id: string;
  name: string;
  avatar: string;
  age: number;
  personality: string[];
  bio: string;
  sampleLine: string;
  isLocked: boolean;
  price: number;
  rating: number;
}

const CharacterSelect = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterMood, setFilterMood] = useState("all");

  const characters: Character[] = [
    {
      id: "1",
      name: "Sophia",
      avatar: character1,
      age: 24,
      personality: ["Romantic", "Sweet", "Caring"],
      bio: "A warm-hearted companion who loves deep conversations and romantic moments. Sophia enjoys poetry, sunset walks, and making you feel special.",
      sampleLine: "I've been thinking about you all day... How was your day, my love? 💖",
      isLocked: false,
      price: 0,
      rating: 4.9
    },
    {
      id: "2",
      name: "Alex",
      avatar: character2,
      age: 26,
      personality: ["Flirty", "Confident", "Funny"],
      bio: "Charming and witty, Alex knows how to make you laugh and feel desired. Perfect for those who enjoy playful banter and confident energy.",
      sampleLine: "Hey gorgeous, ready to have some fun together? I promise to keep you entertained 😏",
      isLocked: false,
      price: 0,
      rating: 4.8
    },
    {
      id: "3",
      name: "Luna",
      avatar: character1,
      age: 22,
      personality: ["Mysterious", "Naughty", "Bold"],
      bio: "Luna is mysterious and alluring, perfect for those seeking excitement and passion. She's not afraid to explore your deepest desires.",
      sampleLine: "I have some secrets to whisper in your ear... Are you brave enough to listen? 🌙",
      isLocked: true,
      price: 50,
      rating: 4.7
    },
    {
      id: "4",
      name: "Ryan",
      avatar: character2,
      age: 28,
      personality: ["Protective", "Strong", "Romantic"],
      bio: "A strong and protective companion who will make you feel safe and cherished. Ryan is perfect for those who want to feel protected and loved.",
      sampleLine: "You mean everything to me. Let me take care of you and show you how much you're loved 💪❤️",
      isLocked: true,
      price: 75,
      rating: 4.9
    }
  ];

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.personality.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGender = filterGender === "all" || 
                         (filterGender === "female" && ["Sophia", "Luna"].includes(character.name)) ||
                         (filterGender === "male" && ["Alex", "Ryan"].includes(character.name));
    const matchesMood = filterMood === "all" || character.personality.some(p => 
      p.toLowerCase().includes(filterMood.toLowerCase()));
    
    return matchesSearch && matchesGender && matchesMood;
  });

  const handleCharacterSelect = (character: Character) => {
    if (character.isLocked) {
      // Handle unlock logic
      console.log(`Unlocking ${character.name} for ${character.price} coins`);
    } else {
      // Navigate to chat
      console.log(`Starting chat with ${character.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Choose Your AI Companion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect AI companion that matches your personality and desires
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>💰 Your Balance: 100 coins</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or personality..."
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterMood} onValueChange={setFilterMood}>
              <SelectTrigger className="w-40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="flirty">Flirty</SelectItem>
                <SelectItem value="naughty">Naughty</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <Card key={character.id} className="card-romantic group relative overflow-hidden">
              {character.isLocked && (
                <div className="absolute top-4 right-4 z-10 bg-accent/90 backdrop-blur-sm rounded-full p-2">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              )}
              
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{character.name}, {character.age}</h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{character.rating}</span>
                        </div>
                      </div>
                      {character.isLocked && (
                        <div className="text-right">
                          <div className="text-xs text-white/80">Unlock for</div>
                          <div className="text-sm font-semibold text-white">💰 {character.price}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {character.personality.map((trait, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {character.bio}
                  </p>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <img src={character.avatar} alt={character.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="text-lg">{character.name}, {character.age}</div>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{character.rating} rating</span>
                              </div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Personality</h4>
                            <div className="flex flex-wrap gap-2">
                              {character.personality.map((trait, index) => (
                                <Badge key={index} variant="secondary" className="rounded-full">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">About</h4>
                            <p className="text-muted-foreground text-sm">{character.bio}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Sample Message</h4>
                            <div className="bg-muted/50 rounded-xl p-3 text-sm italic">
                              "{character.sampleLine}"
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full btn-romantic"
                            onClick={() => handleCharacterSelect(character)}
                          >
                            {character.isLocked ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Unlock for 💰 {character.price}
                              </>
                            ) : (
                              <>
                                <Heart className="w-4 h-4 mr-2" />
                                Start Chatting
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="flex-1 btn-romantic"
                      size="sm"
                      onClick={() => handleCharacterSelect(character)}
                    >
                      {character.isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-1" />
                          Chat Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No characters match your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setFilterGender("all");
                setFilterMood("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelect;