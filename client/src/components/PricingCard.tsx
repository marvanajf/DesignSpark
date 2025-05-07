import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  periodLabel: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
  isDisabled?: boolean;
  footnote?: string;
}

export function PricingCard({
  title,
  description,
  price,
  periodLabel,
  features,
  buttonText,
  buttonHref,
  isPopular = false,
  isDisabled = false,
  footnote
}: PricingCardProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
      isPopular 
        ? 'border-2 border-[#74d1ea] shadow-[0_0_30px_rgba(116,209,234,0.2)]' 
        : 'border border-gray-800'
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 left-0 bg-[#74d1ea] text-black py-1.5 text-xs font-medium text-center">
          Most Popular
        </div>
      )}
      
      <div className={`bg-gradient-to-b from-[#0e131f] to-[#080b14] p-8 ${isPopular ? 'pt-12' : ''}`}>
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">{price}</span>
            <span className="ml-2 text-gray-400">{periodLabel}</span>
          </div>
        </div>
        
        <Link href={buttonHref}>
          <Button 
            className={`w-full ${
              isPopular 
                ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black' 
                : 'border border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10 bg-transparent'
            }`}
            disabled={isDisabled}
          >
            {buttonText}
          </Button>
        </Link>
      </div>
      
      <div className="p-8 bg-black/50 border-t border-gray-800">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-[#74d1ea]/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-3 w-3 text-[#74d1ea]" />
              </div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {footnote && (
          <p className="text-gray-500 text-xs mt-6 italic">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}