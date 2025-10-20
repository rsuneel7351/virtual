import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BASE_URL } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

interface Character {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  orientation: string;
  personality: string[];
  bio?: string;
  sampleLine?: string;
  isAdult: boolean;
  isLocked: boolean;
  price: number;
  rating: number;
  unlocked: boolean; // from user unlock / defaultUnlocked
}

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    fetchCharacters();
    fetchBalance();
  }, []);

  const fetchCharacters = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/characters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCharacters(res.data);
    } catch (err) {
      console.error("Error fetching characters:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/balance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCoins(res.data.coins);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleCharacterSelect = async (character: Character) => {
    if (!character.unlocked) {
      if (character.price === 0) {
        navigate(`/chat/${character.id}`, { state: { character } });
        console.log(`Redirect to chat with ${character.name}`);
      } else {
        try {
          const res = await axios.post(
            `${BASE_URL}/characters/unlock/${character.id}`,
            {},
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );

          alert(`Unlocked ${character.name} successfully!`);
          setCoins(res.data.coins);
          setCharacters((prev) =>
            prev.map((c) =>
              c.id === character.id ? { ...c, unlocked: true } : c
            )
          );
        } catch (err: any) {
          alert(err.response?.data?.message || "Failed to unlock character");
        }
      }
    } else {
      navigate(`/chat/${character.id}`, { state: { character } });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">Choose Your AI Companion</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect AI companion that matches your personality and desires
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>💰 Your Balance: {coins} coins</span>
          </div>
        </div>

        {/* Character Grid */}
        <TooltipProvider>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters?.map((character) => (
              <Card key={character.id} className="card-romantic group relative overflow-hidden">
                {character.isAdult && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                    18+
                  </div>
                )}
                {!character.unlocked && (
                  <div className="absolute top-4 right-4 z-10 bg-accent/90 backdrop-blur-sm rounded-full p-2">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Info Tooltip Icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute bottom-4 right-4 z-10 bg-black/60 p-2 rounded-full cursor-pointer hover:bg-black/80 transition">
                      <Info className="w-3 h-3 text-white" />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="left"          // 👈 positions tooltip on the left
                    sideOffset={8}       // 👈 optional spacing between icon & tooltip
                    className="max-w-xs h-48 bg-background/95 backdrop-blur-md border border-border/40 shadow-lg rounded-xl p-3 text-sm text-foreground"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">{character.name}, {character.age}</p>
                      <p className="text-muted-foreground text-xs">{character.orientation}</p>
                      {character.bio && <p className="mt-1">{character.bio}</p>}
                      <p className="text-xs mt-2">✨ Personality: {character.personality.join(", ")}</p>
                      {character?.isAdult && (
                        <p className="text-xs text-red-500 mt-2 font-medium">
                          ⚠️ 18+ chats don’t keep full memory — only the last 5 messages are remembered.
                        </p>

                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>


                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">
                          {character.name}, {character.age}
                        </h3>
                        {!character.unlocked && (
                          <div className="text-sm text-white font-semibold">💰 {character.price}</div>
                        )}
                      </div>
                      <div className="text-xs text-white mt-1">{character.orientation}</div>
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

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 btn-romantic"
                        size="sm"
                        onClick={() => handleCharacterSelect(character)}
                      >
                        {character.unlocked ? (
                          <>
                            <Heart className="w-4 h-4 mr-1" />
                            Chat Now
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            {character.price === 0
                              ? "Watch Ad to Unlock"
                              : `Unlock for 💰 ${character.price}`}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CharacterSelect;
