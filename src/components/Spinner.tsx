interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = '' }: SpinnerProps) {
  return (
    <div 
      className={`animate-spin rounded-full border-4 border-white/20 border-t-white/80 ${className}`}
    />
  );
} 