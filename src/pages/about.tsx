import { PageHeader } from '@/components/layout/PageHeader';
import { EMISSION_FACTORS } from '@/lib/emissions/emissionFactors';
import { Leaf, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto">
      <PageHeader 
        title="About CarbonTrack" 
        subtitle="Turning everyday choices into a visible carbon footprint." 
      />

      <div className="space-y-6">
        
        {/* Mission */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="w-12 h-12 bg-[#D1FAE5] text-[#10B981] rounded-xl flex items-center justify-center mb-4">
            <Leaf size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-3">Climate Tech for Personal Sustainability</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            CarbonTrack was built with a simple mission: to make carbon awareness accessible and actionable. We believe that seeing the impact of your daily choices is the first step toward building more sustainable habits.
          </p>
          <p className="text-[#6B7280] leading-relaxed">
            This dashboard helps you visualize your estimated CO<sub>2</sub> output, set weekly targets, and understand which areas of your life (Transport, Energy, Food) contribute the most to your footprint.
          </p>
        </div>

        {/* Emission Factors */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="w-12 h-12 bg-[#DBEAF6] text-[#3175A0] rounded-xl flex items-center justify-center mb-4">
            <Globe size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-3">How We Calculate</h2>
          <p className="text-[#6B7280] leading-relaxed mb-6">
            For simplicity and consistency in this challenge, CarbonTrack uses fixed emission factors. While real-world emissions vary based on specific circumstances, these averages provide a reliable baseline for personal tracking.
          </p>
          
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Activity Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Emission Factor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Car travel</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Car travel'].toFixed(2)} kg CO<sub>2</sub> / km</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Bus</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Bus'].toFixed(2)} kg CO<sub>2</sub> / km</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Flight</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Flight'].toFixed(2)} kg CO<sub>2</sub> / km</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Electricity</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Electricity'].toFixed(2)} kg CO<sub>2</sub> / kWh</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Veg meal</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Veg meal'].toFixed(2)} kg CO<sub>2</sub> / meal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">Non-veg meal</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{EMISSION_FACTORS['Non-veg meal'].toFixed(2)} kg CO<sub>2</sub> / meal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="shrink-0 w-10 h-10 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] mb-1">Privacy First (No Auth Required)</h3>
            <p className="text-sm text-[#6B7280]">
              All your activity data is stored locally on your device. We do not require you to create an account, and we do not transmit your data to any external servers.
            </p>
          </div>
        </div>
        
        <div className="text-center pt-8 text-sm text-[#9CA3AF]">
          CarbonTrack MVP &middot; v1.0.0
        </div>

      </div>
    </div>
  );
}


