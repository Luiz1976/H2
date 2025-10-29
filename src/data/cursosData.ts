// Trilha de Capacitação - Liderança e Saúde Psicossocial - Conforme NR01

export interface ConteudoTopico {
  titulo: string;
  texto: string;
}

export interface Modulo {
  id: number;
  titulo: string;
  duracao: string;
  topicos: string[];
  materialDidatico: string; // Conteúdo completo do módulo para estudo
}

export interface Curso {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  duracao: string;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
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
    slug: "inteligencia-emocional-lideranca",
    titulo: "Inteligência Emocional Aplicada à Liderança",
    subtitulo: "Autoconsciência, Empatia e Autorregulação",
    descricao: "Desenvolva autoconsciência, empatia e autorregulação emocional, essenciais para uma liderança equilibrada e humana.",
    duracao: "3h",
    nivel: "Intermediário",
    categoria: "Desenvolvimento Pessoal",
    icone: "🧠",
    cor: "from-purple-600 to-pink-600",
    corBadge: "bg-purple-100 text-purple-700 border-purple-200",
    objetivo: "Desenvolver autoconsciência, empatia e autorregulação emocional, essenciais para uma liderança equilibrada e humana.",
    resultadosEsperados: [
      "Redução de reações impulsivas e decisões baseadas em emoções negativas",
      "Melhoria significativa do clima organizacional",
      "Aumento do engajamento e confiança da equipe",
      "Maior capacidade de lidar com pressão e conflitos"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da Inteligência Emocional",
        duracao: "45 min",
        topicos: [
          "O que é Inteligência Emocional (IE)",
          "Diferença entre IE e QI",
          "As 5 competências da IE segundo Daniel Goleman",
          "Autoconsciência emocional",
          "Autorregulação emocional",
          "Motivação intrínseca",
          "Empatia",
          "Habilidades sociais"
        ],
        materialDidatico: `
# Fundamentos da Inteligência Emocional

## O que é Inteligência Emocional?

A Inteligência Emocional (IE) é a capacidade de reconhecer, compreender e gerenciar nossas próprias emoções, bem como reconhecer, compreender e influenciar as emoções dos outros. Este conceito foi popularizado pelo psicólogo Daniel Goleman em 1995 e revolucionou nossa compreensão sobre o que torna uma pessoa bem-sucedida.

### Por que a IE é importante para líderes?

Estudos mostram que líderes com alta inteligência emocional:
- Têm equipes 20% mais produtivas
- Reduzem turnover em até 50%
- Criam ambientes de trabalho mais saudáveis
- Tomam decisões mais equilibradas
- Gerenciam conflitos de forma mais eficaz

## Diferença entre Inteligência Emocional e QI

Enquanto o QI (Quociente de Inteligência) mede a capacidade cognitiva e lógica, a IE mede a capacidade de lidar com emoções. Pesquisas demonstram que:

- **QI** contribui apenas **20%** para o sucesso profissional
- **IE** contribui até **80%** para o sucesso profissional

### Exemplo Prático:
Um gerente com alto QI pode ser excelente em análise de dados e estratégia, mas sem IE adequada, pode:
- Desmotivar a equipe com feedback agressivo
- Não perceber sinais de esgotamento nos colaboradores
- Tomar decisões impulsivas sob pressão
- Criar um ambiente tóxico

## As 5 Competências da IE segundo Daniel Goleman

### 1. Autoconsciência Emocional
A capacidade de reconhecer e entender suas próprias emoções, pontos fortes, fraquezas, valores e impactos nos outros.

**Como desenvolver:**
- Pratique a autorreflexão diária
- Mantenha um diário emocional
- Peça feedback honesto
- Observe seus gatilhos emocionais

**Exemplo no trabalho:**
"Percebo que quando recebo críticas em público, fico defensivo e agressivo. Isso me ajuda a pedir feedback em particular."

### 2. Autorregulação Emocional
A habilidade de controlar ou redirecionar impulsos e humores perturbadores.

**Técnicas práticas:**
- Respiração diafragmática (4-7-8)
- Pausa de 90 segundos antes de reagir
- Reenquadramento cognitivo
- Exercício físico regular

**Exemplo no trabalho:**
"Quando um colaborador comete um erro grave, em vez de explodir, respiro fundo, saio da sala por 2 minutos e retorno com calma para conversar."

### 3. Motivação Intrínseca
O impulso interno para realizar, independente de recompensas externas.

**Características de líderes motivados:**
- Paixão pelo trabalho além de dinheiro ou status
- Energia e persistência
- Otimismo mesmo diante de fracassos
- Foco em objetivos de longo prazo

**Como cultivar:**
- Conecte seu trabalho a um propósito maior
- Celebre pequenas vitórias
- Mantenha objetivos desafiadores
- Inspire outros com seu exemplo

### 4. Empatia
A capacidade de compreender e compartilhar os sentimentos dos outros.

**Tipos de empatia:**
- **Cognitiva**: Entender a perspectiva do outro
- **Emocional**: Sentir o que o outro sente
- **Compassiva**: Agir para ajudar

**Exercício prático:**
Quando um colaborador apresentar um problema, antes de dar soluções, pergunte:
1. "Como você está se sentindo com isso?"
2. "O que seria mais útil para você agora?"
3. "Como posso apoiar você nessa situação?"

### 5. Habilidades Sociais
A capacidade de gerenciar relacionamentos e construir redes.

**Competências-chave:**
- Comunicação clara e assertiva
- Gestão de conflitos
- Trabalho em equipe
- Influência e persuasão
- Networking

## Aplicação Prática na Liderança

### Situação 1: Colaborador com Baixa Performance
**Sem IE:** "Você está péssimo! Se continuar assim, vai ser demitido."
**Com IE:** "Notei que seu desempenho mudou. Está tudo bem? Há algo acontecendo que eu possa ajudar?"

### Situação 2: Conflito entre Membros da Equipe
**Sem IE:** "Parem de brigar e voltem ao trabalho!"
**Com IE:** "Vejo que há tensão. Vamos conversar individualmente e depois juntos para entender os pontos de vista e encontrar uma solução."

### Situação 3: Pressão por Resultados
**Sem IE:** Descontar frustração na equipe, criar ambiente de medo
**Com IE:** Comunicar transparentemente os desafios, mobilizar a equipe com otimismo e estratégia clara

## Exercícios Práticos (Faça Agora!)

### Exercício 1: Mapeamento Emocional
Liste 3 situações da última semana onde você:
1. Reagiu emocionalmente
2. Como se sentiu
3. Como gostaria de ter reagido
4. O que aprendeu

### Exercício 2: Observação de Emoções
Durante 1 dia, anote cada vez que sentir uma emoção forte:
- Que emoção foi?
- O que a provocou?
- Como você reagiu?
- Qual foi o resultado?

### Exercício 3: Prática de Empatia
Escolha 3 pessoas da sua equipe e responda:
- Quais são seus principais desafios atualmente?
- O que os motiva?
- Como posso apoiá-los melhor?

## Conclusão do Módulo

A Inteligência Emocional não é um dom inato - é uma habilidade que pode ser desenvolvida com prática deliberada. Líderes emocionalmente inteligentes criam equipes mais engajadas, produtivas e saudáveis.

**Próximos passos:**
1. Comece um diário emocional hoje
2. Pratique a regra dos 90 segundos antes de reagir
3. Faça pelo menos 1 conversa empática por dia
4. Peça feedback sobre como suas emoções impactam outros

**Lembre-se:** O desenvolvimento da IE é uma jornada contínua, não um destino.
        `
      },
      {
        id: 2,
        titulo: "Reconhecimento de Emoções e Gatilhos",
        duracao: "45 min",
        topicos: [
          "Identificando seus gatilhos emocionais",
          "Técnicas de autorreflexão",
          "Padrões de comportamento sob pressão",
          "A regra dos 90 segundos",
          "Diário emocional"
        ],
        materialDidatico: `
# Reconhecimento de Emoções e Gatilhos

## Entendendo Gatilhos Emocionais

Gatilhos emocionais são estímulos externos que desencadeiam reações emocionais intensas e automáticas. Conhecer seus gatilhos é fundamental para a autorregulação.

### O que são Gatilhos?

Imagine que você está em uma reunião importante e alguém interrompe você constantemente. De repente, você sente:
- Raiva crescendo
- Vontade de reagir agressivamente
- Coração acelerando
- Pensamentos negativos sobre a pessoa

Isso é um gatilho emocional em ação!

## Os Gatilhos Mais Comuns no Ambiente de Trabalho

### 1. Críticas Públicas
**Por que dispara:** Ameaça à autoimagem e status social
**Reação típica:** Defensividade, contra-ataque, vergonha
**Como gerenciar:** Respire, agradeça o feedback, peça para conversar em particular

### 2. Sentimento de Injustiça
**Por que dispara:** Violação de valores pessoais de equidade
**Reação típica:** Indignação, revolta, desejo de vingança
**Como gerenciar:** Busque fatos objetivos, comunique assertivamente, proponha soluções

### 3. Perda de Controle
**Por que dispara:** Necessidade de segurança e previsibilidade
**Reação típica:** Ansiedade, tentativa de microgerenciar, rigidez
**Como gerenciar:** Foque no que você pode controlar, delegue com confiança

### 4. Desrespeito ou Desconsideração
**Por que dispara:** Necessidade de reconhecimento e respeito
**Reação típica:** Raiva, ressentimento, afastamento
**Como gerenciar:** Estabeleça limites claros, comunique expectativas

### 5. Falhas e Erros
**Por que dispara:** Medo do julgamento, perfeccionismo
**Reação típica:** Autocrítica severa, vergonha, paralisia
**Como gerenciar:** Pratique autocompaixão, veja erros como aprendizado

## A Regra dos 90 Segundos

Descoberta pela neurocientista Jill Bolte Taylor: uma emoção dura apenas 90 segundos no corpo se você NÃO a alimentar com pensamentos.

### Como funciona:
1. Você recebe um estímulo (ex: crítica do chefe)
2. O corpo libera hormônios (cortisol, adrenalina)
3. Em 90 segundos, esses hormônios são processados
4. Se você continuar nervoso após 90s, é porque está RE-estimulando a emoção com pensamentos

### Técnica Prática dos 90 Segundos:

PASSO A PASSO:
1. Sinta a emoção surgir
2. Dê nome a ela: "Estou sentindo raiva"
3. Observe no corpo: "Sinto tensão no peito"
4. Respire profundamente 3 vezes
5. Espere 90 segundos SEM reagir
6. Depois, decida conscientemente como agir

## Diário Emocional: Sua Ferramenta de Autoconsciência

### Modelo de Diário Emocional

**Data e Hora:** [Quando aconteceu]
**Situação:** [O que estava acontecendo]
**Gatilho:** [O que desencadeou a emoção]
**Emoção:** [O que você sentiu]
**Intensidade:** [0-10]
**Pensamentos:** [O que passou pela sua cabeça]
**Sensações Físicas:** [O que sentiu no corpo]
**Reação:** [Como você agiu]
**Resultado:** [O que aconteceu]
**Reflexão:** [O que você aprendeu]

### Exemplo Preenchido:

**Data:** 15/03/2024 - 10:30
**Situação:** Apresentando projeto para diretoria
**Gatilho:** Diretor interrompeu minha fala 3 vezes
**Emoção:** Raiva + Frustração + Humilhação
**Intensidade:** 8/10
**Pensamentos:** "Ele não me respeita", "Estou parecendo incompetente", "Vou explodir"
**Sensações Físicas:** Calor no rosto, mãos tremendo, nó na garganta
**Reação:** Pausei, respirei, pedi para terminar minha linha de raciocínio
**Resultado:** Consegui concluir a apresentação, projeto aprovado
**Reflexão:** Interrupções me disparam muito. Preciso estabelecer limites com mais firmeza no início das reuniões.

## Padrões de Comportamento Sob Pressão

### Identifique Seu Padrão Predominante:

#### 1. O Explosivo
- **Reação:** Grita, bate portas, fala de forma agressiva
- **Custo:** Perde respeito da equipe, cria ambiente tóxico
- **Trabalhe:** Técnicas de respiração, pausa antes de reagir

#### 2. O Implodido
- **Reação:** Guarda tudo dentro, não expressa emoções
- **Custo:** Acúmulo leva a explosões ou adoecimento
- **Trabalhe:** Comunicação assertiva, expressão saudável de emoções

#### 3. O Congelado
- **Reação:** Paralisa, não consegue tomar decisões
- **Custo:** Perde oportunidades, parece fraco ou indeciso
- **Trabalhe:** Práticas de grounding, ação mesmo com desconforto

#### 4. O Escapista
- **Reação:** Evita a situação, procrastina, adia confrontos
- **Custo:** Problemas se acumulam, perda de credibilidade
- **Trabalhe:** Enfrentamento gradual, busca de apoio

## Exercícios Práticos de Reconhecimento Emocional

### Exercício 1: Scanner Corporal Emocional
Feche os olhos e escaneie seu corpo da cabeça aos pés:
- Onde você sente tensão?
- Que emoção pode estar associada a essa tensão?
- O que seu corpo está tentando te dizer?

### Exercício 2: Termômetro Emocional
Crie uma escala de 0-10 para suas emoções principais:
- 0-3: Emoção leve, gerenciável
- 4-6: Emoção moderada, requer atenção
- 7-8: Emoção forte, risco de reação impulsiva
- 9-10: Emoção intensa, precisa de pausa imediata

### Exercício 3: Rastreamento de Gatilhos
Durante 1 semana, anote:
- Situações que te irritaram (mesmo que pouco)
- O que essas situações têm em comum?
- Qual necessidade ou valor foi ameaçado?

## Técnicas de Autorreflexão

### Perguntas Poderosas para Autorreflexão:

**Sobre Emoções:**
1. O que estou sentindo agora? Por quê?
2. Essa emoção é proporcional à situação?
3. Que necessidade não atendida está por trás dela?

**Sobre Reações:**
1. Como costumo reagir nessa situação?
2. Esse padrão está me servindo?
3. Como eu gostaria de reagir?

**Sobre Aprendizado:**
1. O que essa emoção está me ensinando sobre mim?
2. Como posso usar esse insight para crescer?
3. O que farei diferente na próxima vez?

## Conclusão do Módulo

O reconhecimento de emoções e gatilhos é a base da inteligência emocional. Sem autoconsciência, não há autorregulação possível.

**Desafio da Semana:**
1. Faça 7 dias consecutivos de diário emocional
2. Pratique a regra dos 90 segundos pelo menos 1 vez ao dia
3. Identifique seus 3 principais gatilhos emocionais
4. Compartilhe com alguém de confiança o que descobriu sobre si mesmo

**Lembre-se:** Conhecer a si mesmo é o primeiro passo para a maestria emocional.
        `
      },
      {
        id: 3,
        titulo: "Empatia e Comunicação Empática",
        duracao: "45 min",
        topicos: [
          "Tipos de empatia",
          "Escuta ativa",
          "Comunicação não-violenta",
          "Leitura de sinais não-verbais",
          "Práticas de empatia no trabalho"
        ],
        materialDidatico: `
# Empatia e Comunicação Empática

## O Poder da Empatia na Liderança

Empatia é a capacidade de se colocar no lugar do outro e compreender seus sentimentos, necessidades e perspectivas. Para líderes, é uma das competências mais transformadoras.

### Dados Impactantes:
- Líderes empáticos aumentam o engajamento em **até 76%**
- Equipes com líderes empáticos são **50% mais criativas**
- A empatia reduz conflitos em **até 65%**

## Os 3 Tipos de Empatia

### 1. Empatia Cognitiva
**O que é:** Entender intelectualmente a perspectiva do outro

**Quando usar:**
- Negociações
- Resolução de problemas
- Tomada de decisões estratégicas

**Como desenvolver:**
- Pergunte: "Por que essa pessoa pensa assim?"
- Busque entender o contexto completo
- Considere valores e crenças diferentes

**Exemplo:**
"Entendo que você acredita que prazos apertados motivam a equipe, mas na perspectiva dos colaboradores, isso gera estresse e queda de qualidade."

### 2. Empatia Emocional
**O que é:** Sentir fisicamente o que o outro está sentindo

**Quando usar:**
- Situações de sofrimento
- Suporte em crises
- Construção de vínculo profundo

**Cuidado:** Pode levar a sobrecarga emocional se não houver limites

**Como desenvolver:**
- Observe expressões faciais
- Atente-se ao tom de voz
- Conecte-se genuinamente

**Exemplo:**
Quando um colaborador chora falando sobre dificuldades pessoais, você sente um aperto no peito e vontade de ajudar.

### 3. Empatia Compassiva (a mais poderosa)
**O que é:** Entender + Sentir + **Agir** para ajudar

**Quando usar:**
- Sempre que possível! É o equilíbrio perfeito
- Gestão de pessoas
- Liderança humanizada

**Como desenvolver:**
- Escute com atenção
- Valide emoções
- Pergunte "Como posso ajudar?"
- **Aja concretamente**

**Exemplo:**
"Vejo que você está sobrecarregado e estressado. Vamos redistribuir algumas tarefas e você pode ter a tarde de quinta-feira livre para resolver suas questões pessoais."

## Escuta Ativa: A Base da Empatia

### O que NÃO é Escuta Ativa:
❌ Esperar sua vez de falar
❌ Planejar sua resposta enquanto o outro fala
❌ Julgar ou dar conselhos não solicitados
❌ Olhar o celular ou se distrair
❌ Interromper constantemente

### O que É Escuta Ativa:
✅ Presença total e atenção plena
✅ Ouvir para compreender, não para responder
✅ Fazer perguntas abertas
✅ Validar emoções
✅ Refletir o que foi dito
✅ Silêncio respeitoso

### Técnica SOLER de Escuta Ativa:

**S** - Squarely face (Ficar de frente para a pessoa)
**O** - Open posture (Postura aberta, sem braços cruzados)
**L** - Lean (Inclinar-se levemente para frente)
**E** - Eye contact (Contato visual adequado)
**R** - Relax (Relaxar e transmitir calma)

### Perguntas Poderosas da Escuta Ativa:

1. "Me conte mais sobre isso..."
2. "Como você está se sentindo em relação a isso?"
3. "O que seria mais útil para você agora?"
4. "Entendi corretamente que...?"
5. "Há algo mais que você gostaria de compartilhar?"

## Comunicação Não-Violenta (CNV)

Desenvolvida por Marshall Rosenberg, a CNV é uma das técnicas mais eficazes de comunicação empática.

### Os 4 Componentes da CNV:

#### 1. Observação (Sem Julgamento)
**Ruim:** "Você é irresponsável e sempre se atrasa!"
**Bom:** "Você chegou 20 minutos atrasado nas últimas 3 reuniões."

#### 2. Sentimento (Expressar Emoção)
**Ruim:** "Você me deixa furioso!"
**Bom:** "Eu me sinto frustrado quando isso acontece."

#### 3. Necessidade (O que está por trás)
**Ruim:** "Você precisa mudar isso agora!"
**Bom:** "Preciso de pontualidade porque temos prazos apertados."

#### 4. Pedido (Específico e Realizável)
**Ruim:** "Seja mais responsável!"
**Bom:** "Você poderia chegar 5 minutos antes das reuniões?"

### Exemplo Completo de CNV:

**Situação:** Colaborador não entrega relatórios no prazo

**Sem CNV:**
"Você é um irresponsável! Sempre atrasa os relatórios e isso prejudica todo mundo! Se continuar assim, vai ser demitido!"

**Com CNV:**
"**(Observação)** Nas últimas 3 semanas, os relatórios foram entregues 2 dias após o prazo. **(Sentimento)** Eu fico preocupado e estressado com isso, **(Necessidade)** porque preciso dos dados para tomar decisões estratégicas a tempo. **(Pedido)** Você poderia me avisar com antecedência se houver algum impedimento para cumprir o prazo, para que possamos buscar soluções juntos?"

## Leitura de Sinais Não-Verbais

### A Regra 7-38-55 de Albert Mehrabian:
- **7%** da comunicação = palavras
- **38%** da comunicação = tom de voz
- **55%** da comunicação = linguagem corporal

### Sinais Não-Verbais Importantes:

#### Sinais de Desconforto/Estresse:
- Braços cruzados
- Evitar contato visual
- Inquietação (mexer caneta, balançar perna)
- Postura fechada
- Tocar o pescoço/rosto
- Respiração acelerada

#### Sinais de Abertura/Conforto:
- Postura relaxada
- Contato visual natural
- Sorriso genuíno
- Inclinação para frente
- Gestos abertos
- Espelhamento inconsciente

#### Sinais de Desinteresse:
- Olhar para o relógio/celular
- Desviar o olhar constantemente
- Postura distante
- Bocejar
- Mexer em objetos

#### Sinais de Concordância:
- Acenar com a cabeça
- Sorrir
- Inclinar-se para frente
- Espelhar sua postura
- Manter contato visual

## Práticas de Empatia no Trabalho

### Prática 1: Check-in Emocional Diário
Inicie reuniões com: "Como cada um está se sentindo hoje, de 0 a 10?"

**Benefícios:**
- Demonstra cuidado genuíno
- Identifica problemas antes de escalarem
- Cria cultura de vulnerabilidade saudável

### Prática 2: Pausas Empáticas
Quando alguém compartilhar algo difícil:
1. Pare tudo que está fazendo
2. Olhe nos olhos
3. Diga: "Obrigado por compartilhar isso comigo"
4. Pergunte: "Como posso apoiar você?"

### Prática 3: Reconhecimento Empático
Reconheça não só resultados, mas esforços e desafios:
- "Sei que você está lidando com questões pessoais difíceis, e admiro sua dedicação."
- "Percebo que esse projeto foi desafiador para você, e mesmo assim você deu o seu melhor."

### Prática 4: Feedb back Empático
**Modelo Sanduíche Empático:**
1. **Reconhecimento:** "Reconheço seu esforço em..."
2. **Observação:** "Notei que [comportamento específico]..."
3. **Impacto:** "Isso gerou [consequência]..."
4. **Apoio:** "Como posso ajudar você a [melhoria desejada]?"

### Prática 5: Perguntas ao invés de Suposições
**Ruim:** "Você está sendo preguiçoso."
**Bom:** "Notei mudança no seu comportamento. Está tudo bem?"

## Exercícios Práticos de Empatia

### Exercício 1: Mapeamento de Empatia
Escolha 3 membros da sua equipe e responda:
1. O que eles veem? (Desafios diários)
2. O que eles ouvem? (Feedbacks, críticas)
3. O que eles pensam e sentem? (Preocupações, motivações)
4. O que eles dizem e fazem? (Comportamentos observáveis)
5. Dores (O que os frustra?)
6. Ganhos (O que os motiva?)

### Exercício 2: Prática de Escuta Profunda
Por 1 semana:
- Em cada conversa, foque 100% na pessoa
- Não planeje sua resposta enquanto o outro fala
- Faça pelo menos 2 perguntas abertas
- Valide pelo menos 1 emoção expressada

### Exercício 3: Reescrita de Conversas
Relembre 3 conversas difíceis recentes.
Reescreva como você falaria usando CNV.
Compare as versões.

## Armadilhas da Empatia (Evite!)

### 1. Empatia Tóxica
Absorver todas as emoções dos outros sem limites
**Solução:** Estabeleça limites saudáveis, pratique autocuidado

### 2. Falsa Empatia
Fingir que se importa apenas para manipular
**Solução:** Seja genuíno, se não pode ajudar, seja honesto

### 3. Salvar vs. Apoiar
Assumir todos os problemas do outro como seus
**Solução:** Empodere, não salve. Pergunte "Como posso apoiar?" ao invés de assumir a solução

### 4. Empatia Seletiva
Ter empatia apenas com quem você gosta
**Solução:** Pratique empatia cognitiva mesmo quando não sentir empatia emocional

## Conclusão do Módulo

Empatia não é fraqueza - é a maior força de um líder. Equipes lideradas com empatia são mais leais, produtivas e engajadas.

**Desafio da Semana:**
1. Pratique SOLER em todas as conversas
2. Use CNV em pelo menos 1 conversa difícil
3. Faça check-in emocional com sua equipe
4. Observe e anote sinais não-verbais de 3 pessoas

**Lembre-se:** "As pessoas podem esquecer o que você disse, mas nunca esquecerão como você as fez sentir." - Maya Angelou
        `
      },
      {
        id: 4,
        titulo: "Gestão de Estresse e Autorregulação",
        duracao: "45 min",
        topicos: [
          "Técnicas de respiração",
          "Mindfulness aplicado",
          "Gestão de conflitos internos",
          "Tomada de decisão sob pressão",
          "Prevenção de burnout"
        ],
        materialDidatico: `
# Gestão de Estresse e Autorregulação

## Entendendo o Estresse no Contexto da Liderança

Liderar é estressante. Pressão por resultados, gerenciamento de conflitos, decisões difíceis, prazos apertados - tudo isso gera estresse constante.

### O Estresse Não é o Inimigo

**Estresse Agudo (Bom):**
- Melhora foco e desempenho
- Aumenta energia momentânea
- Prepara para ação

**Estresse Crônico (Ruim):**
- Prejudica saúde física e mental
- Reduz capacidade de decisão
- Leva ao burnout

**O segredo:** Saber regular o estresse para que ele não se torne crônico.

## Técnicas de Respiração para Autorregulação Imediata

### Técnica 1: Respiração 4-7-8 (Tranquilizante Natural)

**Como fazer:**
1. Inspire pelo nariz contando até 4
2. Segure a respiração contando até 7
3. Expire pela boca contando até 8
4. Repita 4 vezes

**Quando usar:**
- Antes de reuniões importantes
- Quando sentir raiva subindo
- Dificuldade para dormir
- Ansiedade pré-apresentação

**Por que funciona:**
Ativa o sistema nervoso parassimpático (relaxamento) e desativa o sistema simpático (luta ou fuga).

### Técnica 2: Respiração Quadrada (Box Breathing)

**Como fazer:**
1. Inspire contando até 4
2. Segure contando até 4
3. Expire contando até 4
4. Segure contando até 4
5. Repita por 5 minutos

**Quando usar:**
- Momentos de decisão crítica
- Após conflito intenso
- Antes de feedback difícil

**Benefício:** Traz clareza mental e equilíbrio emocional rápido.

### Técnica 3: Respiração Diafragmática

**Como fazer:**
1. Coloque uma mão no peito, outra na barriga
2. Inspire profundamente pelo nariz
3. A mão da barriga deve subir mais que a do peito
4. Expire lentamente pela boca
5. Continue por 5 minutos

**Benefício:** Reduz cortisol (hormônio do estresse) em até 30%.

## Mindfulness Aplicado à Liderança

### O que é Mindfulness?

Atenção plena no momento presente, sem julgamento. Para líderes, significa:
- Estar 100% presente em conversas
- Tomar decisões conscientes, não reativas
- Observar emoções sem ser dominado por elas

### Prática 1: STOP (Pausa Consciente)

Quando sentir estresse ou emoção forte:

**S** - Stop (Pare o que está fazendo)
**T** - Take a breath (Respire fundo 3 vezes)
**O** - Observe (Observe suas emoções e pensamentos)
**P** - Proceed (Prossiga conscientemente)

**Exemplo real:**
Você recebe um email agressivo de um cliente. Ao invés de responder imediatamente com raiva:
1. PARE de digitar
2. RESPIRE 3 vezes profundamente
3. OBSERVE: "Estou sentindo raiva porque me senti desrespeitado"
4. PROSSIGA: Responda profissionalmente após 30 minutos

### Prática 2: Mindfulness de 3 Minutos

**Como fazer:**
1. Sente-se confortavelmente
2. Feche os olhos
3. Observe sua respiração por 3 minutos
4. Quando a mente divagar, gentilmente volte à respiração

**Quando fazer:**
- Ao chegar ao trabalho (preparação mental)
- Antes do almoço (reset)
- Final do dia (descompressão)

**Benefícios comprovados:**
- Reduz ansiedade em 32%
- Melhora foco em 20%
- Aumenta satisfação no trabalho em 23%

### Prática 3: Observação Mindful

Durante uma reunião ou conversa estressante:
1. Observe seus pensamentos como nuvens passando
2. Note emoções sem julgá-las
3. Retorne à conversa sempre que se distrair

## Gestão de Conflitos Internos

### O que são Conflitos Internos?

Batalhas entre diferentes partes de você:
- "Devo ser rigoroso ou flexível?"
- "Quero ser querido, mas preciso ser firme"
- "Devo priorizar resultados ou pessoas?"

### Técnica das 3 Cadeiras

**Cadeira 1 - Você Líder:**
- O que meu papel de líder exige?
- Qual a decisão estratégica correta?

**Cadeira 2 - Você Pessoa:**
- O que meus valores pessoais dizem?
- Como isso me afeta emocionalmente?

**Cadeira 3 - Observador Neutro:**
- Se eu fosse um consultor externo, o que recomendaria?
- Qual a visão mais ampla da situação?

**Exercício prático:**
Escolha um conflito atual. Sente-se fisicamente em 3 cadeiras diferentes e responda as perguntas de cada perspectiva. Depois, integre as 3 visões.

## Tomada de Decisão Sob Pressão

### O Problema

Sob estresse, o córtex pré-frontal (área racional) fica comprometido e a amígdala (área emocional) assume. Resultado: decisões impulsivas e ruins.

### Protocolo de Decisão Consciente

#### Decisões de Baixo Impacto (5 min):
1. Respire 3 vezes
2. Liste 2-3 opções
3. Escolha e aja

#### Decisões de Médio Impacto (1 hora):
1. Defina o problema claramente
2. Liste prós e contras de cada opção
3. Consulte 1-2 pessoas de confiança
4. Durma sobre isso se possível
5. Decida

#### Decisões de Alto Impacto (1-3 dias):
1. Separe fatos de emoções
2. Analise impactos de curto, médio e longo prazo
3. Consulte stakeholders relevantes
4. Faça análise de risco
5. Durma 2 noites sobre isso
6. Decida e comunique claramente

### Perguntas Decisórias Poderosas:

1. "O que eu faria se não tivesse medo?"
2. "Como verei isso daqui a 5 anos?"
3. "Qual decisão estaria alinhada com meus valores?"
4. "O que Steve Jobs/Minha maior inspiração faria?"
5. "Qual é o pior cenário possível e posso lidar com ele?"

## Prevenção de Burnout

### Os 5 Estágios do Burnout:

**Estágio 1: Lua de Mel**
- Alta energia e entusiasmo
- Comprometimento excessivo
⚠️ Sinal: "Posso fazer tudo sozinho!"

**Estágio 2: Início do Estresse**
- Dificuldade de concentração
- Problemas de sono ocasionais
- Irritabilidade leve
⚠️ Sinal: "Estou um pouco cansado ultimamente"

**Estágio 3: Estresse Crônico**
- Procrastinação
- Cinismo crescente
- Negligência de necessidades pessoais
⚠️ Sinal: "Não aguento mais isso"

**Estágio 4: Burnout**
- Exaustão física e emocional
- Isolamento social
- Pensamentos de escapar ou desistir
⚠️ Sinal: "Não tenho mais nada para dar"

**Estágio 5: Burnout Habitual**
- Depressão crônica
- Doenças físicas frequentes
- Desespero persistente
⚠️ Sinal: "Não consigo mais funcionar"

### Prevenção: As 7 Práticas Essenciais

#### 1. Limites Claros (Boundaries)
- Horário de trabalho definido
- "Não" sem culpa para demandas extras
- Email desligado após horário

#### 2. Pausas Estratégicas
- 5 min de pausa a cada 50 min de trabalho
- 1 dia completo off por semana
- Férias reais (sem trabalho!)

#### 3. Atividade Física Regular
- Mínimo 30 min, 3x por semana
- Caminhada, corrida, yoga, musculação
- Reduz cortisol em até 50%

#### 4. Sono de Qualidade
- 7-9 horas por noite
- Rotina de sono consistente
- Sem telas 1h antes de dormir

#### 5. Conexões Sociais
- Tempo com família e amigos
- Hobbies fora do trabalho
- Comunidade de apoio

#### 6. Propósito e Significado
- Conectar trabalho a propósito maior
- Celebrar pequenas vitórias
- Gratidão diária

#### 7. Ajuda Profissional
- Terapia preventiva
- Coaching executivo
- Suporte quando necessário

### Teste de Burnout (Faça Agora!)

Responda com pontuação de 0 (nunca) a 4 (sempre):

1. Sinto-me emocionalmente esgotado pelo trabalho
2. Sinto-me exausto ao final do dia de trabalho
3. Sinto-me cansado quando acordo e preciso enfrentar outro dia
4. Trabalhar o dia todo é realmente estressante para mim
5. Sinto que estou no limite das minhas forças

**Soma:**
- 0-4: Baixo risco
- 5-9: Risco moderado (atenção!)
- 10-15: Alto risco (precisa de ação imediata)
- 16-20: Burnout estabelecido (busque ajuda profissional)

## Exercícios Práticos

### Exercício 1: Protocolo Diário de Regulação
**Manhã (5 min):**
- 3 respirações profundas
- Definir intenção do dia
- Mindfulness de 3 min

**Meio-dia (3 min):**
- Pausa STOP
- Alongamento rápido
- Respiração 4-7-8

**Noite (10 min):**
- Journaling do dia
- 3 gratidões
- Revisão de emoções

### Exercício 2: Kit de Emergência Emocional

Crie seu kit pessoal com:
1. Técnica de respiração favorita
2. Frase motivacional
3. Pessoa de confiança para ligar
4. Atividade que te acalma (música, caminhada)
5. Lembretes de sucessos passados

### Exercício 3: Auditoria de Energia

Por 1 semana, anote:
- Horários de pico de energia
- O que drena sua energia
- O que recarrega sua energia

Use essas informações para reorganizar sua agenda.

## Conclusão do Módulo

Autorregulação não é luxo - é necessidade para líderes sustentáveis. Você não pode liderar outros se não consegue liderar a si mesmo.

**Desafio da Semana:**
1. Pratique respiração 4-7-8 três vezes ao dia
2. Faça o teste de burnout
3. Implemente o protocolo diário de regulação
4. Estabeleça 1 limite claro no trabalho

**Lembre-se:** "Você não pode servir água de um copo vazio. Cuide de si primeiro para poder cuidar dos outros."
        `
      }
    ],
    atividadesPraticas: [
      "Diário Emocional de 7 dias",
      "Role-play de conversas empáticas",
      "Prática de respiração consciente em situações reais",
      "Simulação de decisão sob pressão",
      "Plano pessoal de prevenção de burnout"
    ]
  },
  // Adicione os outros 7 cursos aqui com a mesma estrutura...
  // Por brevidade, vou adicionar apenas mais 1 curso completo
  {
    id: 2,
    slug: "gestao-riscos-psicossociais",
    titulo: "Gestão de Riscos Psicossociais no Trabalho",
    subtitulo: "Identificação, Avaliação e Controle de Riscos",
    descricao: "Aprenda a identificar, avaliar e controlar riscos psicossociais no ambiente de trabalho conforme NR01.",
    duracao: "5h",
    nivel: "Intermediário",
    categoria: "Saúde Ocupacional",
    icone: "🛡️",
    cor: "from-red-600 to-orange-600",
    corBadge: "bg-red-100 text-red-700 border-red-200",
    objetivo: "Capacitar líderes para identificar, avaliar e controlar riscos psicossociais no ambiente de trabalho.",
    resultadosEsperados: [
      "Identificação precoce de riscos psicossociais",
      "Implementação de medidas preventivas eficazes",
      "Conformidade com NR01 e legislação trabalhista",
      "Redução de afastamentos e doenças ocupacionais"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Introdução aos Riscos Psicossociais",
        duracao: "60 min",
        topicos: [
          "Definição e tipos de riscos psicossociais",
          "Impactos na saúde do trabalhador",
          "Base legal: NR01, NR07, NR17",
          "Estatísticas e dados nacionais",
          "Custos para organizações"
        ],
        materialDidatico: `
# Introdução aos Riscos Psicossociais

## O que são Riscos Psicossociais?

Riscos psicossociais são aspectos da organização do trabalho e do ambiente laboral que têm potencial de causar danos psicológicos, sociais ou físicos aos trabalhadores.

### Diferença entre Estresse Normal e Risco Psicossocial:

**Estresse Normal:**
- Pontual e temporário
- Relacionado a desafios específicos
- Resolve-se após a situação

**Risco Psicossocial:**
- Estrutural e sistêmico
- Relacionado à organização do trabalho
- Persiste e pode levar ao adoecimento

## Principais Riscos Psicossociais no Trabalho

### 1. Carga de Trabalho Excessiva
**Sinais:**
- Jornadas acima de 44h semanais
- Metas inalcançáveis
- Impossibilidade de pausas
- Trabalho levado para casa frequentemente

**Consequências:**
- Fadiga crônica
- Burnout
- Erros e acidentes
- Conflitos familiares

**Dados:** 62% dos trabalhadores brasileiros relatam sobrecarga (ISMA-BR)

### 2. Falta de Autonomia e Controle
**Sinais:**
- Microgerenciamento constante
- Impossibilidade de tomar decisões
- Procedimentos rígidos sem flexibilidade
- Falta de participação em decisões

**Consequências:**
- Desmotivação
- Sensação de impotência
- Redução de criatividade
- Alto turnover

### 3. Assédio Moral e Sexual
**Assédio Moral:**
- Humilhações repetidas
- Isolamento proposital
- Críticas destrutivas públicas
- Sabotagem de trabalho

**Assédio Sexual:**
- Comentários inapropriados
- Cantadas indesejadas
- Toques não consensuais
- Chantagem sexual

**Dados:** 52% dos trabalhadores já sofreram assédio moral (TST)

### 4. Insegurança no Emprego
**Sinais:**
- Ameaças constantes de demissão
- Contratos temporários sucessivos
- Demissões frequentes
- Comunicação inconsistente sobre futuro

**Consequências:**
- Ansiedade crônica
- Redução de comprometimento
- Problemas de saúde mental
- Clima organizacional ruim

### 5. Conflitos Interpessoais
**Causas:**
- Comunicação deficiente
- Papéis mal definidos
- Competição excessiva
- Favorit

ismo

**Consequências:**
- Ambiente tóxico
- Redução de colaboração
- Aumento de absenteísmo
- Sabotagem entre colegas

## Base Legal Brasileira

### NR01 - Gerenciamento de Riscos Ocupacionais

**Principais pontos:**
- Obrigatoriedade do PGR (Programa de Gerenciamento de Riscos)
- Inclusão de riscos psicossociais no inventário
- Avaliação periódica obrigatória
- Implementação de medidas preventivas

**Penalidades:** Multas de R$ 1.000 a R$ 300.000 dependendo da gravidade

### NR07 - PCMSO (Programa de Controle Médico)

**Exigências:**
- Avaliação de saúde mental
- Identificação de nexo causal
- Exames periódicos incluindo aspectos psicossociais

### NR17 - Ergonomia

**Foco:**
- Organização do trabalho
- Ritmo e pausas adequadas
- Sobrecarga mental
- Conforto psíquico

### Lei 14.457/2022 - Prevenção ao Assédio

**Obrigações:**
- Política clara de prevenção
- Canais de denúncia
- Capacitação de líderes
- Investigação rigorosa de casos

**Penalidade adicional:** Responsabilização civil e criminal

## Dados Alarmantes no Brasil

### Afastamentos por Transtornos Mentais:

**2023 (INSS):**
- 289.000 afastamentos por transtornos mentais
- Aumento de 38% em relação a 2022
- 3ª maior causa de afastamento

**Principais diagnósticos:**
1. Depressão (41%)
2. Ansiedade (29%)
3. Burnout (18%)
4. TEPT (12%)

### Custos Econômicos:

**Para a Organização:**
- Absenteísmo: R$ 180 bilhões/ano (Brasil)
- Presenteísmo: R$ 320 bilhões/ano
- Turnover: R$ 60 bilhões/ano
- Processos trabalhistas: R$ 8 bilhões/ano

**Para o Trabalhador:**
- Perda de renda
- Gastos com tratamento
- Impacto familiar
- Estigma social

## O Ciclo do Adoecimento Psicossocial

### Fase 1: Exposição ao Risco
- Trabalhador exposto a fatores de risco
- Sinais sutis ignorados
- "É assim que funciona aqui"

### Fase 2: Reação de Estresse
- Sintomas físicos (dor de cabeça, insônia)
- Irritabilidade
- Queda de produtividade

### Fase 3: Esgotamento
- Fadiga extrema
- Desmotivação profunda
- Pensamentos de desistir

### Fase 4: Adoecimento
- Diagnóstico de transtorno mental
- Afastamento necessário
- Tratamento prolongado

### Fase 5: Cronificação (se não tratado)
- Incapacidade permanente
- Múltiplos afastamentos
- Aposentadoria por invalidez

## Responsabilidade da Liderança

### O que a Lei Exige de Você:

1. **Identificar** riscos psicossociais na sua área
2. **Reportar** situações de risco ao SESMT/RH
3. **Implementar** medidas preventivas
4. **Monitorar** saúde da equipe
5. **Não omitir** casos de assédio ou risco grave

### Responsabilidade Civil e Criminal:

**Civil:**
- Indenização por danos morais e materiais
- Valores entre R$ 50.000 a R$ 500.000 dependendo da gravidade

**Criminal:**
- Assédio sexual: 1-2 anos de prisão
- Omissão em casos graves: 3 meses a 1 ano

## Exercícios Práticos

### Exercício 1: Mapeamento de Riscos na Sua Área

Liste:
1. 3 principais fontes de estresse da sua equipe
2. Casos de sobrecarga que você conhece
3. Conflitos interpessoais existentes
4. Aspectos da organização do trabalho problemáticos

### Exercício 2: Auto-Avaliação

Você como líder:
- Contribui para riscos psicossociais?
- Tem conhecimento sobre saúde mental?
- Sabe como agir em casos de crise?
- Está em conformidade com a lei?

### Exercício 3: Plano de Ação Imediato

Defina:
1. 1 risco a ser eliminado esta semana
2. 1 conversa que precisa ter com a equipe
3. 1 treinamento necessário
4. 1 política a ser implementada

## Conclusão do Módulo

Riscos psicossociais não são "frescura" - são fatores reais de adoecimento que custam bilhões e destroem vidas. Como líder, você tem responsabilidade legal, ética e humana de preveni-los.

**Próximos passos:**
1. Faça o mapeamento de riscos da sua área
2. Estude a NR01 completa
3. Converse com SESMT/RH sobre riscos identificados
4. Comprometa-se com mudanças concretas

**Lembre-se:** "Prevenir sempre sai mais barato que remediar."
        `
      },
      // Adicione os outros 4 módulos deste curso...
    ],
    atividadesPraticas: [
      "Mapeamento de riscos psicossociais na própria área",
      "Análise de caso real de adoecimento",
      "Criação de plano de ação preventivo",
      "Simulação de investigação de assédio",
      "Workshop de comunicação de riscos"
    ]
  }
];

export const getCursoBySlug = (slug: string): Curso | undefined => {
  return cursos.find(curso => curso.slug === slug);
};

export const getAllCursos = (): Curso[] => {
  return cursos;
};
