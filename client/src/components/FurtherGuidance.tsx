import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface FurtherGuidanceProps {
  value: string;
  onChange: (value: string) => void;
}

const FurtherGuidance: React.FC<FurtherGuidanceProps> = ({ value, onChange }) => {
  return (
    <div className="mt-6 bg-[#0e1b33]/50 border-2 border-[#74d1ea]/50 rounded-xl p-5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
      <div className="flex items-center mb-3">
        <div className="bg-[#182030] rounded-lg p-2 mr-3">
          <Sparkles className="h-4 w-4 text-[#74d1ea]" />
        </div>
        <h4 className="text-white font-medium">Further Guidance (Optional)</h4>
      </div>
      <Textarea
        id="furtherGuidanceInput"
        className="min-h-[100px] bg-black/40 border-[#74d1ea]/30 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20"
        placeholder="Add your gold standard copy or specific instructions to guide the AI in analyzing your content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="mt-2 text-xs text-[#74d1ea]/80">
        Provide example content or specific instructions to help the AI better understand your brand's voice
      </p>
    </div>
  );
};

export default FurtherGuidance;