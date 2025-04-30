import { createContext, ReactNode, useContext, useState } from "react";
import PricingModal from "@/components/PricingModal";

interface PricingModalContextType {
  openPricingModal: (limitType: "personas" | "toneAnalyses" | "contentGeneration") => void;
  closePricingModal: () => void;
  isPricingModalOpen: boolean;
  currentLimitType: "personas" | "toneAnalyses" | "contentGeneration";
}

const PricingModalContext = createContext<PricingModalContextType>({
  openPricingModal: () => {},
  closePricingModal: () => {},
  isPricingModalOpen: false,
  currentLimitType: "personas",
});

export function PricingModalProvider({ children }: { children: ReactNode }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [currentLimitType, setCurrentLimitType] = useState<"personas" | "toneAnalyses" | "contentGeneration">("personas");

  const openPricingModal = (limitType: "personas" | "toneAnalyses" | "contentGeneration") => {
    setCurrentLimitType(limitType);
    setIsPricingModalOpen(true);
  };

  const closePricingModal = () => {
    setIsPricingModalOpen(false);
  };

  return (
    <PricingModalContext.Provider
      value={{
        openPricingModal,
        closePricingModal,
        isPricingModalOpen,
        currentLimitType,
      }}
    >
      {children}
      {isPricingModalOpen && (
        <PricingModal 
          isOpen={isPricingModalOpen} 
          onClose={closePricingModal} 
          plan={{
            name: "Professional",
            personas: 25,
            toneAnalyses: 30,
            contentGeneration: 200,
            price: 24.99,
            currency: "GBP",
            displayPrice: "£24.99/month",
            stripePrice: "price_professional"
          }}
          planId="professional"
        />
      )}
    </PricingModalContext.Provider>
  );
}

// Exporting as a named constant to avoid React Fast Refresh issues
export const usePricingModal = () => {
  return useContext(PricingModalContext);
};