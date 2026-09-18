export type ActivityType = 'Car travel' | 'Bus' | 'Flight' | 'Electricity' | 'Veg meal' | 'Non-veg meal';

export type Category = 'Transport' | 'Energy' | 'Food';

export interface Activity {
  id: string;
  type: ActivityType;
  quantity: number;
  unit: string;
  category: Category;
  emissionFactor: number;
  co2: number; // in kg
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Settings {
  weeklyTarget: number;
  weekStartsOn: 'monday' | 'sunday';
}


