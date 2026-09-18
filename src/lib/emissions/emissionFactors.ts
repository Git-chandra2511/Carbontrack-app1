import { ActivityType, Category } from '../types';

export const EMISSION_FACTORS: Record<ActivityType, number> = {
  'Car travel': 0.20,
  'Bus': 0.08,
  'Flight': 0.25,
  'Electricity': 0.80,
  'Veg meal': 0.50,
  'Non-veg meal': 2.00,
};

export const UNITS: Record<ActivityType, string> = {
  'Car travel': 'km',
  'Bus': 'km',
  'Flight': 'km',
  'Electricity': 'kWh',
  'Veg meal': 'meals',
  'Non-veg meal': 'meals',
};

export const CATEGORIES: Record<ActivityType, Category> = {
  'Car travel': 'Transport',
  'Bus': 'Transport',
  'Flight': 'Transport',
  'Electricity': 'Energy',
  'Veg meal': 'Food',
  'Non-veg meal': 'Food',
};


