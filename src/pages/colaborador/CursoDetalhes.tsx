import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Award, Target, CheckCircle2, BookOpen, Play, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCursoBySlug } from "@/data/cursosData";
import { useState } from "react";

export default function CursoDetalhes() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const curso = getCursoBySlug(slug!);
  const [moduloAtual, setModuloAtual] = useState(0);

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

  const progresso = (moduloAtual / curso.modulos.length) * 100;

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
              <span className="text-sm font-bold text-blue-600">{Math.round(progresso)}%</span>
            </div>
            <Progress value={progresso} className="h-3" />
            <p className="text-xs text-gray-600 mt-2">
              {moduloAtual} de {curso.modulos.length} módulos concluídos
            </p>
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2">
            <TabsTrigger value="visao-geral" data-testid="tab-visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="modulos" data-testid="tab-modulos">Módulos</TabsTrigger>
            <TabsTrigger value="praticas" data-testid="tab-praticas">Práticas</TabsTrigger>
            <TabsTrigger value="integracao" data-testid="tab-integracao">Integração</TabsTrigger>
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
            {curso.modulos.map((modulo, index) => (
              <Card
                key={modulo.id}
                className={`border-2 transition-all ${
                  index <= moduloAtual
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-gray-100"
                }`}
                data-testid={`card-modulo-${modulo.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        index <= moduloAtual ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {index <= moduloAtual ? (
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
                  <ul className="space-y-2">
                    {modulo.conteudo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => setModuloAtual(Math.min(index + 1, curso.modulos.length))}
                    data-testid={`button-iniciar-modulo-${modulo.id}`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {index <= moduloAtual ? "Revisar Módulo" : "Iniciar Módulo"}
                  </Button>
                </CardContent>
              </Card>
            ))}
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

          {/* Integração com PGR */}
          <TabsContent value="integracao" className="space-y-4">
            <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-xl">🔗 Integração com PGR e NR01</CardTitle>
                <CardDescription>
                  Como este curso contribui para a gestão de riscos psicossociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                {curso.integracaoPGR && curso.integracaoPGR.length > 0 ? (
                  <ul className="space-y-3">
                    {curso.integracaoPGR.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      Este curso está alinhado com as diretrizes da <strong>NR01 – Gestão de Riscos Ocupacionais</strong> e contribui para:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span>Atuação preventiva conforme NR01</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span>Identificação e comunicação de fatores de riscos psicossociais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span>Promoção de ambiente saudável, ético e seguro</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span>Fortalecimento da cultura de prevenção contínua</span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Final */}
        <Card className={`border-2 bg-gradient-to-r ${curso.cor} text-white`}>
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Pronto para começar?</h3>
            <p className="text-lg opacity-90 mb-6">
              Inicie sua jornada de aprendizado agora mesmo!
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => setModuloAtual(1)}
              data-testid="button-iniciar-curso-principal"
            >
              <Play className="h-5 w-5 mr-2" />
              Iniciar Curso Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
