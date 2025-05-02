import { ReactNode } from "react";

interface FeatureBannerProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function FeatureBanner({ title, description, icon }: FeatureBannerProps) {
  return (
    <div className="bg-[#0e1015] border border-[#1a1e29] p-6 rounded-xl">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#181c25]">
          {icon}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}