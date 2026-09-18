import { PageHeader } from '@/components/layout/PageHeader';
import { ActivityForm } from '@/components/activity/ActivityForm';

export default function LogActivityPage() {
  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title="Log an Activity" 
        subtitle="Record an everyday activity and see its estimated carbon impact." 
      />
      
      <div className="mt-8">
        <ActivityForm />
      </div>
    </div>
  );
}


