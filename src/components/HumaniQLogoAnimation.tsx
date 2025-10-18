import React, { useEffect, useState } from 'react';
import './HumaniQLogoAnimation.css';

interface HumaniQLogoAnimationProps {
  onComplete?: () => void;
}

const HumaniQLogoAnimation: React.FC<HumaniQLogoAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'start' | 'star' | 'arc' | 'explosion' | 'logo' | 'text' | 'complete'>('start');
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    // Timeline ajustada para que o texto "HumaniQ AI" + "Inteligência Psicossocial" fiquem pelo menos 10 segundos na tela
    const timeline = [
      { stage: 'star', delay: 500 },       // 0.5s - Aparição da estrela (reduzido)
      { stage: 'arc', delay: 500 },        // 0.5s - Formação do arco (reduzido)
      { stage: 'explosion', delay: 500 },  // 0.5s - Explosão de partículas (reduzido)
      { stage: 'logo', delay: 500 },       // 0.5s - Aparição do logo (reduzido)
      { stage: 'text', delay: 10000 },     // 10.0s - Texto "HumaniQ AI" + subtítulo ficam 10 segundos na tela
      { stage: 'complete', delay: 500 }    // 0.5s - Finalização
    ];

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const nextStage = () => {
      if (currentIndex < timeline.length) {
        const { stage: nextStageName, delay } = timeline[currentIndex];
        timeoutId = setTimeout(() => {
          console.log('🎬 Animação - Mudando para stage:', nextStageName);
          setStage(nextStageName as any);
          
          // Quando o logo aparecer, aguardar 500ms e mostrar o subtítulo
          if (nextStageName === 'logo') {
            setTimeout(() => {
              setShowSubtitle(true);
            }, 500);
          }
          
          currentIndex++;
          if (nextStageName === 'complete' && onComplete) {
            setTimeout(onComplete, 1500);
          } else {
            nextStage();
          }
        }, delay);
      }
    };

    // Iniciar a animação após um pequeno delay
    console.log('🎬 Animação - Iniciando...');
    timeoutId = setTimeout(() => {
      nextStage();
    }, 300);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onComplete]);

  const isStageActive = (targetStage: string) => {
    const stageOrder = ['start', 'star', 'arc', 'explosion', 'logo', 'text', 'complete'];
    const currentIndex = stageOrder.indexOf(stage);
    const targetIndex = stageOrder.indexOf(targetStage);
    const isActive = currentIndex >= targetIndex;
    console.log(`🎬 Stage Check - Current: ${stage}, Target: ${targetStage}, Active: ${isActive}`);
    return isActive;
  };

  return (
    <div className="humaniq-logo-animation">
      <div className="animation-container">
        {/* Fundo com gradiente escuro */}
        <div className="background-gradient" />
        
        {/* Partículas de fundo */}
        <div className="particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className={`particle particle-${i}`} />
          ))}
        </div>

        {/* Estrela inicial */}
        {isStageActive('star') && (
          <div className={`star ${stage !== 'star' ? 'animate' : ''}`}>
            <div className="star-inner" />
          </div>
        )}

        {/* Arco de luz removido conforme solicitado */}

        {/* Explosão de luz */}
        {isStageActive('explosion') && (
          <div className={`explosion ${isStageActive('logo') ? 'animate' : ''}`}>
            <div className="explosion-ring" />
            <div className="explosion-particles">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i} 
                  className={`explosion-particle explosion-particle-${i}`}
                  style={{ '--rotation': `${i * 30}deg` } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        )}

        {/* Logo HumaniQ AI */}
        {isStageActive('logo') && (
          <div className={`humaniq-logo ${isStageActive('text') ? 'animate' : ''}`}>
            <div className="logo-text">
              <span className="logo-humani">HumaniQ</span>
              <span className="logo-space"> </span>
              <span className="logo-ai">AI</span>
            </div>
          </div>
        )}

        {/* Texto "Inteligência Psicossocial" */}
        {showSubtitle && (
          <div className={`original-text ${showSubtitle ? 'animate' : ''}`}>
            {'Inteligência Psicossocial'.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        )}

        {/* Brilho final */}
        {stage === 'complete' && (
          <div className="final-glow animate" />
        )}
      </div>
    </div>
  );
};

export default HumaniQLogoAnimation;