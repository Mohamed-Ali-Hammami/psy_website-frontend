import { createContext, useContext, useState } from 'react';

interface BoughtContextProps {
  isBought: boolean;
  setIsBought: (value: boolean) => void;
}

const BoughtContext = createContext<BoughtContextProps | undefined>(undefined);

export const useBoughtContext = () => {
  const context = useContext(BoughtContext);
  if (!context) {
    throw new Error("useBoughtContext must be used within a BoughtProvider");
  }
  return context;
};

export const BoughtProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBought, setIsBought] = useState(false);

  return (
    <BoughtContext.Provider value={{ isBought, setIsBought }}>
      {children}
    </BoughtContext.Provider>
  );
};
