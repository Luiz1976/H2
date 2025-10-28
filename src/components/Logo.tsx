import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`} data-testid="logo-humaniq">
      <img 
        src={logoImage} 
        alt="HumaniQ AI Logo" 
        className={`${sizeClasses[size]} object-contain`}
        data-testid="img-logo"
      />
      {showText && (
        <span 
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
          data-testid="text-logo-name"
        >
          HumaniQ AI
        </span>
      )}
    </div>
  );
}
