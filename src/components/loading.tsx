import { cn } from '../lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading = ({ size = 'md', className }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'relative rounded-full border-2 border-transparent',
          'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-transparent',
          'after:absolute after:inset-0 after:rounded-full after:border-2 after:border-transparent',
          'animate-spin',
          sizeClasses[size]
        )}
        style={{
          background: 'linear-gradient(to right, #2563eb, #059669)',
          backgroundClip: 'padding-box',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, #2563eb, #059669)',
            mask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
            WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
          }}
        />
      </div>
    </div>
  );
};

// Full screen loading component
export const FullScreenLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-gray-600 font-medium animate-pulse">Yuklanmoqda...</p>
      </div>
    </div>
  );
};

// Button loading component
export const ButtonLoading = () => {
  return (
    <div className="flex items-center space-x-2">
      <Loading size="sm" className="text-white" />
      <span>Yuklanmoqda...</span>
    </div>
  );
}; 