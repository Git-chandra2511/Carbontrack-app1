'use client';

import { useState } from 'react';
import { Activity, ActivityType } from '@/lib/types';
import { Leaf, Plane, Zap, Car, Bus, Utensils, CircleHelp, Trash2, SearchX } from 'lucide-react';
import { deleteActivity } from '@/lib/carbontrack/storage';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

interface HistoryListProps {
  activities: Activity[];
  onActivityDeleted: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Car travel': return <Car size={16} />;
    case 'Bus': return <Bus size={16} />;
    case 'Flight': return <Plane size={16} />;
    case 'Electricity': return <Zap size={16} />;
    case 'Veg meal': return <Leaf size={16} />;
    case 'Non-veg meal': return <Utensils size={16} />;
    default: return <CircleHelp size={16} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Transport': return 'bg-[#DBEAF6] text-[#3175A0]';
    case 'Energy': return 'bg-[#DFF2E6] text-[#10B981]';
    case 'Food': return 'bg-[#F8EAD5] text-[#A16628]';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export function HistoryList({ activities, onActivityDeleted }: HistoryListProps) {
  const { showToast } = useToast();
  const [filterType, setFilterType] = useState<ActivityType | 'All Types'>('All Types');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredActivities = activities.filter(a => {
    let matches = true;
    if (filterType !== 'All Types' && a.type !== filterType) matches = false;
    if (dateFrom && a.date < dateFrom) matches = false;
    if (dateTo && a.date > dateTo) matches = false;
    return matches;
  });

  const clearFilters = () => {
    setFilterType('All Types');
    setDateFrom('');
    setDateTo('');
  };

  const confirmDelete = (id: string) => {
    deleteActivity(id);
    onActivityDeleted();
    showToast('Activity deleted', 'success');
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Type</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-3 py-2 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] text-sm appearance-none outline-none"
            >
              <option>All Types</option>
              <option>Car travel</option>
              <option>Bus</option>
              <option>Flight</option>
              <option>Electricity</option>
              <option>Veg meal</option>
              <option>Non-veg meal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">From Date</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-3 py-2 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">To Date</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-3 py-2 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] text-sm outline-none"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-xl text-sm font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F9FAFB] text-[#9CA3AF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SearchX size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-1">No activities found</h3>
          <p className="text-[#6B7280] text-sm">Try adjusting your filters or log a new activity.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Activity</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">CO<sub>2</sub> Emission</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="divide-y divide-[#E5E7EB]">
            {filteredActivities.map(activity => (
              <div key={activity.id} className="p-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-[#F9FAFB] transition-colors group">
                
                {/* Mobile View */}
                <div className="md:hidden flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColor(activity.category)}`}>
                      {getIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-bold text-[#111827] text-sm">{activity.type}</p>
                      <p className="text-xs text-[#6B7280]">
                        {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#111827]">{activity.co2.toFixed(2)} kg</p>
                    <p className="text-xs text-[#6B7280]">{activity.quantity} {activity.unit}</p>
                  </div>
                </div>

                <div className="md:hidden flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
                  <span className="text-xs font-semibold text-[#6B7280] bg-white px-2 py-1 rounded border border-[#E5E7EB]">
                    {activity.category}
                  </span>
                  <button 
                    onClick={() => setDeleteConfirmId(activity.id)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] bg-white hover:bg-[#FEF2F2] rounded-md transition-colors border border-transparent hover:border-[#FECACA]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block col-span-2 text-sm text-[#4B5563]">
                  {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="hidden md:flex col-span-3 items-center gap-2">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${getCategoryColor(activity.category)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <span className="font-semibold text-[#111827] text-sm">{activity.type}</span>
                </div>
                <div className="hidden md:block col-span-2 text-sm text-[#4B5563]">
                  {activity.category}
                </div>
                <div className="hidden md:block col-span-2 text-right text-sm font-medium text-[#4B5563]">
                  {activity.quantity} <span className="text-[#9CA3AF] font-normal">{activity.unit}</span>
                </div>
                <div className="hidden md:block col-span-2 text-right">
                  <span className="font-bold text-[#111827]">{activity.co2.toFixed(2)}</span> <span className="text-[#6B7280] text-sm">kg</span>
                </div>
                <div className="hidden md:flex col-span-1 justify-center">
                  <button 
                    onClick={() => setDeleteConfirmId(activity.id)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] rounded-md transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Delete activity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirmId !== null} 
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Activity?"
        icon={<Trash2 size={24} />}
      >
        <p className="text-[#6B7280] mb-6">
          Are you sure you want to delete this activity? This action cannot be undone and will update your dashboard calculations.
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={() => setDeleteConfirmId(null)}
            className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-xl font-semibold hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => deleteConfirmId && confirmDelete(deleteConfirmId)}
            className="px-4 py-2 bg-[#EF4444] text-white rounded-xl font-semibold hover:bg-[#DC2626] transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}


