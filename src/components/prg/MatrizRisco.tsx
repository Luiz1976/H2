import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiscoItem {
  nome: string;
  probabilidade: 'A' | 'B' | 'C' | 'D' | 'E';
  severidade: 1 | 2 | 3 | 4 | 5;
  categoria: string;
}

interface MatrizRiscoProps {
  riscos: RiscoItem[];
}

export default function MatrizRisco({ riscos }: MatrizRiscoProps) {
  const probabilidades = [
    { letra: 'E', label: 'MUITO PROVÁVEL', desc: 'Controle inexistente' },
    { letra: 'D', label: 'PROVÁVEL', desc: 'Controle deficiente' },
    { letra: 'C', label: 'POSSÍVEL', desc: 'Controle com pequenas deficiências' },
    { letra: 'B', label: 'POUCO PROVÁVEL', desc: 'Controle com conformidade legal' },
    { letra: 'A', label: 'RARA', desc: 'Controle excelente' }
  ];

  const severidades = [
    { num: 1, label: '1 LEVE', desc: 'Incômodo, insatisfação ou desconforto' },
    { num: 2, label: '2 MENOR', desc: 'Dano leve/dor/mal-estar/estresse sem necessidade' },
    { num: 3, label: '3 MODERADA', desc: 'Adoecimento com incapacidade temporária' },
    { num: 4, label: '4 MAIOR', desc: 'Incapacidade temporária prolongada, dores crônicas' },
    { num: 5, label: '5 EXTREMA', desc: 'Incapacidade permanente parcial (sequelas)' }
  ];

  // Função para determinar a cor da célula baseada no nível de risco
  const getCorRisco = (prob: string, sev: number): string => {
    const probIndex = 'ABCDE'.indexOf(prob);
    const score = probIndex + sev;

    if (score <= 2) return 'bg-green-500/80 hover:bg-green-600/80 border-green-400'; // TRIVIAL
    if (score <= 4) return 'bg-lime-500/80 hover:bg-lime-600/80 border-lime-400'; // TOLERÁVEL
    if (score <= 6) return 'bg-yellow-500/80 hover:bg-yellow-600/80 border-yellow-400'; // MODERADO
    if (score <= 8) return 'bg-orange-500/80 hover:bg-orange-600/80 border-orange-400'; // SUBSTANCIAL
    return 'bg-red-500/80 hover:bg-red-600/80 border-red-400'; // INTOLERÁVEL
  };

  const getNivelRisco = (prob: string, sev: number): string => {
    const probIndex = 'ABCDE'.indexOf(prob);
    const score = probIndex + sev;

    if (score <= 2) return 'TRIVIAL';
    if (score <= 4) return 'TOLERÁVEL';
    if (score <= 6) return 'MODERADO';
    if (score <= 8) return 'SUBSTANCIAL';
    return 'INTOLERÁVEL';
  };

  // Contar riscos por célula
  const contarRiscos = (prob: string, sev: number) => {
    return riscos.filter(r => r.probabilidade === prob && r.severidade === sev).length;
  };

  return (
    <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          Matriz de Risco Qualitativa
        </CardTitle>
        <p className="text-white/60 text-sm">Avaliação de riscos psicossociais - Severidade vs Probabilidade</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-white/20 bg-cyan-900/50 p-3 text-white text-sm font-bold" colSpan={2}>
                  MATRIZ DE RISCO QUALITATIVA
                </th>
                <th className="border border-white/20 bg-blue-900/70 p-3 text-white text-xs font-bold text-center" colSpan={5}>
                  SEVERIDADE
                </th>
              </tr>
              <tr>
                <th className="border border-white/20 bg-cyan-800/50 p-2 text-white text-xs w-32"></th>
                <th className="border border-white/20 bg-cyan-800/50 p-2 text-white text-xs w-32"></th>
                {severidades.map(sev => (
                  <th key={sev.num} className="border border-white/20 bg-blue-800/50 p-2 text-white text-xs text-center min-w-[120px]">
                    <div className="font-bold mb-1">{sev.label}</div>
                    <div className="font-normal text-[10px] leading-tight">{sev.desc}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {probabilidades.map(prob => (
                <tr key={prob.letra}>
                  <td className="border border-white/20 bg-cyan-800/30 p-2 text-white text-xs font-bold text-center w-12">
                    {prob.letra}
                  </td>
                  <td className="border border-white/20 bg-cyan-800/30 p-2 text-white text-xs">
                    <div className="font-bold mb-1">{prob.label}</div>
                    <div className="font-normal text-[10px] opacity-80">{prob.desc}</div>
                  </td>
                  {severidades.map(sev => {
                    const count = contarRiscos(prob.letra, sev.num);
                    const nivel = getNivelRisco(prob.letra, sev.num);
                    return (
                      <td 
                        key={`${prob.letra}-${sev.num}`}
                        className={`border-2 p-3 text-center transition-all cursor-pointer ${getCorRisco(prob.letra, sev.num)}`}
                        data-testid={`matriz-celula-${prob.letra}-${sev.num}`}
                      >
                        <div className="font-bold text-white text-sm mb-1">{nivel}</div>
                        {count > 0 && (
                          <Badge className="bg-white/20 text-white border-white/40 text-xs">
                            {count} {count === 1 ? 'risco' : 'riscos'}
                          </Badge>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-400"></div>
            <span className="text-white text-xs">Trivial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-lime-500 rounded border-2 border-lime-400"></div>
            <span className="text-white text-xs">Tolerável</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded border-2 border-yellow-400"></div>
            <span className="text-white text-xs">Moderado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded border-2 border-orange-400"></div>
            <span className="text-white text-xs">Substancial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-400"></div>
            <span className="text-white text-xs">Intolerável</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
