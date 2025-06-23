import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          
          // Wait for completion animation before calling onComplete
          setTimeout(() => {
            onComplete();
          }, 800);
          
          return 100;
        }
        
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center transition-all duration-800 ${isComplete ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Welcome text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight animate-fade-in">
          Bem-vindo ao <span className="font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Futuro</span>
        </h1>
        
        {/* Loading circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          
          {/* Progress circle with gradient */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="transparent"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 377} 377`}
              className="transition-all duration-200 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse mb-2"></div>
              <span className="text-sm font-light text-white/80">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md animate-pulse"></div>
        </div>
        
        {/* Completion animation */}
        {isComplete && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white rounded-full animate-ping opacity-20"></div>
              <div className="absolute w-32 h-32 border-2 border-white rounded-full animate-ping opacity-40 delay-300"></div>
              <div className="absolute w-16 h-16 bg-white rounded-full animate-pulse opacity-60"></div>
            </div>
            
            {/* Success message */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-40">
              <p className="text-white/90 text-lg font-light animate-fade-in">
                Carregamento concluído!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}