import { ActivityType } from '../types';
import { EMISSION_FACTORS } from '../emissions/emissionFactors';

export const calculateCO2 = (type: ActivityType, quantity: number): number => {
  const factor = EMISSION_FACTORS[type];
  if (factor === undefined) return 0;
  
  const raw = quantity * factor;
  return Math.round(raw * 100) / 100;
};


