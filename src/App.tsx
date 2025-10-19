import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CharacterSelect from "./pages/CharacterSelect";
import Chat from "./pages/Chat";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Setting";
import Layout from "./Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Layout>
                  <Onboarding />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout >
              </ProtectedRoute>
            }
          />
          <Route
            path="/characters"
            element={
              <ProtectedRoute>
                <Layout>
                  <CharacterSelect />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:characterId"
            element={
              <ProtectedRoute>
                  <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
