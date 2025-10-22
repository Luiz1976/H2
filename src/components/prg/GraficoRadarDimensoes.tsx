import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface DadoDimensao {
  dimensao: string;
  valor: number;
  meta: number;
}

interface GraficoRadarDimensoesProps {
  dados: DadoDimensao[];
}

export default function GraficoRadarDimensoes({ dados }: GraficoRadarDimensoesProps) {
  console.log(`📊 [Radar Chart] Renderizando com ${dados.length} dimensões REAIS:`, dados.slice(0, 5).map(d => `${d.dimensao}: ${d.valor}%`));
  
  return (
    <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          Dimensões Psicossociais
        </CardTitle>
        <p className="text-white/60 text-sm">Avaliação das principais dimensões de risco psicossocial</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={dados}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis 
              dataKey="dimensao" 
              tick={{ fill: '#fff', fontSize: 11 }}
              stroke="rgba(255,255,255,0.3)"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#fff' }}
              stroke="rgba(255,255,255,0.3)"
            />
            <Radar 
              name="Valor Atual" 
              dataKey="valor" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6} 
            />
            <Radar 
              name="Meta" 
              dataKey="meta" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.3} 
            />
            <Legend 
              wrapperStyle={{ color: '#fff' }}
              iconType="circle"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Indicadores de Alerta */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {dados.filter(d => d.valor < d.meta).map(d => (
            <div key={d.dimensao} className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3">
              <p className="text-yellow-300 text-xs font-semibold">{d.dimensao}</p>
              <p className="text-white text-sm">{d.valor}% (Meta: {d.meta}%)</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
