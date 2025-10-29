import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Award, Target, CheckCircle2, BookOpen, Play, ChevronRight, FileText, Download, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCursoBySlug } from "@/data/cursosData";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AvaliacaoFinal from "@/components/cursos/AvaliacaoFinal";
import CertificadoView from "@/components/cursos/CertificadoView";

export default function CursoDetalhes() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const curso = getCursoBySlug(slug!);
  const { toast } = useToast();
  const [moduloExpandido, setModuloExpandido] = useState<number | null>(null);

  if (!curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Curso não encontrado</p>
            <Button onClick={() => navigate("/colaborador/cursos")}>
              Voltar para Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buscar ou criar progresso
  const { data: progresso, isLoading: loadingProgresso } = useQuery({
    queryKey: ['/api/cursos/progresso', slug],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/cursos/progresso/${slug}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.status === 404) {
          // Criar novo progresso
          const createResponse = await apiRequest('/api/cursos/progresso', {
            method: 'POST',
            body: JSON.stringify({
              cursoId: curso.id.toString(),
              cursoSlug: slug,
              totalModulos: curso.modulos.length
            })
          });
          return createResponse;
        }
        
        if (!response.ok) throw new Error('Erro ao buscar progresso');
        return response.json();
      } catch (error) {
        console.error('Erro ao buscar/criar progresso:', error);
        throw error;
      }
    }
  });

  // Buscar certificado (se existir)
  const { data: certificado } = useQuery({
    queryKey: ['/api/cursos/certificado', slug],
    queryFn: async () => {
      const response = await fetch(`/api/cursos/certificado/${slug}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Erro ao buscar certificado');
      return response.json();
    }
  });

  // Marcar módulo como completado
  const completarModuloMutation = useMutation({
    mutationFn: async (moduloId: number) => {
      return apiRequest(`/api/cursos/progresso/${slug}/modulo/${moduloId}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cursos/progresso', slug] });
      toast({
        title: "Módulo concluído!",
        description: "Continue progredindo no curso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar o módulo como concluído.",
        variant: "destructive"
      });
    }
  });

  const modulosCompletados = Array.isArray(progresso?.modulosCompletados) 
    ? progresso.modulosCompletados 
    : [];
  
  const progressoPorcentagem = progresso?.progressoPorcentagem || 0;
  const todosModulosCompletados = modulosCompletados.length === curso.modulos.length;
  const avaliacaoHabilitada = todosModulosCompletados && !progresso?.avaliacaoFinalRealizada;
  const avaliacaoRealizada = progresso?.avaliacaoFinalRealizada || false;
  const possuiCertificado = !!certificado;

  const handleCompletarModulo = (moduloId: number) => {
    if (!modulosCompletados.includes(moduloId)) {
      completarModuloMutation.mutate(moduloId);
    }
  };

  if (loadingProgresso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header com Navegação */}
        <Button
          variant="ghost"
          onClick={() => navigate("/colaborador/cursos")}
          className="mb-4"
          data-testid="button-voltar"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Cursos
        </Button>

        {/* Hero Section */}
        <Card className={`border-2 bg-gradient-to-r ${curso.cor} text-white overflow-hidden`}>
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="text-7xl">{curso.icone}</div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {curso.categoria}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {curso.nivel}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {curso.duracao}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{curso.titulo}</h1>
                <p className="text-lg opacity-90">{curso.subtitulo}</p>
                <p className="text-base opacity-80">{curso.descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso */}
        <Card className="border-2 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Seu Progresso</span>
              <span className="text-sm font-bold text-blue-600">{progressoPorcentagem}%</span>
            </div>
            <Progress value={progressoPorcentagem} className="h-3" />
            <p className="text-xs text-gray-600 mt-2">
              {modulosCompletados.length} de {curso.modulos.length} módulos concluídos
            </p>
            
            {todosModulosCompletados && !avaliacaoRealizada && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 Parabéns! Você completou todos os módulos. A avaliação final está disponível!
                </p>
              </div>
            )}

            {possuiCertificado && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 font-medium">
                  Você concluiu o curso e recebeu seu certificado! Veja na aba Certificado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-2">
            <TabsTrigger value="visao-geral" data-testid="tab-visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="modulos" data-testid="tab-modulos">Módulos</TabsTrigger>
            <TabsTrigger value="praticas" data-testid="tab-praticas">Práticas</TabsTrigger>
            <TabsTrigger 
              value="avaliacao" 
              data-testid="tab-avaliacao"
              disabled={!todosModulosCompletados}
              className={todosModulosCompletados ? "bg-green-50" : ""}
            >
              Avaliação
            </TabsTrigger>
            <TabsTrigger 
              value="certificado" 
              data-testid="tab-certificado"
              disabled={!possuiCertificado}
              className={possuiCertificado ? "bg-yellow-50" : ""}
            >
              Certificado
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="visao-geral" className="space-y-6">
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  <CardTitle>Objetivo do Curso</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{curso.objetivo}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-green-600" />
                  <CardTitle>Resultados Esperados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {curso.resultadosEsperados.map((resultado, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{resultado}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Módulos */}
          <TabsContent value="modulos" className="space-y-4">
            {curso.modulos.map((modulo, index) => {
              const moduloConcluido = modulosCompletados.includes(modulo.id);
              const expandido = moduloExpandido === modulo.id;

              return (
                <Card
                  key={modulo.id}
                  className={`border-2 transition-all ${
                    moduloConcluido
                      ? "border-green-200 bg-green-50/50"
                      : "border-gray-100"
                  }`}
                  data-testid={`card-modulo-${modulo.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          moduloConcluido ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {moduloConcluido ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{modulo.titulo}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{modulo.duracao}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expandido && (
                      <ul className="space-y-2 mb-4">
                        {modulo.conteudo.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setModuloExpandido(expandido ? null : modulo.id)}
                        data-testid={`button-ver-modulo-${modulo.id}`}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {expandido ? "Ocultar Conteúdo" : "Ver Conteúdo"}
                      </Button>
                      
                      {!moduloConcluido && (
                        <Button
                          variant="outline"
                          onClick={() => handleCompletarModulo(modulo.id)}
                          disabled={completarModuloMutation.isPending}
                          data-testid={`button-completar-modulo-${modulo.id}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Marcar como Concluído
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Atividades Práticas */}
          <TabsContent value="praticas" className="space-y-4">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                  <CardTitle>Atividades Práticas</CardTitle>
                </div>
                <CardDescription>
                  Exercícios e dinâmicas para aplicar o conhecimento na prática
                </CardDescription>
              </CardHeader>
              <CardContent>
                {curso.atividadesPraticas && curso.atividadesPraticas.length > 0 ? (
                  <ul className="space-y-3">
                    {curso.atividadesPraticas.map((atividade, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{atividade}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    As atividades práticas serão apresentadas durante os módulos do curso.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliação Final */}
          <TabsContent value="avaliacao">
            <AvaliacaoFinal 
              curso={curso}
              progresso={progresso}
              avaliacaoRealizada={avaliacaoRealizada}
            />
          </TabsContent>

          {/* Certificado */}
          <TabsContent value="certificado">
            {certificado ? (
              <CertificadoView certificado={certificado} curso={curso} />
            ) : (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Certificado não disponível
                  </h3>
                  <p className="text-gray-600">
                    Complete a avaliação final com sucesso para receber seu certificado.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
