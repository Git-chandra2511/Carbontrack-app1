'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getSettings, saveSettings, clearActivities, getActivities } from '@/lib/carbontrack/storage';
import { Settings } from '@/lib/types';
import { useToast } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { AlertTriangle, Download, Trash2, Save } from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState<Settings>({ weeklyTarget: 25, weekStartsOn: 'monday' });
  
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSettings(getSettings());
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.weeklyTarget > 0) {
      saveSettings(settings);
      showToast('Settings saved successfully', 'success');
    } else {
      showToast('Target must be greater than zero', 'error');
    }
  };

  const handleExportData = () => {
    const data = {
      settings: getSettings(),
      activities: getActivities()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbontrack_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully', 'success');
  };

  const handleClearData = () => {
    clearActivities();
    setIsClearModalOpen(false);
    showToast('All local data has been cleared', 'success');
  };

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl"></div>;

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your application preferences and data." 
      />

      <div className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#111827] mb-6">General Preferences</h2>
          
          <form onSubmit={handleSaveSettings}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Weekly Target (kg CO<sub>2</sub>)</label>
                <input 
                  type="number"
                  min="1"
                  step="0.5"
                  value={settings.weeklyTarget}
                  onChange={(e) => setSettings({ ...settings, weeklyTarget: parseFloat(e.target.value) || 0 })}
                  className="block w-full max-w-md rounded-xl border-[#D1D5DB] border bg-white px-4 py-3 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Week Starts On</label>
                <select
                  value={settings.weekStartsOn}
                  onChange={(e) => setSettings({ ...settings, weekStartsOn: e.target.value as 'monday' | 'sunday' })}
                  className="block w-full max-w-md rounded-xl border-[#D1D5DB] border bg-white px-4 py-3 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] appearance-none outline-none"
                >
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#111827] hover:bg-[#374151] text-white py-2.5 px-5 rounded-xl font-bold transition-colors"
            >
              <Save size={18} />
              Save Settings
            </button>
          </form>
        </div>

        {/* Data Management */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#111827] mb-2">Data Management</h2>
          <p className="text-sm text-[#6B7280] mb-6">All your data is stored locally in your browser. Nothing is sent to our servers.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] rounded-xl font-semibold hover:bg-[#F9FAFB] transition-colors"
            >
              <Download size={18} />
              Export Data
            </button>
            
            <button 
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl font-semibold hover:bg-[#FEE2E2] transition-colors"
            >
              <Trash2 size={18} />
              Clear Local Data
            </button>
          </div>
        </div>

      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal 
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Are you sure?"
        icon={<AlertTriangle size={24} />}
      >
        <p className="text-[#6B7280] mb-6">
          This will permanently remove all locally stored activities and reset your settings. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={() => setIsClearModalOpen(false)}
            className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-xl font-semibold hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleClearData}
            className="px-4 py-2 bg-[#EF4444] text-white rounded-xl font-semibold hover:bg-[#DC2626] transition-colors shadow-sm"
          >
            Clear Data
          </button>
        </div>
      </Modal>

    </div>
  );
}


