import { Activity, Settings } from '../types';

const ACTIVITIES_KEY = 'carbontrack_activities';
const SETTINGS_KEY = 'carbontrack_settings';
const ACHIEVEMENTS_KEY = 'carbontrack_achievements';

const DEFAULT_SETTINGS: Settings = {
  weeklyTarget: 25,
  weekStartsOn: 'monday',
};

// Activity Storage
export const getActivities = (): Activity[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load activities', e);
    return [];
  }
};

export const saveActivity = (activity: Activity): void => {
  const activities = getActivities();
  activities.unshift(activity); // Add to beginning
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activity', e);
  }
};

export const deleteActivity = (id: string): void => {
  const activities = getActivities().filter(a => a.id !== id);
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to delete activity', e);
  }
};

export const clearActivities = (): void => {
  try {
    localStorage.removeItem(ACTIVITIES_KEY);
  } catch (e) {
    console.error('Failed to clear activities', e);
  }
};

// Settings Storage
export const getSettings = (): Settings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getAchievements = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load achievements', e);
    return [];
  }
};

export const saveAchievements = (achievements: string[]): void => {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements', e);
  }
};


