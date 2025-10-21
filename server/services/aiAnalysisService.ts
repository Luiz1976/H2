import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface TestResult {
  testeNome: string;
  testeCategoria: string;
  pontuacaoTotal: number;
  metadados: any;
}

interface AnalysisData {
  indiceGeralBemEstar: number;
  totalColaboradores: number;
  totalTestesRealizados: number;
  testesUltimos30Dias: number;
  cobertura: number;
  dimensoes: Array<{
    nome: string;
    percentual: number;
    nivel: string;
  }>;
  nr1Fatores: Array<{
    fator: string;
    nivel: string;
    percentual: number;
  }>;
  alertasCriticos: string[];
}

export async function generatePsychosocialAnalysis(data: AnalysisData): Promise<{
  recomendacoes: Array<{
    categoria: string;
    prioridade: string;
    titulo: string;
    descricao: string;
  }>;
  insights: string;
}> {
  try {
    console.log('🧠 [IA] Iniciando análise psicossocial com Google Gemini...');
    
    // Se não há dados suficientes, retornar recomendações padrão
    if (data.totalTestesRealizados === 0) {
      return {
        recomendacoes: [{
          categoria: 'Dados Insuficientes',
          prioridade: 'Média',
          titulo: 'Coletar Mais Dados',
          descricao: 'Não há testes realizados ainda. Incentive os colaboradores a participarem das avaliações psicossociais.'
        }],
        insights: 'Aguardando dados para análise detalhada.'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Criar prompt detalhado com os dados reais
    const prompt = `
Você é um especialista em Psicologia Organizacional e Saúde Ocupacional, certificado em NR1 (Norma Regulamentadora 1) e ISO 45003.

Analise os seguintes dados psicossociais REAIS de uma empresa:

ÍNDICES GERAIS:
- Índice de Bem-Estar Geral: ${data.indiceGeralBemEstar}%
- Total de Colaboradores: ${data.totalColaboradores}
- Testes Realizados: ${data.totalTestesRealizados}
- Testes nos últimos 30 dias: ${data.testesUltimos30Dias}
- Cobertura: ${data.cobertura}%

DIMENSÕES PSICOSSOCIAIS:
${data.dimensoes.map(d => `- ${d.nome}: ${d.percentual}% (${d.nivel})`).join('\n')}

FATORES DE RISCO NR1:
${data.nr1Fatores.map(f => `- ${f.fator}: ${f.percentual}% (${f.nivel})`).join('\n')}

ALERTAS CRÍTICOS:
${data.alertasCriticos.length > 0 ? data.alertasCriticos.join('\n') : 'Nenhum alerta crítico identificado'}

TAREFA:
Gere exatamente 3-5 recomendações ESPECÍFICAS e ACIONÁVEIS baseadas nesses dados reais.
Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem \`\`\`):

{
  "recomendacoes": [
    {
      "categoria": "Categoria específica (ex: Urgente, NR1 Compliance, Prevenção, Capacitação)",
      "prioridade": "Alta ou Média",
      "titulo": "Título curto e impactante (máximo 60 caracteres)",
      "descricao": "Descrição específica baseada nos dados reais, acionável e prática (máximo 200 caracteres)"
    }
  ],
  "insights": "Um parágrafo resumindo os principais insights desta análise"
}

REGRAS:
1. Seja ESPECÍFICO com os números reais fornecidos
2. Priorize "Alta" APENAS se: índice < 50, fatores críticos, ou alertas graves
3. Use linguagem empática mas profissional
4. Foque em ações práticas e mensuráveis
5. Cite ISO 45003, NR1, ou Karasek-Siegrist quando apropriado
6. NÃO invente dados - use APENAS os fornecidos
7. Retorne APENAS JSON puro, sem formatação markdown
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ [IA] Resposta recebida do Google Gemini');
    console.log('📄 [IA] Texto bruto:', text.substring(0, 200) + '...');

    // Limpar resposta (remover markdown se houver)
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(cleanText);
    
    console.log('✅ [IA] Análise processada com sucesso');
    console.log(`📊 [IA] Recomendações geradas: ${analysis.recomendacoes?.length || 0}`);

    return analysis;

  } catch (error) {
    console.error('❌ [IA] Erro ao gerar análise:', error);
    
    // Fallback: Recomendações baseadas em regras se IA falhar
    const recomendacoes: Array<{
      categoria: string;
      prioridade: string;
      titulo: string;
      descricao: string;
    }> = [];
    
    if (data.indiceGeralBemEstar < 50) {
      recomendacoes.push({
        categoria: 'Urgente',
        prioridade: 'Alta',
        titulo: 'Intervenção Imediata Necessária',
        descricao: `Índice de bem-estar em ${data.indiceGeralBemEstar}%. Ação imediata com programas de apoio psicológico e revisão das condições de trabalho.`
      });
    }

    if (data.nr1Fatores.some(f => f.nivel === 'Crítico')) {
      recomendacoes.push({
        categoria: 'NR1 Compliance',
        prioridade: 'Alta',
        titulo: 'Fatores de Risco Críticos Identificados',
        descricao: 'Fatores de risco psicossociais críticos detectados. Implemente medidas preventivas imediatas conforme NR1.'
      });
    }

    if (data.cobertura < 80) {
      recomendacoes.push({
        categoria: 'Cobertura',
        prioridade: 'Média',
        titulo: 'Aumentar Participação nos Testes',
        descricao: `Apenas ${data.cobertura}% dos colaboradores participaram. Aumente a cobertura para diagnóstico completo.`
      });
    }

    recomendacoes.push({
      categoria: 'Prevenção',
      prioridade: 'Média',
      titulo: 'Programas de Bem-Estar',
      descricao: 'Implemente programas regulares de mindfulness, atividades físicas e gestão de estresse (ISO 45003).'
    });

    return {
      recomendacoes,
      insights: 'Análise gerada por sistema baseado em regras devido a indisponibilidade temporária da IA.'
    };
  }
}
