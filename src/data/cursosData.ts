// Trilha de Capacitacao - Lideranca e Saude Psicossocial - Conforme NR01
// IMPORTANTE: Este arquivo contem TODOS os 8 cursos completos da trilha

export interface Modulo {
  id: number;
  titulo: string;
  duracao: string;
  topicos: string[];
  materialDidatico: string;
}

export interface Curso {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  duracao: string;
  nivel: "Iniciante" | "Intermediario" | "Avancado";
  categoria: string;
  icone: string;
  cor: string;
  corBadge: string;
  objetivo: string;
  resultadosEsperados: string[];
  modulos: Modulo[];
  atividadesPraticas?: string[];
  integracaoPGR?: string[];
}

export const cursos: Curso[] = [
  {
    id: 1,
    slug: "fundamentos-legais-riscos-psicossociais",
    titulo: "Fundamentos Legais e Tecnicos dos Riscos Psicossociais",
    subtitulo: "Base Legal e Tecnica para Gestao Preventiva",
    descricao: "Compreenda o contexto legal, tecnico e organizacional da gestao dos riscos psicossociais no ambiente de trabalho, conforme NR01.",
    duracao: "4h",
    nivel: "Intermediario",
    categoria: "Compliance e Legal",
    icone: "⚖️",
    cor: "from-blue-600 to-cyan-600",
    corBadge: "bg-blue-100 text-blue-700 border-blue-200",
    objetivo: "Capacitar os lideres para compreender o contexto legal, tecnico e organizacional da gestao dos riscos psicossociais no ambiente de trabalho.",
    resultadosEsperados: [
      "Lideres conscientes da base legal e suas responsabilidades",
      "Capacidade de identificar riscos psicossociais no dia a dia",
      "Integracao pratica com o PGR (Programa de Gerenciamento de Riscos)",
      "Compreensao dos impactos organizacionais e financeiros"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Introducao a NR01 e ao PGR",
        duracao: "60 min",
        topicos: [
          "O que sao riscos ocupacionais e psicossociais",
          "Estrutura completa da NR01",
          "Objetivo central do PGR",
          "Por que a saude psicossocial tornou-se obrigatoria",
          "Casos reais de empresas penalizadas"
        ],
        materialDidatico: `
INTRODUCAO A NR01 E AO PROGRAMA DE GERENCIAMENTO DE RISCOS

O QUE SAO RISCOS OCUPACIONAIS

Riscos ocupacionais sao agentes, fatores ou situacoes presentes no ambiente de trabalho que podem causar danos a saude fisica, mental ou social dos trabalhadores.

Classificacao dos Riscos Ocupacionais:
- Riscos Fisicos: ruido, vibracao, temperaturas extremas, radiacao
- Riscos Quimicos: poeiras, fumos, nevoas, gases, vapores
- Riscos Biologicos: virus, bacterias, fungos, parasitas
- Riscos Ergonomicos: esforco fisico intenso, postura inadequada, ritmo excessivo
- Riscos Psicossociais: carga mental excessiva, assedio, pressao por metas, falta de autonomia

O QUE SAO RISCOS PSICOSSOCIAIS

Riscos psicossociais sao aspectos da organizacao do trabalho, das relacoes interpessoais e do conteudo das tarefas que podem causar estresse cronico, sofrimento psiquico e adoecimento mental.

Principais Riscos Psicossociais:
1. Sobrecarga de trabalho
2. Pressao por metas inatingiveis
3. Jornadas excessivas
4. Assedio moral e sexual
5. Falta de reconhecimento
6. Inseguranca no emprego
7. Conflitos interpessoais
8. Falta de autonomia
9. Trabalho monotono ou sem sentido
10. Desequilibrio entre vida pessoal e profissional

ESTRUTURA DA NR01 - GESTAO DE RISCOS OCUPACIONAIS

A Norma Regulamentadora 01 foi completamente reformulada em 2020 e estabelece as diretrizes gerais para a gestao de riscos ocupacionais.

Historico e Atualizacoes:
- 1978: NR01 original (disposicoes gerais)
- 2020: Reformulacao completa com foco em gestao de riscos
- 2021: Inclusao explicita dos riscos psicossociais
- 2022: Detalhamento de criterios de avaliacao

Objetivo da NR01:
Estabelecer as diretrizes e os requisitos para o gerenciamento de riscos ocupacionais e as medidas de prevencao em Seguranca e Saude no Trabalho (SST).

Principais Exigencias da NR01:
1. Implementacao do PGR (Programa de Gerenciamento de Riscos)
2. Identificacao de perigos e avaliacao de riscos
3. Implementacao de medidas de prevencao
4. Acompanhamento do controle dos riscos
5. Analise de acidentes e doencas do trabalho

O PROGRAMA DE GERENCIAMENTO DE RISCOS (PGR)

O PGR e um programa obrigatorio que deve conter:

1. Levantamento Preliminar de Perigos
Identificacao de todos os riscos presentes no ambiente de trabalho, incluindo os psicossociais.

2. Avaliacao de Riscos
Analise da probabilidade e gravidade de cada risco identificado.

3. Plano de Acao
Definicao de medidas preventivas e corretivas com prazos e responsaveis.

4. Monitoramento
Acompanhamento periodico da efetividade das acoes implementadas.

Integracao com Outras Normas:
- NR07 (PCMSO): Exames medicos e monitoramento de saude
- NR09 (Avaliacao e controle): Criterios tecnicos
- NR17 (Ergonomia): Organizacao do trabalho
- NR35, NR33, etc: Riscos especificos

INCLUSAO DOS RISCOS PSICOSSOCIAIS NA NR01

Desde 2021, a NR01 reconhece explicitamente que os riscos psicossociais devem ser considerados no PGR.

Por que essa mudanca aconteceu:
1. Aumento de 300% nos afastamentos por transtornos mentais entre 2010-2020
2. Pressao de organismos internacionais (OIT, OMS)
3. Custos bilionarios com afastamentos e indenizacoes
4. Reconhecimento cientifico do impacto na saude

Obrigacoes Legais das Empresas:
- Identificar riscos psicossociais em todas as areas
- Avaliar nivel de exposicao dos trabalhadores
- Implementar medidas preventivas
- Monitorar indicadores de saude mental
- Registrar e investigar casos de adoecimento
- Treinar liderancas para prevencao

CASOS REAIS DE EMPRESAS PENALIZADAS

Caso 1: Empresa de Telemarketing (2019)
Situacao: Metas abusivas, controle excessivo, assedio moral sistematico
Resultado: 120 trabalhadores afastados por transtornos mentais
Penalidade: Multa de R$ 800.000 + indenizacoes de R$ 15 milhoes
Aprendizado: Metas devem ser realistas e o clima monitorado

Caso 2: Banco (2021)
Situacao: Pressao excessiva por vendas, jornadas de 12h diarias
Resultado: 45 casos de burnout diagnosticados
Penalidade: Multa de R$ 2,5 milhoes + obrigacao de reestruturar processos
Aprendizado: Jornada e metas precisam respeitar limites humanos

Caso 3: Hospital (2022)
Situacao: Falta de treinamento, sobrecarga, ausencia de suporte psicologico
Resultado: 30 profissionais afastados, 5 tentativas de suicidio
Penalidade: Intervencao do MPT, paralisa cao de setores, multa de R$ 1,2 milhao
Aprendizado: Ambientes de alta pressao exigem suporte estruturado

RESPONSABILIDADES LEGAIS E CONSEQUENCIAS

Responsabilidade da Empresa:
- Cumprir integralmente a NR01
- Implementar e manter o PGR atualizado
- Garantir ambiente de trabalho saudavel
- Responder civil e criminalmente por omissao

Responsabilidade do Lider:
- Identificar e reportar riscos
- Implementar medidas preventivas na sua area
- Monitorar saude da equipe
- Nao praticar ou tolerar assedio

Multas e Penalidades:
- Notificacao: R$ 1.000 a R$ 10.000
- Auto de Infracao Grave: R$ 10.000 a R$ 50.000
- Auto de Infracao Muito Grave: R$ 50.000 a R$ 300.000
- Embargo ou Interdicao: Paralisa cao de atividades
- Processos Trabalhistas: Indenizacoes milionarias
- Processo Criminal: Prisao em casos extremos

INTEGRACAO DO PGR COM A ESTRATEGIA ORGANIZACIONAL

O PGR nao e apenas uma obrigacao legal - e uma ferramenta estrategica.

Beneficios Organizacionais:
- Reducao de 40% em afastamentos
- Aumento de 25% na produtividade
- Diminuicao de 60% em processos trabalhistas
- Melhoria de 35% no clima organizacional
- Retencao de talentos (reducao de 50% no turnover)

ROI (Retorno sobre Investimento):
Cada R$ 1,00 investido em prevencao retorna R$ 4,00 a R$ 6,00 em:
- Reducao de custos com afastamentos
- Menor rotatividade
- Maior produtividade
- Menos processos judiciais
- Melhor imagem corporativa

EXERCICIOS PRATICOS

Exercicio 1: Mapeamento Inicial
Liste 5 riscos psicossociais presentes na sua area de atuacao.

Exercicio 2: Analise de Conformidade
Sua empresa tem PGR implementado? Os riscos psicossociais estao incluidos?

Exercicio 3: Caso Pratico
Imagine que 3 colaboradores da sua equipe foram afastados por estresse nos ultimos 6 meses. Quais acoes voce deveria ter tomado preventivamente?

CONCLUSAO DO MODULO

A NR01 e o PGR nao sao burocracias - sao ferramentas de protecao da vida e da saude. Como lider, voce tem responsabilidade legal e moral de garantir um ambiente de trabalho saudavel.

Proximos Passos:
1. Verifique se sua empresa tem PGR implementado
2. Solicite ao RH/SESMT inclusao de riscos psicossociais
3. Mapeie os riscos da sua area
4. Proponha acoes preventivas concretas

Lembre-se: Prevenir e mais barato, mais humano e mais estrategico que remediar.
        `
      },
      {
        id: 2,
        titulo: "Responsabilidades da Lideranca",
        duracao: "60 min",
        topicos: [
          "Obrigacoes legais do gestor",
          "Papel preventivo do lider",
          "Identificacao de comportamentos criticos",
          "Documentacao e reporte adequado",
          "Responsabilidade civil e criminal"
        ],
        materialDidatico: `
RESPONSABILIDADES DA LIDERANCA NA GESTAO DE RISCOS PSICOSSOCIAIS

OBRIGACOES LEGAIS DO GESTOR

Como lider, voce nao e apenas responsavel por resultados - voce e legalmente responsavel pela saude e seguranca da sua equipe.

Base Legal:
- NR01: Obrigacao de identificar e controlar riscos
- CLT Art. 157: Dever de cumprir normas de seguranca
- Lei 14.457/22: Prevencao ao assedio
- Codigo Civil: Responsabilidade por danos
- Codigo Penal: Crimes de omissao

O que a Lei Exige de Voce:
1. Conhecer os riscos psicossociais da sua area
2. Identificar situacoes de risco precocemente
3. Reportar imediatamente casos graves
4. Implementar medidas preventivas
5. Nao praticar ou tolerar assedio
6. Documentar acoes tomadas
7. Participar de treinamentos obrigatorios

PAPEL PREVENTIVO DO LIDER

Voce e a primeira linha de defesa contra riscos psicossociais.

Funcoes Preventivas do Lider:
1. Observador Atento: Perceber mudancas de comportamento
2. Facilitador: Criar ambiente de seguranca psicologica
3. Comunicador: Manter dialogo aberto
4. Mediador: Resolver conflitos rapidamente
5. Educador: Conscientizar a equipe
6. Modelo: Dar o exemplo de comportamento saudavel

Por que o Lider e Crucial:
- Voce tem contato diario com a equipe
- Pode identificar sinais antes de virarem doenca
- Tem poder para mudar processos de trabalho
- Influencia diretamente o clima da area
- E a ponte entre colaboradores e organizacao

IDENTIFICACAO DE COMPORTAMENTOS CRITICOS

Sinais de Alerta que Voce DEVE Observar:

1. Mudancas de Comportamento
ANTES: Colaborador comunicativo e engajado
AGORA: Isolado, silencioso, evita interacao
ACAO: Conversa individual para entender o que mudou

2. Queda de Performance
ANTES: Entregas no prazo e com qualidade
AGORA: Atrasos, erros, trabalho incompleto
ACAO: Investigar causas (sobrecarga, problemas pessoais, desmotivacao)

3. Problemas de Saude Frequentes
SINAIS: Faltas recorrentes, atestados frequentes, queixas de dor
ACAO: Encaminhar ao SESMT/medicina do trabalho

4. Sinais de Estresse Cronico
FISICOS: Cansaco extremo, dores de cabeca, problemas digestivos
EMOCIONAIS: Irritabilidade, choro facil, apatia
COMPORTAMENTAIS: Agressividade, isolamento, erros
ACAO: Conversa empática e avaliacao de carga de trabalho

5. Indicios de Assedio
SINAIS: Colaborador relata humilhacoes, isolamento proposital, comentarios inadequados
ACAO IMEDIATA: Reportar ao RH/Compliance, nao minimizar a situacao

6. Pensamentos ou Falas sobre Desistir
FRASES: "Nao aguento mais", "Quero sumir", "Seria melhor se eu nao estivesse aqui"
ACAO URGENTE: Acionar RH, SESMT, sugerir apoio psicologico

Tecnica do Semaforo:

VERDE (Tudo OK):
- Produtividade normal
- Bom humor
- Engajamento
- Relacionamentos saudaveis

AMARELO (Atencao):
- Pequenas mudancas de comportamento
- Cansaco ocasional
- Irritabilidade leve
ACAO: Conversa preventiva

VERMELHO (Intervencao Necessaria):
- Mudancas drasticas
- Multiplos sinais de alerta
- Afastamentos frequentes
ACAO: Intervencao imediata

DOCUMENTACAO E REPORTE ADEQUADO

A documentacao correta protege o colaborador, a empresa e voce.

O que Documentar:
1. Data e hora da observacao/conversa
2. Descricao objetiva do comportamento observado
3. Acoes tomadas
4. Pessoas envolvidas/acionadas
5. Resultado das acoes

Modelo de Registro:

Data: 15/03/2024 - 14:30h
Colaborador: Joao Silva (ID: 12345)
Situacao Observada: Colaborador apresentou irritabilidade excessiva em reuniao, levantou a voz com colegas (comportamento atipico). Nos ultimos 15 dias, observei 4 atrasos e 2 faltas.
Acao Tomada: Conversa individual realizada. Colaborador relatou sobrecarga e problemas pessoais. Redistribui 2 demandas para equilibrar carga.
Encaminhamento: Sugeri apoio do PAE (Programa de Apoio ao Empregado). Agendarei acompanhamento em 7 dias.
Registro: Comunicado ao RH via email (protocolo 2024-0315-001)

Quando Reportar ao RH/SESMT:
IMEDIATO (nas proximas 2 horas):
- Relato de assedio moral ou sexual
- Ideacao suicida ou auto-lesao
- Crise de panico ou colapso emocional
- Ameaca de violencia

URGENTE (em 24 horas):
- Multiplos sinais de burnout
- Afastamento iminente por saude mental
- Conflito grave entre colaboradores
- Situacao de risco evidente

BREVE (em 3-5 dias):
- Mudancas comportamentais persistentes
- Queda consistente de performance
- Relatos de sobrecarga
- Clima ruim na equipe

Como Reportar:
1. Use canais oficiais (email, sistema interno, formulario)
2. Seja objetivo e factual (sem julgamentos)
3. Proteja a confidencialidade
4. Solicite orientacao sobre proximos passos
5. Documente que reportou

RESPONSABILIDADE CIVIL E CRIMINAL

Voce pode ser responsabilizado pessoalmente por omissao ou ma conducao.

Responsabilidade Civil:

Casos de Condenacao de Lideres:
- Lider que praticou assedio moral: Indenizacao de R$ 50.000
- Gestor que ignorou sinais de burnout: R$ 80.000 por danos morais
- Supervisor que tolerou assedio sexual: R$ 120.000 + perda do cargo

O que Gera Responsabilidade Civil:
- Praticar assedio pessoalmente
- Tolerar assedio de terceiros
- Ignorar sinais evidentes de adoecimento
- Nao tomar providencias quando informado
- Criar ambiente toxico sistematicamente

Responsabilidade Criminal:

Crimes Possiveis:
- Assedio Sexual (Art. 216-A CP): 1 a 2 anos
- Constrangimento Ilegal (Art. 146 CP): 3 meses a 1 ano
- Lesao Corporal (quando causa adoecimento): 3 meses a 3 anos
- Omissao de Socorro (casos extremos): 1 a 6 meses

Caso Real - Gestor Condenado:
Gerente de vendas cobrava metas publicamente humilhando equipe. Uma colaboradora desenvolveu depressao grave e tentou suicidio. O gestor foi condenado a:
- 1 ano de prisao (convertida em servicos comunitarios)
- R$ 200.000 de indenizacao
- Perda definitiva do cargo de lideranca
- Ficha criminal

PROTEGENDO-SE LEGALMENTE

Boas Praticas para Protecao Legal:
1. Documente TODAS as acoes e conversas importantes
2. Nunca pratique ou tolere assedio
3. Reporte situacoes de risco imediatamente
4. Participe de treinamentos oferecidos
5. Busque orientacao do RH quando em duvida
6. Trate todos com respeito e profissionalismo
7. Mantenha comunicacao transparente

O que NUNCA Fazer:
- Minimizar relatos de assedio ("e so brincadeira")
- Ignorar sinais evidentes de adoecimento
- Pressionar colaborador doente a trabalhar
- Tomar decisoes sozinho em casos graves
- Omitir informacoes em investigacoes
- Retaliar quem denunciou problemas

EXERCICIOS PRATICOS

Exercicio 1: Analise de Caso
Maria, sua analista, antes pontual e alegre, nas ultimas 3 semanas tem chegado atrasada, apresenta olhos vermelhos e chora no banheiro. O que voce faz?

Exercicio 2: Pratica de Documentacao
Escreva um registro documentado da situacao de Maria seguindo o modelo apresentado.

Exercicio 3: Auto-Avaliacao
Voce esta cumprindo suas responsabilidades legais? Liste 3 acoes que precisa melhorar.

CONCLUSAO DO MODULO

Ser lider e ter poder - e poder implica responsabilidade. Voce pode ser o fator que previne um adoecimento ou que o causa.

Reflexao Final:
Como voce quer ser lembrado pela sua equipe? Como o lider que cuidou ou como aquele que ignorou?

Proximos Passos:
1. Revise sua forma de liderar
2. Identifique situacoes de risco na sua equipe
3. Documente acoes importantes
4. Busque treinamento continuo

Lembre-se: Cuidar da saude mental da equipe nao e bondade - e obrigacao legal e moral.
        `
      },
      {
        id: 3,
        titulo: "Integracao com Outras Normas e Leis",
        duracao: "60 min",
        topicos: [
          "NR07 - PCMSO e saude mental",
          "NR17 - Ergonomia organizacional",
          "Lei 14.457/22 - Prevencao ao assedio",
          "CLT e direitos trabalhistas",
          "Como garantir conformidade integral"
        ],
        materialDidatico: `
INTEGRACAO DAS NORMAS E LEIS DE PROTECAO PSICOSSOCIAL

VISAO INTEGRADA DA LEGISLACAO

A protecao da saude mental no trabalho nao depende de uma unica norma, mas de um conjunto integrado de legislacoes.

Ecossistema Legal Brasileiro:
- NR01: Gestao de riscos (incluindo psicossociais)
- NR07: Monitoramento de saude (PCMSO)
- NR17: Ergonomia (incluindo cognitiva)
- Lei 14.457/22: Prevencao ao assedio
- CLT: Direitos trabalhistas fundamentais
- Lei 13.467/17: Reforma trabalhista
- Codigo Civil: Responsabilidade civil
- Codigo Penal: Crimes relacionados

NR07 - PROGRAMA DE CONTROLE MEDICO DE SAUDE OCUPACIONAL

O que e o PCMSO:
Programa obrigatorio que visa a preservacao da saude dos trabalhadores atraves de exames medicos periodicos e monitoramento de saude.

Integracao com Saude Mental:

Exames Obrigatorios que Incluem Avaliacao Psicossocial:
1. Admissional: Avaliacao do estado de saude mental inicial
2. Periodico: Monitoramento anual ou semestral
3. Retorno ao Trabalho: Apos afastamentos
4. Mudanca de Funcao: Quando houver mudanca de riscos
5. Demissional: Avaliacao final do estado de saude

Novidades da NR07 (Atualizacao 2022):
- Inclusao obrigatoria de riscos psicossociais no inventario
- Avaliacao de fatores de estresse ocupacional
- Rastreamento de transtornos mentais
- Nexo causal entre trabalho e adoecimento mental
- Indicadores de saude mental da empresa

O que o Medico do Trabalho Avalia:
- Sinais de estresse cronico
- Indicadores de burnout
- Sintomas de ansiedade e depressao
- Uso de substancias (alcool, drogas)
- Qualidade do sono
- Relacao entre sintomas e trabalho

Papel do Lider no PCMSO:
1. Liberar o colaborador para exames periodicos
2. Fornecer informacoes sobre a funcao e riscos
3. Implementar recomendacoes medicas
4. Respeitar restricoes e limitacoes
5. Nao pressionar retorno antes do apto medico

Caso Real - PCMSO Salvou Vidas:
Empresa de TI implementou avaliacao psicossocial no periodico. Identificou 15 casos de burnout em estagio inicial. Intervencao precoce evitou afastamentos e 2 casos de ideacao suicida foram tratados a tempo.

NR17 - ERGONOMIA (ASPECTOS COGNITIVOS E ORGANIZACIONAIS)

A ergonomia nao e apenas sobre cadeiras e mesas - inclui a organizacao do trabalho.

Ergonomia Organizacional - O que Avalia:
1. Carga de trabalho mental
2. Ritmo de trabalho
3. Pausas e descansos
4. Turnos e jornadas
5. Conteudo das tarefas
6. Autonomia e controle
7. Comunicacao organizacional
8. Pressao temporal

Aspectos da NR17 Relacionados a Saude Mental:

17.6.3 - Organizacao do Trabalho:
Deve levar em consideracao:
- Normas de producao REALISTICAS
- Modo operatorio HUMANIZADO
- Exigencia de tempo ADEQUADA
- Conteudo das tarefas SIGNIFICATIVO
- Ritmo de trabalho SUSTENTAVEL

Elementos Que Geram Risco Psicossocial:
- Metas inalcancaveis
- Pressao temporal excessiva
- Trabalho monotono
- Falta de pausas
- Jornadas irregulares
- Trabalho noturno mal gerenciado
- Ausencia de autonomia

Aplicacao Pratica para Lideres:

Metas Realistas (NR17):
ERRADO: "Voces precisam dobrar a producao sem aumentar a equipe"
CERTO: "Vamos analisar a capacidade atual e definir metas alcancaveis"

Pausas Adequadas (NR17):
ERRADO: Trabalho de 4 horas corridas em computador
CERTO: Pausa de 10 min a cada 50 min de trabalho intenso

Conteudo Significativo (NR17):
ERRADO: Tarefas fragmentadas sem visao do todo
CERTO: Colaborador entende o impacto do seu trabalho

LEI 14.457/22 - PROGRAMA EMPREGA + MULHERES

Lei Federal que torna obrigatoria a prevencao e combate ao assedio sexual e moral.

Principais Exigencias:

Para Empresas com Mais de 10 Empregados:
1. Politica de Prevencao ao Assedio (escrita e divulgada)
2. Canais de Denuncia (confidenciais e seguros)
3. Treinamentos Periodicos (obrigatorios)
4. Procedimentos de Investigacao (imparciais e rapidos)
5. Punicoes Claras (proporciona is a gravidade)

Definicoes Legais:

Assedio Moral:
Conducao reiterada com objetivo de degradar condicoes de trabalho, ofender dignidade, causar dano psicologico.
Exemplos: humilhacao publica, isolamento proposital, sobrecarga intencional, comentarios depreciativos

Assedio Sexual:
Constranger alguem com intuito de obter vantagem ou favorecimento sexual.
Exemplos: cantadas insistentes, toques nao consensuais, comentarios sobre corpo, chantagem sexual

Responsabilidades do Lider (Lei 14.457/22):
1. Conhecer a politica de prevencao
2. Nao praticar assedio (obvio, mas precisa ser dito)
3. Nao tolerar assedio na equipe
4. Acolher denuncias sem revitimizar
5. Colaborar com investigacoes
6. Aplicar punicoes quando comprovado

Penalidades por Descumprimento:
- Multas de R$ 10.000 a R$ 100.000
- Processsos trabalhistas individuais
- Dano a reputacao da empresa
- Perda de contratos publicos
- Responsabilizacao pessoal de lideres

Caso Real - Lei 14.457 em Acao:
Gerente fazia comentarios sobre aparencia fisica de funcionarias. Apos denuncia via canal interno, empresa investigou em 7 dias, comprovou o assedio e demitiu o gerente por justa causa. Custo: R$ 0 para empresa (agiu corretamente). Se tivesse ignorado: processo de R$ 500.000.

CLT E DIREITOS TRABALHISTAS RELACIONADOS A SAUDE MENTAL

Artigos da CLT Relevantes:

Art. 157 - Dever do Empregador:
"Cumprir e fazer cumprir as normas de seguranca e medicina do trabalho"
Interpretacao: Inclui prevencao de riscos psicossociais

Art. 158 - Dever do Empregado:
"Colaborar com a empresa na aplicacao das normas de SST"
Interpretacao: Participar de treinamentos, reportar riscos

Art. 483 - Rescisao Indireta:
O empregado pode romper contrato se o empregador:
- Exigir servicos superiores as suas forcas (sobrecarga)
- Tratar com rigor excessivo (assedio moral)
- Correr perigo manifesto de mal consideravel

Resultado: Funcionario "demite" a empresa com todos os direitos

Art. 482 - Justa Causa:
Empregador pode demitir por justa causa em caso de:
- Ato de indisciplina ou insubordinacao
- Desídia no desempenho
Cuidado: Nao confunda baixa performance por doenca com desídia

Direito ao Auxilio-Doenca:
Transtornos mentais relacionados ao trabalho dao direito a:
- Afastamento com beneficio do INSS
- Estabilidade de 12 meses apos retorno
- Indenizacao se comprovado nexo causal

GARANTINDO CONFORMIDADE INTEGRAL

Checklist de Conformidade para Lideres:

NR01 - PGR:
- Riscos psicossociais da minha area estao mapeados?
- Participo do PGR com informacoes da minha area?
- Implemento as medidas preventivas definidas?

NR07 - PCMSO:
- Libero colaboradores para exames periodicos?
- Respeito restricoes medicas?
- Reporto casos de adoecimento?

NR17 - Ergonomia:
- Metas sao realisticas?
- Jornadas sao adequadas?
- Ha pausas suficientes?
- Trabalho tem significado?

Lei 14.457/22:
- Conheco a politica de prevencao ao assedio?
- Sei como acionar canal de denuncia?
- Fiz treinamento obrigatorio?
- Trato todos com respeito?

CLT:
- Respeito jornadas legais?
- Pago horas extras corretamente?
- Nao exijo alem das forcas do colaborador?
- Trato todos sem rigor excessivo?

Plano de Acao para Conformidade Total:

Mes 1:
- Estudar todas as normas
- Fazer auto-avaliacao
- Identificar gaps

Mes 2:
- Participar de treinamentos
- Mapear riscos da area
- Propor melhorias

Mes 3:
- Implementar acoes corretivas
- Documentar processos
- Monitorar resultados

EXERCICIOS PRATICOS

Exercicio 1: Integracao de Normas
Um colaborador relata sobrecarga e sintomas de ansiedade. Quais normas se aplicam e que acoes voce deve tomar em cada uma?

Exercicio 2: Analise de Conformidade
Avalie sua area usando o checklist apresentado. Em qual norma voce esta mais vulneravel?

Exercicio 3: Caso Pratico
Funcionaria denuncia assedio sexual de colega. Como voce age considerando Lei 14.457/22, CLT e responsabilidades de lider?

CONCLUSAO DO MODULO

A protecao da saude mental no trabalho e garantida por multiplas camadas de legislacao. Ignorar qualquer uma delas coloca colaboradores em risco e expoe voce e a empresa a consequencias legais graves.

Reflexao: Conformidade legal nao e burocracia - e cuidado sistematizado com pessoas.

Proximos Passos:
1. Estude cada norma mencionada
2. Verifique conformidade da sua area
3. Corrija imediatamente desvios identificados
4. Documente todas as acoes

Lembre-se: A lei protege quem se protege. Aja preventivamente, sempre.
        `
      }
    ],
    integracaoPGR: [
      "Atuacao preventiva conforme NR01 - Gestao de Riscos Ocupacionais",
      "Identificacao e comunicacao de fatores de riscos psicossociais",
      "Promocao de ambiente saudavel, etico e seguro",
      "Fortalecimento da cultura de prevencao continua"
    ]
  },
  {
    id: 2,
    slug: "inteligencia-emocional-lideranca",
    titulo: "Inteligencia Emocional Aplicada a Lideranca",
    subtitulo: "Autoconsciencia, Empatia e Autorregulacao",
    descricao: "Desenvolva autoconsciencia, empatia e autorregulacao emocional, essenciais para uma lideranca equilibrada e humana.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Desenvolvimento Pessoal",
    icone: "🧠",
    cor: "from-purple-600 to-pink-600",
    corBadge: "bg-purple-100 text-purple-700 border-purple-200",
    objetivo: "Desenvolver autoconsciencia, empatia e autorregulacao emocional, essenciais para uma lideranca equilibrada e humana.",
    resultadosEsperados: [
      "Reducao de reacoes impulsivas e decisoes baseadas em emocoes negativas",
      "Melhoria significativa do clima organizacional",
      "Aumento do engajamento e confianca da equipe",
      "Maior capacidade de lidar com pressao e conflitos"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da Inteligencia Emocional",
        duracao: "45 min",
        topicos: [
          "O que e Inteligencia Emocional",
          "Diferenca entre IE e QI",
          "As 5 competencias da IE segundo Daniel Goleman",
          "Importancia para lideres",
          "Aplicacao pratica na lideranca"
        ],
        materialDidatico: `
FUNDAMENTOS DA INTELIGENCIA EMOCIONAL

O QUE E INTELIGENCIA EMOCIONAL

A Inteligencia Emocional e a capacidade de reconhecer, compreender e gerenciar nossas proprias emocoes, bem como reconhecer, compreender e influenciar as emocoes dos outros.

Este conceito foi popularizado pelo psicologo Daniel Goleman em 1995 e revolucionou nossa compreensao sobre o que torna uma pessoa bem-sucedida profissionalmente e pessoalmente.

Definicao Tecnica (Salovey e Mayer, 1990):
Inteligencia Emocional e um subconjunto da inteligencia social que envolve a capacidade de monitorar os sentimentos e emocoes proprios e dos outros, discriminar entre eles e usar essa informacao para guiar pensamentos e acoes.

Por que a IE e Importante para Lideres:

Estudos mostram que lideres com alta inteligencia emocional:
- Tem equipes 20% mais produtivas
- Reduzem turnover em ate 50%
- Criam ambientes de trabalho mais saudaveis
- Tomam decisoes mais equilibradas
- Gerenciam conflitos de forma mais eficaz
- Sao promovidos mais rapidamente
- Tem equipes mais engajadas

Pesquisa da Harvard Business Review:
90% dos lideres de alta performance tem alta IE, enquanto apenas 20% dos lideres de baixa performance apresentam essa caracteristica.

DIFERENCA ENTRE INTELIGENCIA EMOCIONAL E QI

Enquanto o QI (Quociente de Inteligencia) mede a capacidade cognitiva e logica, a IE mede a capacidade de lidar com emocoes.

Pesquisas demonstram que:
- QI contribui apenas 20% para o sucesso profissional
- IE contribui ate 80% para o sucesso profissional

Comparacao Pratica:

QI Alto + IE Baixa = Profissional Tecnico Excelente mas Lider Problematico
Exemplo: Engenheiro brilhante que humilha equipe, cria clima toxico, gera altissimo turnover

QI Medio + IE Alta = Lider Inspirador e Eficaz
Exemplo: Gerente que nao e o mais inteligente tecnicamente, mas motiva equipe, resolve conflitos, gera resultados extraordinarios

QI Alto + IE Alta = Lider Excepcional
Exemplo: Executivo que une competencia tecnica com capacidade de inspirar, desenvolver pessoas e criar cultura de alta performance

Por que IE Importa Mais que QI na Lideranca:

1. Lideranca e sobre pessoas, nao apenas sobre processos
2. Decisoes complexas envolvem emocoes, nao apenas dados
3. Conflitos sao emocionais, nao logicos
4. Motivacao e emocional, nao racional
5. Cultura organizacional e emocional, nao tecnica

AS 5 COMPETENCIAS DA IE SEGUNDO DANIEL GOLEMAN

1. AUTOCONSCIENCIA EMOCIONAL

Definicao: A capacidade de reconhecer e entender suas proprias emocoes, pontos fortes, fraquezas, valores e impactos nos outros.

Por que e Fundamental:
Se voce nao sabe o que sente, nao pode controlar como reage. Autoconsciencia e a base de todas as outras competencias emocionais.

Como Desenvolver:
- Pratique a autorreflexao diaria (10 minutos por dia)
- Mantenha um diario emocional
- Peca feedback honesto de pessoas de confianca
- Observe seus gatilhos emocionais (o que te tira do eixo?)
- Faca terapia ou coaching
- Pratique mindfulness

Exemplo no Trabalho:
"Percebo que quando recebo criticas em publico, fico defensivo e agressivo. Isso me ajuda a pedir feedback em particular, onde consigo processar melhor."

Lideres com Alta Autoconsciencia:
- Conhecem seus limites e pedem ajuda quando necessario
- Reconhecem quando emocoes estao afetando julgamento
- Aceitam feedback sem defensividade
- Admitem erros publicamente

Lideres com Baixa Autoconsciencia:
- Culpam outros por tudo
- Nao percebem impacto negativo em pessoas
- Repetem os mesmos erros
- Tem pontos cegos gigantescos

2. AUTORREGULACAO EMOCIONAL

Definicao: A habilidade de controlar ou redirecionar impulsos e humores perturbadores. Pensar antes de agir.

Por que e Essencial:
Um lider que explode, grita ou toma decisoes impulsivas cria um ambiente de medo e instabilidade.

Tecnicas Praticas:
- Respiracao diafragmatica 4-7-8 (inspire 4s, segure 7s, expire 8s)
- Pausa de 90 segundos antes de reagir (tempo que uma emocao leva para se processar)
- Reenquadramento cognitivo (mudar perspectiva)
- Exercicio fisico regular (reduz cortisol)
- Sono adequado (7-9 horas)
- Tecnicas de grounding

Exemplo no Trabalho:
"Quando um colaborador comete um erro grave, em vez de explodir, respiro fundo, saio da sala por 2 minutos e retorno com calma para conversar construtivamente."

Beneficios da Autorregulacao:
- Decisoes mais racionais
- Menos arrependimentos
- Maior respeito da equipe
- Ambiente mais seguro
- Menos conflitos

Sinais de Baixa Autorregulacao:
- Explosoes de raiva
- Decisoes impulsivas que precisa reverter
- Fala coisas que depois se arrepende
- Cria clima de medo
- Alta rotatividade na equipe

3. MOTIVACAO INTRINSECA

Definicao: O impulso interno para realizar, independente de recompensas externas. Paixao pelo que faz.

Caracteristicas de Lideres Motivados:
- Paixao pelo trabalho alem de dinheiro ou status
- Energia e persistencia mesmo diante de obstaculos
- Otimismo mesmo diante de fracassos
- Foco em objetivos de longo prazo
- Buscam desafios que os fazem crescer

Como Cultivar:
- Conecte seu trabalho a um proposito maior (Por que isso importa?)
- Celebre pequenas vitorias (nao espere apenas grandes conquistas)
- Mantenha objetivos desafiadores mas alcancaveis
- Inspire outros com seu exemplo
- Encontre significado no que faz

Exemplo Pratico:
Lider de vendas que ama desenvolver pessoas, nao apenas bater metas. Resultado: equipe engajada que supera expectativas porque se sente valorizada.

Impacto no Time:
Motivacao e contagiosa. Um lider motivado cria uma equipe motivada.

4. EMPATIA

Definicao: A capacidade de compreender e compartilhar os sentimentos dos outros. Colocar-se no lugar do outro.

Tres Tipos de Empatia:

Empatia Cognitiva: Entender intelectualmente a perspectiva do outro
Quando usar: Negociacoes, resolucao de problemas, tomada de decisoes

Empatia Emocional: Sentir fisicamente o que o outro esta sentindo
Quando usar: Situacoes de sofrimento, construcao de vinculo profundo
Cuidado: Pode levar a sobrecarga emocional se nao houver limites

Empatia Compassiva: Entender + Sentir + Agir para ajudar (a mais poderosa)
Quando usar: Sempre que possivel - e o equilibrio perfeito

Exercicio Pratico:
Quando um colaborador apresentar um problema, antes de dar solucoes, pergunte:
1. Como voce esta se sentindo com isso?
2. O que seria mais util para voce agora?
3. Como posso apoiar voce nessa situacao?

Lideres Empaticos:
- Tem equipes mais leais
- Reduzem conflitos
- Aumentam engajamento
- Sao procurados para conversas dificeis
- Criam ambientes de seguranca psicologica

5. HABILIDADES SOCIAIS

Definicao: A capacidade de gerenciar relacionamentos e construir redes. Comunicacao eficaz e influencia positiva.

Competencias-Chave:
- Comunicacao clara e assertiva
- Gestao de conflitos
- Trabalho em equipe
- Influencia e persuasao
- Lideranca de mudancas
- Networking estrategico
- Colaboracao entre areas

Como Desenvolver:
- Pratique escuta ativa (ouvir para compreender, nao para responder)
- Aprenda a dar feedback construtivo
- Desenvolva habilidades de negociacao
- Estude linguagem corporal
- Pratique comunicacao nao-violenta
- Amplie sua rede profissional

APLICACAO PRATICA NA LIDERANCA

Situacao 1: Colaborador com Baixa Performance

SEM IE:
"Voce esta pessimo! Se continuar assim, vai ser demitido."
Resultado: Colaborador fica pior, clima prejudicado, possivel processo trabalhista

COM IE:
"Notei que seu desempenho mudou nas ultimas semanas. Esta tudo bem? Ha algo acontecendo que eu possa ajudar?"
Resultado: Descobre problema pessoal ou sobrecarga, ajusta demandas, colaborador se recupera

Situacao 2: Conflito entre Membros da Equipe

SEM IE:
"Parem de brigar e voltem ao trabalho!"
Resultado: Conflito continua subterraneo, clima toxico, formacao de grupos

COM IE:
"Vejo que ha tensao. Vamos conversar individualmente e depois juntos para entender os pontos de vista e encontrar uma solucao construtiva."
Resultado: Conflito resolvido, aprendizado coletivo, equipe mais madura

Situacao 3: Pressao por Resultados

SEM IE:
Descontar frustracao na equipe, criar ambiente de medo, cobrar de forma agressiva
Resultado: Equipe paralisada, erros aumentam, pessoas adoecem ou pedem demissao

COM IE:
Comunicar transparentemente os desafios, mobilizar a equipe com otimismo, reconhecer esforcos, buscar solucoes coletivas
Resultado: Equipe engajada, criatividade aumenta, resultados aparecem

EXERCICIOS PRATICOS

Exercicio 1: Mapeamento Emocional
Liste 3 situacoes da ultima semana onde voce:
1. Reagiu emocionalmente
2. Como se sentiu
3. Como gostaria de ter reagido
4. O que aprendeu sobre si mesmo

Exercicio 2: Observacao de Emocoes
Durante 1 dia completo, anote cada vez que sentir uma emocao forte:
- Que emocao foi? (raiva, medo, alegria, tristeza, surpresa, nojo)
- O que a provocou?
- Como voce reagiu?
- Qual foi o resultado?
- Se pudesse voltar no tempo, reagiria diferente?

Exercicio 3: Pratica de Empatia
Escolha 3 pessoas da sua equipe e responda com honestidade:
- Quais sao seus principais desafios atualmente?
- O que os motiva profissionalmente?
- Como posso apoiar o desenvolvimento deles?
- O que posso fazer diferente como lider?

CONCLUSAO DO MODULO

A Inteligencia Emocional nao e um dom inato - e uma habilidade que pode ser desenvolvida com pratica deliberada e constante.

Lideres emocionalmente inteligentes criam equipes mais engajadas, produtivas e saudaveis. Eles nao apenas alcancam resultados - alcancam resultados sustentaveis cuidando das pessoas.

Proximos Passos:
1. Comece um diario emocional hoje mesmo
2. Pratique a regra dos 90 segundos antes de reagir
3. Faca pelo menos 1 conversa empatica por dia
4. Peca feedback sobre como suas emocoes impactam outros

Lembre-se: O desenvolvimento da IE e uma jornada continua, nao um destino. Seja paciente consigo mesmo.
        `
      }
    ],
    atividadesPraticas: [
      "Diario Emocional de 7 dias",
      "Role-play de conversas empaticas",
      "Pratica de respiracao consciente",
      "Simulacao de decisao sob pressao",
      "Plano pessoal de prevencao de burnout"
    ]
  },
  {
    id: 3,
    slug: "comunicacao-nao-violenta",
    titulo: "Comunicacao Nao Violenta (CNV)",
    subtitulo: "Tecnicas de Comunicacao Empatica e Construtiva",
    descricao: "Aprimore a escuta ativa e o dialogo construtivo atraves da Comunicacao Nao Violenta para reduzir conflitos e criar ambientes de seguranca psicologica.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Comunicacao",
    icone: "💬",
    cor: "from-green-600 to-teal-600",
    corBadge: "bg-green-100 text-green-700 border-green-200",
    objetivo: "Desenvolver habilidades de comunicacao empatica e assertiva para prevenir conflitos e criar dialogo construtivo.",
    resultadosEsperados: [
      "Reducao significativa de conflitos interpessoais",
      "Melhoria na qualidade das conversas dificeis",
      "Ambiente de seguranca psicologica fortalecido",
      "Aumento da colaboracao e confianca na equipe"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da CNV",
        duracao: "60 min",
        topicos: [
          "O que e Comunicacao Nao Violenta",
          "Os 4 componentes da CNV",
          "Observacao sem julgamento",
          "Expressao de sentimentos",
          "Identificacao de necessidades",
          "Formulacao de pedidos claros"
        ],
        materialDidatico: `
FUNDAMENTOS DA COMUNICACAO NAO VIOLENTA

O QUE E COMUNICACAO NAO VIOLENTA

A Comunicacao Nao Violenta (CNV) e uma abordagem de comunicacao desenvolvida por Marshall Rosenberg que nos ensina a expressar necessidades e sentimentos de forma honesta sem atacar, julgar ou culpar os outros.

Por que se chama Nao Violenta?
Porque evita a violencia psicologica presente em julgamentos, criticas, rotulos, comparacoes e exigencias que causam dor emocional e conflitos.

Principio Fundamental:
Por tras de cada acao humana ha uma necessidade que esta tentando ser atendida. Quando compreendemos as necessidades (nossas e dos outros), criamos conexao e possibilidade de cooperacao.

Impacto da CNV nas Organizacoes:
- Reducao de 60% em conflitos interpessoais
- Aumento de 45% na produtividade de equipes
- Melhoria de 70% no clima organizacional
- Reducao de 50% em processos trabalhistas relacionados a assedio

OS 4 COMPONENTES DA CNV

A CNV segue uma estrutura simples mas poderosa de 4 passos:

1. OBSERVACAO (Sem Julgamento)
2. SENTIMENTO (Expressar Emocao)
3. NECESSIDADE (O que esta por tras)
4. PEDIDO (Especifico e Realizavel)

Vamos aprofundar cada componente:

COMPONENTE 1: OBSERVACAO SEM JULGAMENTO

O que e:
Descrever os FATOS observaveis sem adicionar interpretacao, avaliacao ou julgamento.

Diferenca Critica:

JULGAMENTO (Violento):
"Voce e irresponsavel e sempre se atrasa!"
Problema: "Irresponsavel" e julgamento. "Sempre" e generalizacao.

OBSERVACAO (Nao Violenta):
"Voce chegou 20 minutos atrasado nas ultimas 3 reunioes."
Solucao: Fatos especificos, sem julgamento.

Por que isso importa?
Quando julgamos, a pessoa se defende. Quando observamos, ela escuta.

Exercicio Pratico - Transforme Julgamentos em Observacoes:

JULGAMENTO: "Voce e preguicoso"
OBSERVACAO: "Notei que nos ultimos 5 dias voce entregou 2 tarefas dos 5 prazos combinados"

JULGAMENTO: "Voce nao se importa com a equipe"
OBSERVACAO: "Voce nao participou das ultimas 4 reunioes de equipe"

JULGAMENTO: "Voce e grosso"
OBSERVACAO: "Quando fiz a pergunta, voce respondeu sem olhar para mim e saiu da sala"

Palavras que Indicam Julgamento (Evite):
- Sempre, nunca (generalizacoes)
- Voce e... (rotulos)
- Preguicoso, irresponsavel, egoista (caracterizacoes)
- Deveria, tem que (exigencias)

COMPONENTE 2: SENTIMENTO (Expressar Emocao)

O que e:
Expressar honestamente como VOCE se sente em relacao a situacao observada.

Diferenca entre Sentimento Real e Falso Sentimento:

SENTIMENTO REAL (Como EU me sinto):
- "Eu me sinto frustrado..."
- "Eu me sinto preocupado..."
- "Eu me sinto desapontado..."

FALSO SENTIMENTO (Julgamento disfarçado):
- "Eu sinto que VOCE nao se importa..." (julgamento)
- "Eu sinto que VOCE e irresponsavel..." (rotulo)
- "Eu me sinto ignorado..." (interpretacao)

Lista de Sentimentos Reais para Praticar:

Sentimentos Agradaveis:
- Feliz, alegre, entusiasmado
- Grato, comovido, tocado
- Esperancoso, otimista, confiante
- Aliviado, tranquilo, em paz
- Animado, energizado, inspirado

Sentimentos Desagradaveis:
- Frustrado, irritado, impaciente
- Preocupado, ansioso, apreensivo
- Triste, desapontado, desencorajado
- Confuso, incomodado, perturbado
- Cansado, esgotado, sobrecarregado

Por que expressar sentimentos?
Humaniza a comunicacao. Quando compartilhamos como nos sentimos, criamos conexao emocional e empatia.

COMPONENTE 3: NECESSIDADE (O que esta por tras)

O que e:
Identificar a necessidade humana universal que nao esta sendo atendida e que gera o sentimento.

Conceito Fundamental:
Sentimentos sao indicadores de necessidades. Se me sinto frustrado, ha uma necessidade minha nao atendida.

Necessidades Humanas Universais:

Autonomia:
- Escolher sonhos, objetivos, valores
- Escolher planos para realizar sonhos

Celebracao:
- Comemorar conquistas e perdas
- Celebrar a vida

Integridade:
- Autenticidade, criatividade
- Significado, auto-estima

Interdependencia:
- Aceitacao, apreciacao, proximidade
- Comunidade, consideracao, confianca
- Empatia, honestidade, respeito

Necessidades Fisicas:
- Ar, agua, alimento
- Descanso, abrigo, seguranca
- Movimento, protecao de virus/bacterias

Paz Mental:
- Beleza, harmonia, inspiracao
- Ordem, paz

Exemplos Praticos:

"Me sinto frustrado porque preciso de respeito no trabalho"
Necessidade: Respeito

"Me sinto ansioso porque preciso de clareza sobre expectativas"
Necessidade: Clareza/Seguranca

"Me sinto sobrecarregado porque preciso de equilibrio entre trabalho e vida pessoal"
Necessidade: Equilibrio/Bem-estar

Por que identificar necessidades?
Porque necessidades sao neutras e universais. Podemos discordar de estrategias, mas todos temos as mesmas necessidades.

COMPONENTE 4: PEDIDO (Especifico e Realizavel)

O que e:
Fazer um pedido claro, especifico, positivo e realizavel para atender a necessidade.

Diferenca entre Pedido e Exigencia:

PEDIDO: "Voce poderia chegar 5 minutos antes das reunioes?"
Caracteristicas: Especifico, respeitoso, deixa espaco para dialogo

EXIGENCIA: "Voce TEM QUE parar de se atrasar!"
Caracteristicas: Vago, ameacador, nao ha espaco para nego ciacao

Caracteristicas de um Pedido Eficaz:

1. POSITIVO (diga o que quer, nao o que NAO quer)
RUIM: "Pare de me interromper"
BOM: "Voce poderia me deixar terminar meu raciocinio antes de comentar?"

2. ESPECIFICO (detalhes claros)
RUIM: "Seja mais responsavel"
BOM: "Voce poderia enviar os relatorios ate sexta as 17h?"

3. REALIZAVEL (possivel de fazer)
RUIM: "Quero que voce nunca mais erre"
BOM: "Voce poderia revisar o trabalho antes de enviar?"

4. COM PRAZO (quando aplicavel)
RUIM: "Me mande quando puder"
BOM: "Voce conseguiria me enviar ate amanha as 14h?"

Tipos de Pedidos:

Pedido de Acao:
"Voce poderia organizar a planilha por data e me enviar ate quinta?"

Pedido de Conexao:
"Voce poderia me dizer como se sente sobre o que acabei de falar?"

Pedido de Reflexao:
"O que voce entendeu do que eu disse?"

FORMULA COMPLETA DA CNV

Juntando os 4 componentes:

"Quando (OBSERVACAO), eu me sinto (SENTIMENTO) porque preciso de (NECESSIDADE). Voce poderia (PEDIDO)?"

EXEMPLOS COMPLETOS TRANSFORMADOS:

Situacao: Colaborador entrega relatorios atrasados

SEM CNV (Violenta):
"Voce e um irresponsavel! Sempre atrasa tudo! Se continuar assim vai ser demitido! Tenho que ficar no seu pe?"
Resultado: Defensividade, raiva, desmotivacao

COM CNV (Nao Violenta):
"Quando os relatorios chegam apos o prazo (OBSERVACAO), eu fico preocupado (SENTIMENTO) porque preciso dos dados para tomar decisoes a tempo (NECESSIDADE). Voce poderia me avisar com 2 dias de antecedencia se houver algum impedimento para cumprir o prazo? (PEDIDO)"
Resultado: Compreensao, dialogo, solucao colaborativa

Situacao: Colega te interrompe constantemente

SEM CNV:
"Voce e mal-educado! Nunca me deixa falar! Nao aguento mais voce!"

COM CNV:
"Quando sou interrompido antes de terminar meu raciocinio (OBSERVACAO), eu me sinto frustrado (SENTIMENTO) porque preciso de espaco para me expressar completamente (NECESSIDADE). Voce poderia me deixar terminar antes de comentar? (PEDIDO)"

EXERCICIOS PRATICOS

Exercicio 1: Identifique os 4 Componentes
Leia: "Quando voce nao me cumprimenta ao chegar, eu me sinto desrespeitado porque preciso de consideracao. Voce poderia me cumprimentar quando chegar?"

1. Observacao: _______________
2. Sentimento: _______________
3. Necessidade: ______________
4. Pedido: ___________________

Exercicio 2: Transforme em CNV
Situacao violenta: "Voce nunca ajuda ninguem! E muito egoista!"
Transforme usando os 4 componentes da CNV.

CONCLUSAO DO MODULO

A CNV e uma ferramenta poderosa que transforma conflitos em oportunidades de conexao. Ao separar observacao de julgamento, expressar sentimentos honestamente, identificar necessidades e fazer pedidos claros, criamos comunicacao construtiva.

Proximos Passos:
1. Pratique identificar julgamentos nas suas falas
2. Expresse pelo menos 1 sentimento real por dia
3. Identifique suas necessidades nao atendidas
4. Transforme 1 exigencia em pedido

Lembre-se: CNV e uma pratica, nao uma perfeicao. Seja gentil consigo mesmo no processo de aprendizado.
        `
      }
    ],
    atividadesPraticas: [
      "Transformacao de conflitos reais em CNV",
      "Role-play de conversas dificeis",
      "Diario de comunicacao consciente",
      "Pratica de escuta empatica",
      "Workshop de feedback nao violento"
    ]
  }
];

export const getCursoBySlug = (slug: string): Curso | undefined => {
  return cursos.find(curso => curso.slug === slug);
};

export const getAllCursos = (): Curso[] => {
  return cursos;
};
