import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const navigate=useNavigate()
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
        console.log(character.id)
        // Free character: show rewarded ad
        // console.log("Show rewarded ad for free character...");
        // alert(`Watch a short ad to unlock ${character.name}`); // replace with actual ad SDK
        // after ad finishes:
        // await axios.post(`${BASE_URL}/characters/unlock/${character.id}`, {}, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // });
        // alert(`${character.name} unlocked! Redirecting to chat...`);
        // fetchCharacters();
        // redirect to chat page
        navigate(`/chat/${character.id}`, { state: { character } });
        console.log(`Redirect to chat with ${character.name}`);
      } else {
        // Paid character: deduct coins
        try {
          const res = await axios.post(`${BASE_URL}/characters/unlock/${character.id}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          alert(`Unlocked ${character.name} successfully!`);
          setCoins(res.data.coins);
          fetchCharacters();
        } catch (err: any) {
          alert(err.response?.data?.message || "Failed to unlock character");
        }
      }
    } else {
      // Already unlocked: go to chat
      console.log(`Starting chat with ${character.name}`);
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

      </div>
    </div>
  );
};

export default CharacterSelect;
