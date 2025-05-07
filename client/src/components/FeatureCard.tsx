import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-gradient-to-b from-[#111827]/60 to-[#0a0c10]/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(116,209,234,0.1)] hover:border-gray-700/70">
      <div className="mb-4 bg-[#0e131f] border border-[#74d1ea]/20 inline-flex items-center justify-center w-12 h-12 rounded-lg shadow-[0_0_15px_rgba(116,209,234,0.15)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}