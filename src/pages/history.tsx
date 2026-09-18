'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { HistoryList } from '@/components/history/HistoryList';
import { getActivities } from '@/lib/carbontrack/storage';
import { Activity } from '@/lib/types';

export default function HistoryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActivities(getActivities());
  }, []);

  const handleActivityDeleted = () => {
    setActivities(getActivities());
  };

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl"></div>;

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title="Activity History" 
        subtitle="Search, filter, and review all your logged activities." 
      />
      
      <HistoryList 
        activities={activities} 
        onActivityDeleted={handleActivityDeleted} 
      />
    </div>
  );
}


