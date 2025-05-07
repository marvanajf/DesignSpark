import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="relative group bg-gradient-to-b from-black to-gray-900 rounded-lg p-6 border border-gray-800 hover:border-[#74d1ea]/50 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#74d1ea]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        
        <p className="text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}