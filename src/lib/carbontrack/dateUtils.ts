import { startOfWeek, endOfWeek, isWithinInterval, differenceInDays, format, parseISO } from 'date-fns';

export const getStartOfWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  return startOfWeek(date, { weekStartsOn });
};

export const getEndOfWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  return endOfWeek(date, { weekStartsOn });
};

export const isInCurrentWeek = (dateString: string, weekStartsOn: 0 | 1 = 1): boolean => {
  const date = parseISO(dateString);
  const start = getStartOfWeek(new Date(), weekStartsOn);
  const end = getEndOfWeek(new Date(), weekStartsOn);
  
  return isWithinInterval(date, { start, end });
};

export const getDaysElapsed = (weekStartsOn: 0 | 1 = 1): number => {
  const today = new Date();
  const start = getStartOfWeek(today, weekStartsOn);
  return differenceInDays(today, start) + 1; // +1 to include today
};

export const getDaysRemaining = (weekStartsOn: 0 | 1 = 1): number => {
  return 7 - getDaysElapsed(weekStartsOn);
};

export const formatWeekLabel = (weekStartsOn: 0 | 1 = 1): string => {
  const start = getStartOfWeek(new Date(), weekStartsOn);
  const end = getEndOfWeek(new Date(), weekStartsOn);
  
  return `${format(start, 'MMM d')} â€“ ${format(end, 'MMM d')}`;
};

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};


