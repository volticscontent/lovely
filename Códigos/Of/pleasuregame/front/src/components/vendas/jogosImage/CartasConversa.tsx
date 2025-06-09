import { CardInteraction } from './CardInteraction';

type Theme = 'objetivos' | 'respeito' | 'comunicacao' | 'intimidade' | 'diversao' | 'crescimento';

interface Question {
  theme: Theme;
  text: string;
}

const questions: Question[] = [
  // Objetivos
  { theme: 'objetivos', text: 'Qual é o seu maior sonho para nosso relacionamento?' },
  { theme: 'objetivos', text: 'Como você imagina nossa vida juntos daqui a 5 anos?' },
  { theme: 'objetivos', text: 'O que você mais valoriza em nossa parceria?' },
  
  // Respeito
  { theme: 'respeito', text: 'Como podemos melhorar nossa forma de resolver conflitos?' },
  { theme: 'respeito', text: 'O que faz você se sentir verdadeiramente respeitado(a)?' },
  { theme: 'respeito', text: 'Como podemos apoiar melhor os sonhos um do outro?' },
  
  // Comunicação
  { theme: 'comunicacao', text: 'Qual é a melhor maneira de te dar feedback?' },
  { theme: 'comunicacao', text: 'Como você prefere receber carinho e afeto?' },
  { theme: 'comunicacao', text: 'O que te faz se sentir mais ouvido(a) e compreendido(a)?' },
  
  // Intimidade
  { theme: 'intimidade', text: 'O que te faz se sentir mais conectado(a) comigo?' },
  { theme: 'intimidade', text: 'Qual momento juntos te traz as melhores memórias?' },
  { theme: 'intimidade', text: 'Como podemos fortalecer nossa conexão emocional?' },
  
  // Diversão
  { theme: 'diversao', text: 'Qual atividade nova você gostaria de experimentar comigo?' },
  { theme: 'diversao', text: 'Qual é sua ideia de um encontro perfeito?' },
  { theme: 'diversao', text: 'O que te faz rir mais quando estamos juntos?' },
  
  // Crescimento
  { theme: 'crescimento', text: 'Como podemos crescer juntos como casal?' },
  { theme: 'crescimento', text: 'Que habilidade você admira em mim e gostaria de desenvolver?' },
  { theme: 'crescimento', text: 'Qual área da nossa relação você sente que mais evoluiu?' }
];

const themeColors: Record<Theme, { gradient: string, pattern: string }> = {
  objetivos: { 
    gradient: 'from-blue-500 to-blue-600',
    pattern: '#60A5FA'
  },
  respeito: { 
    gradient: 'from-purple-500 to-purple-600',
    pattern: '#A855F7'
  },
  comunicacao: { 
    gradient: 'from-green-500 to-green-600',
    pattern: '#22C55E'
  },
  intimidade: { 
    gradient: 'from-pink-500 to-pink-600',
    pattern: '#EC4899'
  },
  diversao: { 
    gradient: 'from-yellow-500 to-yellow-600',
    pattern: '#EAB308'
  },
  crescimento: { 
    gradient: 'from-orange-500 to-orange-600',
    pattern: '#F97316'
  }
};

const themeEmojis: Record<Theme, string> = {
  objetivos: '🎯',
  respeito: '🤝',
  comunicacao: '💭',
  intimidade: '❤️',
  diversao: '🎮',
  crescimento: '🌱'
};

const themeNames: Record<Theme, string> = {
  objetivos: 'Objetivos',
  respeito: 'Respeito',
  comunicacao: 'Comunicação',
  intimidade: 'Intimidade',
  diversao: 'Diversão',
  crescimento: 'Crescimento'
};

// SVG Pattern Component - Now a Server Component
function CardPattern({ color = '#fff' }: { color?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="cardPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0L40 20L20 40L0 20L20 0Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx="20"
            cy="20"
            r="4"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d="M10 20L20 10L30 20L20 30L10 20Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cardPattern)" />
    </svg>
  );
}

export interface CardData {
  questions: Question[];
  themeColors: typeof themeColors;
  themeEmojis: typeof themeEmojis;
  themeNames: typeof themeNames;
  CardPattern: typeof CardPattern;
}

// Main Server Component
export default function CartasConversa({ onCardFlip, isMobile }: { onCardFlip: () => void; isMobile?: boolean }) {
  // Prepare data to pass to client component
  const cardData: CardData = {
    questions,
    themeColors,
    themeEmojis,
    themeNames,
    CardPattern,
  };

  return <CardInteraction cardData={cardData} onCardFlip={onCardFlip} isMobile={isMobile} />;
} 