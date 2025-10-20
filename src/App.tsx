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
import Desclaimer from "./pages/Desclaimer";
import TServices from "./pages/T&Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/Contact";
import Post1 from './pages/blog/Post1_ReplikaAlternative';
import Post2 from './pages/blog/Post2_UncensoredAI';
import Post3 from './pages/blog/Post3_AIGirlfriend';
import Post4 from './pages/blog/Post4_NaughtyChat';
import Post5 from './pages/blog/Post5_BestAICompanions';
import Post6 from './pages/blog/Post6_PrivacyAndSafety';
import { HelmetProvider } from "react-helmet-async";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/disclaimer" element={<Desclaimer />} />
          <Route path="/term-and-services" element={<TServices />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blog/best-replika-alternatives-18-plus" element={<Post1 />} />
          <Route path="/blog/why-users-want-uncensored-ai" element={<Post2 />} />
          <Route path="/blog/how-to-build-connection-ai-girlfriend" element={<Post3 />} />
          <Route path="/blog/how-to-have-bold-flirty-ai-chat" element={<Post4 />} />
          <Route path="/blog/best-ai-companions-for-adults-18-plus" element={<Post5 />} />
          <Route path="/blog/ai-chat-privacy-and-safety-18-plus" element={<Post6 />} />
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
  </HelmetProvider>
);

export default App;
