import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Testes from "./pages/Testes";
import Resultados from "./pages/Resultados";
import TesteIntroducao from "./pages/TesteIntroducao";
import TestePerguntas from "./pages/TestePerguntas";
import Resultado from "./pages/Resultado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/testes" 
            element={
              <MainLayout>
                <Testes />
              </MainLayout>
            } 
          />
          <Route 
            path="/resultados" 
            element={
              <MainLayout>
                <Resultados />
              </MainLayout>
            } 
          />
          <Route 
            path="/teste/:testeId/introducao" 
            element={
              <MainLayout>
                <TesteIntroducao />
              </MainLayout>
            } 
          />
          <Route 
            path="/teste/:testeId/perguntas" 
            element={
              <MainLayout>
                <TestePerguntas />
              </MainLayout>
            } 
          />
          <Route 
            path="/resultado/:resultadoId" 
            element={
              <MainLayout>
                <Resultado />
              </MainLayout>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
