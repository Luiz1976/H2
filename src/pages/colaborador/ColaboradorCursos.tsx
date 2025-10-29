import { GraduationCap, BookOpen, Clock, Award, ChevronRight, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ColaboradorCursos() {
  const cursos = [
    {
      id: 1,
      titulo: "Saúde Mental no Trabalho",
      descricao: "Aprenda a identificar sinais de estresse e burnout, e desenvolva estratégias para manter seu bem-estar mental.",
      duracao: "2h 30min",
      nivel: "Iniciante",
      progresso: 0,
      imagem: "🧠",
      categoria: "Bem-estar"
    },
    {
      id: 2,
      titulo: "Gestão de Estresse Ocupacional",
      descricao: "Técnicas práticas para gerenciar o estresse no ambiente de trabalho e melhorar sua qualidade de vida.",
      duracao: "3h 15min",
      nivel: "Intermediário",
      progresso: 0,
      imagem: "🎯",
      categoria: "Desenvolvimento"
    },
    {
      id: 3,
      titulo: "Comunicação Assertiva",
      descricao: "Desenvolva habilidades de comunicação eficaz para melhorar relacionamentos profissionais.",
      duracao: "2h 00min",
      nivel: "Iniciante",
      progresso: 0,
      imagem: "💬",
      categoria: "Soft Skills"
    },
    {
      id: 4,
      titulo: "Equilíbrio Trabalho-Vida",
      descricao: "Estratégias para alcançar um equilíbrio saudável entre vida pessoal e profissional.",
      duracao: "1h 45min",
      nivel: "Iniciante",
      progresso: 0,
      imagem: "⚖️",
      categoria: "Bem-estar"
    },
  ];

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Iniciante":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediário":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Avançado":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cursos de Desenvolvimento
            </h1>
            <p className="text-gray-600 mt-1">
              Invista no seu crescimento pessoal e profissional
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cursos.length}</p>
                  <p className="text-sm text-gray-600">Cursos Disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Cursos Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0h</p>
                  <p className="text-sm text-gray-600">Tempo de Estudo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cursos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursos.map((curso) => (
            <Card 
              key={curso.id} 
              className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 bg-white/90 backdrop-blur overflow-hidden"
              data-testid={`card-curso-${curso.id}`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{curso.imagem}</div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="w-fit text-xs">
                        {curso.categoria}
                      </Badge>
                      <Badge variant="outline" className={`w-fit text-xs ${getNivelColor(curso.nivel)}`}>
                        {curso.nivel}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {curso.titulo}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {curso.descricao}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{curso.duracao}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all"
                  data-testid={`button-iniciar-curso-${curso.id}`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Curso
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Em breve, mais cursos!
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos preparando novos conteúdos para o seu desenvolvimento contínuo.
            </p>
            <div className="flex justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
