import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'NPR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number, fromNPR?: boolean) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate: 1 USD = 132 NPR (approximate)
const NPR_TO_USD_RATE = 0.0076;
const USD_TO_NPR_RATE = 132;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('NPR');

  const convertPrice = (amount: number, fromNPR: boolean = true): number => {
    if (fromNPR) {
      // Convert NPR to USD
      return currency === 'USD' ? amount * NPR_TO_USD_RATE : amount;
    } else {
      // Convert USD to NPR
      return currency === 'NPR' ? amount * USD_TO_NPR_RATE : amount;
    }
  };

  const formatPrice = (amount: number): string => {
    const converted = convertPrice(amount, true);
    if (currency === 'USD') {
      return `$${converted.toFixed(2)}`;
    }
    return `₹${Math.round(converted).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};