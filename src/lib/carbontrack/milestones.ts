import { Activity, Settings } from '../types';
import { getAchievements, saveAchievements } from './storage';
import { isInCurrentWeek } from './dateUtils';

export interface Milestone {
  id: string;
  title: string;
  description: string;
}

export const MILESTONES: Milestone[] = [
  { id: 'first-step', title: 'First Step', description: 'Log your first activity' },
  { id: 'ten-activities', title: '10 Activities', description: "You've tracked 10 activities" },
  { id: 'target-keeper', title: 'Target Keeper', description: 'Stay under your weekly target' },
  { id: 'consistent-tracker', title: 'Consistent Tracker', description: 'Log activities for 7 days' },
];

export const updateAchievements = (activities: Activity[], settings: Settings): string[] => {
  const unlocked = new Set(getAchievements());
  const weeklyActivities = activities.filter((activity) => isInCurrentWeek(activity.date));
  const weeklyTotal = weeklyActivities.reduce((total, activity) => total + activity.co2, 0);
  const distinctDays = new Set(activities.map((activity) => activity.date));

  if (activities.length >= 1) unlocked.add('first-step');
  if (activities.length >= 10) unlocked.add('ten-activities');
  if (weeklyActivities.length > 0 && weeklyTotal <= settings.weeklyTarget) unlocked.add('target-keeper');
  if (distinctDays.size >= 7) unlocked.add('consistent-tracker');

  const nextAchievements = Array.from(unlocked);
  saveAchievements(nextAchievements);
  return nextAchievements;
};