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
  sintese: string;
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
        sintese: 'Aguardando dados para análise detalhada.'
      };
    }

    // Usar modelo correto do Gemini (versão v1)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Criar prompt APRIMORADO para análise técnica e profissional
    const prompt = `
Você é Dr. Thiago Mendes, PhD em Psicologia Organizacional (USP), Especialista Sênior em Saúde Mental no Trabalho, certificado ISO 45003:2021, NR-01 e Modelo Karasek-Theorell. Possui 15+ anos de experiência em diagnóstico e intervenção psicossocial organizacional.

CONTEXTO TÉCNICO:
Você está realizando uma análise psicossocial quantitativa e qualitativa para um Programa de Gestão de Riscos (PGR) conforme NR-01 (Portaria MTP nº 6.730/2020). Os dados abaixo foram coletados através de instrumentos psicométricos validados.

DADOS ORGANIZACIONAIS REAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MÉTRICAS PRINCIPAIS:
- Índice Global de Bem-Estar Psicossocial: ${data.indiceGeralBemEstar}% (n=${data.totalColaboradores})
- Amostra Válida: ${data.totalTestesRealizados} testes concluídos
- Taxa de Participação: ${data.cobertura}% (últimos 30 dias: ${data.testesUltimos30Dias} testes)
- Intervalo de Confiança: 95% | Margem de Erro: ±${Math.round(100/Math.sqrt(data.totalTestesRealizados))}%

🧠 DIMENSÕES PSICOSSOCIAIS MENSURADAS:
${data.dimensoes.map(d => `  • ${d.nome}: ${d.percentual}% [${d.nivel}] ${d.percentual < 40 ? '⚠️ CRÍTICO' : d.percentual < 60 ? '⚡ ATENÇÃO' : '✓'}`).join('\n')}

⚖️ FATORES DE RISCO NR-01 (Anexo II):
${data.nr1Fatores.map(f => `  • ${f.fator}: ${f.percentual}% [${f.nivel}] ${f.nivel === 'Crítico' ? '🔴 ALTA SEVERIDADE' : f.nivel === 'Atenção' ? '🟡' : '🟢'}`).join('\n')}

🚨 ALERTAS DETECTADOS:
${data.alertasCriticos.length > 0 ? data.alertasCriticos.map(a => `  ⚠️ ${a}`).join('\n') : '  ✓ Nenhum alerta crítico no momento'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLICITAÇÃO:
Gere uma análise TÉCNICA e PROFISSIONAL com:
1. **Síntese Executiva (insights)**: 3-4 parágrafos robustos (300-400 palavras) incluindo:
   - Interpretação clínica dos índices (use terminologia técnica quando apropriado)
   - Correlações identificadas entre dimensões e fatores NR-01
   - Classificação do perfil de risco organizacional (Baixo/Moderado/Alto/Crítico)
   - Análise preditiva: tendências e riscos emergentes
   - Comparação com benchmarks setoriais (se índice geral estiver abaixo de 60%, mencionar padrões de risco)
   - Referencie frameworks científicos: ISO 45003, Modelo Demanda-Controle (Karasek), NR-01, OMS

2. **Recomendações Estratégicas**: 4-6 ações PRIORIZADAS e ESPECÍFICAS baseadas nos dados

Retorne APENAS JSON válido (sem markdown):
{
  "sintese": "Síntese executiva técnica e profissional de 300-400 palavras, formatada em parágrafos claros, com terminologia científica adequada, correlações estatísticas, análise preditiva e referências normativas (ISO 45003, NR-01, Karasek-Theorell). Use dados REAIS fornecidos.",
  "recomendacoes": [
    {
      "categoria": "Categoria técnica (ex: Intervenção Urgente, Compliance NR-01, Gestão Preventiva, Capacitação Técnica)",
      "prioridade": "Alta/Média (use Alta APENAS se: índice<50, fatores críticos detectados, ou alertas graves)",
      "titulo": "Título técnico impactante (máx. 70 chars)",
      "descricao": "Ação específica, mensurável e acionável com KPIs quando possível (máx. 250 chars)"
    }
  ]
}

DIRETRIZES OBRIGATÓRIAS:
✓ Use APENAS dados fornecidos (não invente estatísticas)
✓ Cite índices reais com precisão: "${data.indiceGeralBemEstar}%" em vez de "baixo"
✓ Linguagem: técnica, empática, baseada em evidências científicas
✓ Mantenha tom profissional consultivo (evite alarmismo, mas seja honesto sobre riscos)
✓ Correlacione dimensões: ex: "Baixo Apoio Social (${data.dimensoes.find(d => d.nome.includes('Apoio'))?.percentual || 'N/A'}%) correlacionado com Alto Estresse..."
✓ Priorize ações por ROI em saúde mental e compliance legal
✓ JSON puro sem formatação markdown
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

    // Gerar insights robustos baseados nos dados reais (fallback profissional)
    let insights = `RESUMO EXECUTIVO\n\n`;
    
    insights += `Foram avaliados ${data.totalColaboradores} colaboradores através de ${data.totalTestesRealizados} testes psicossociais, alcançando uma cobertura de ${data.cobertura}% da população. O Índice Global de Bem-Estar identificado foi de ${data.indiceGeralBemEstar}%.\n\n`;
    
    // Classificação do índice
    insights += `DIAGNÓSTICO\n\n`;
    if (data.indiceGeralBemEstar < 40) {
      insights += `O índice encontra-se em nível CRÍTICO segundo os parâmetros da ISO 45003:2021. Esta situação demanda intervenção imediata da gestão. É necessário implementar ações corretivas urgentes para prevenir agravamento dos riscos psicossociais.\n\n`;
    } else if (data.indiceGeralBemEstar < 60) {
      insights += `O índice situa-se em nível de ATENÇÃO conforme as diretrizes da NR-01. Recomenda-se a implementação de ações preventivas estruturadas para evitar deterioração do ambiente psicossocial.\n\n`;
    } else if (data.indiceGeralBemEstar < 75) {
      insights += `O índice encontra-se em nível MODERADO. A organização apresenta bases sólidas, porém é recomendado fortalecer as políticas de saúde mental e bem-estar para alcançar excelência.\n\n`;
    } else {
      insights += `O índice demonstra condição SAUDÁVEL do ambiente psicossocial. A organização possui práticas efetivas de gestão de pessoas. Recomenda-se manter e aprimorar continuamente estas políticas.\n\n`;
    }
    
    // Análise das dimensões críticas
    const dimensoesCriticas = data.dimensoes.filter(d => d.percentual < 50);
    if (dimensoesCriticas.length > 0) {
      insights += `ÁREAS PRIORITÁRIAS PARA INTERVENÇÃO\n\n`;
      insights += `Foram identificadas ${dimensoesCriticas.length} dimensões que requerem atenção especial:\n`;
      dimensoesCriticas.forEach(d => {
        insights += `• ${d.nome}: ${d.percentual}% (${d.nivel})\n`;
      });
      insights += `\nEstas áreas demandam ações específicas para melhoria dos indicadores.\n\n`;
    }
    
    // Análise dos fatores NR-01
    const fatoresCriticos = data.nr1Fatores.filter(f => f.nivel === 'Crítico');
    if (fatoresCriticos.length > 0) {
      insights += `FATORES DE RISCO CRÍTICOS (NR-01)\n\n`;
      insights += `Conforme Anexo II da Portaria MTP nº 6.730/2020, foram detectados fatores de risco críticos:\n`;
      fatoresCriticos.forEach(f => {
        insights += `• ${f.fator}\n`;
      });
      insights += `\nEstes fatores exigem elaboração de plano de ação imediato.\n\n`;
    }
    
    // Recomendação técnica
    insights += `RECOMENDAÇÃO TÉCNICA\n\n`;
    insights += `Implementar Programa de Gestão de Riscos Psicossociais (PRG) alinhado às diretrizes da NR-01. O programa deve incluir:\n\n`;
    insights += `• Monitoramento contínuo através de indicadores quantitativos\n`;
    insights += `• Intervenções baseadas no Modelo Demanda-Controle-Suporte (Karasek-Theorell, 1990)\n`;
    insights += `• Capacitação de lideranças em gestão de saúde mental\n`;
    insights += `• Revisão periódica dos resultados com periodicidade trimestral\n`;
    insights += `• Canais de escuta e suporte aos colaboradores\n\n`;
    insights += `Todas as ações devem estar documentadas e acompanhadas de cronograma de execução, conforme exigências da legislação vigente.`;
    
    return {
      recomendacoes,
      sintese: insights
    };
  }
}
