import React, { useEffect, useState } from 'react';
import './HumaniQLogoAnimation.css';

interface HumaniQLogoAnimationProps {
  onComplete?: () => void;
}

const HumaniQLogoAnimation: React.FC<HumaniQLogoAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'humaniq' | 'smile-draw' | 'ai-appear' | 'glow' | 'complete'>('initial');

  useEffect(() => {
    console.log('🎬 [HumaniQ] Nova animação iniciada - 7 segundos');
    
    const timeline = [
      { stage: 'humaniq', delay: 500 },      // 0.5s - HumaniQ aparece
      { stage: 'smile-draw', delay: 1500 },  // 1.5s - Faixa sorriso desenha
      { stage: 'ai-appear', delay: 2000 },   // 2.0s - AI aparece
      { stage: 'glow', delay: 2500 },        // 2.5s - Brilho intensifica
      { stage: 'complete', delay: 500 }      // 0.5s - Finalização
    ];
    
    let currentIndex = 0;

    const nextStage = () => {
      if (currentIndex < timeline.length) {
        const { stage: nextStageName, delay } = timeline[currentIndex];
        setTimeout(() => {
          console.log('🎬 [HumaniQ] Stage:', nextStageName);
          setStage(nextStageName as any);
          
          currentIndex++;
          
          if (nextStageName === 'complete' && onComplete) {
            setTimeout(onComplete, 1000);
          } else {
            nextStage();
          }
        }, delay);
      }
    };

    nextStage();
  }, [onComplete]);

  return (
    <div className="humaniq-intro-animation">
      <div className="intro-container">
        {/* Fundo azul escuro tecnológico */}
        <div className="dark-blue-background" />
        
        {/* Partículas sutis de fundo */}
        <div className="tech-particles">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className={`tech-particle tech-particle-${i}`} />
          ))}
        </div>

        {/* Conteúdo principal */}
        <div className="content-wrapper">
          {/* Container para HumaniQ + AI lado a lado */}
          <div className="logo-container">
            {/* Palavra HumaniQ */}
            {stage !== 'initial' && (
              <div className="text-humaniq visible">
                HumaniQ
              </div>
            )}

            {/* AI (aparece depois, ao lado) */}
            {(stage === 'ai-appear' || stage === 'glow' || stage === 'complete') && (
              <div className={`text-ai ${stage === 'ai-appear' || stage === 'glow' || stage === 'complete' ? 'visible' : ''}`}>
                AI
              </div>
            )}
          </div>

          {/* Faixa curvada (sorriso) */}
          {(stage === 'smile-draw' || stage === 'ai-appear' || stage === 'glow' || stage === 'complete') && (
            <svg 
              className="smile-curve" 
              viewBox="0 0 600 120" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="smileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0099ff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.8" />
                </linearGradient>
                <filter id="smileGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Faixa curvada - sorriso */}
              <path
                className={`smile-path ${stage === 'glow' || stage === 'complete' ? 'glowing' : ''}`}
                d="M 50 40 Q 300 120, 550 40"
                stroke="url(#smileGradient)"
                strokeWidth={stage === 'glow' || stage === 'complete' ? '12' : '8'}
                strokeLinecap="round"
                fill="none"
                filter="url(#smileGlow)"
              />
            </svg>
          )}

          {/* Subtítulo */}
          {(stage === 'glow' || stage === 'complete') && (
            <div className={`subtitle ${stage === 'glow' || stage === 'complete' ? 'visible' : ''}`}>
              Inteligência Psicossocial
            </div>
          )}
        </div>

        {/* Brilho final de fundo */}
        {(stage === 'glow' || stage === 'complete') && (
          <div className="background-glow" />
        )}
      </div>
    </div>
  );
};

export default HumaniQLogoAnimation;
