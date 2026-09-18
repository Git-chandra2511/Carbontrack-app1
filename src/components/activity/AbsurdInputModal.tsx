import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface AbsurdInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: string;
  quantity: number;
  unit: string;
  co2: number;
}

export function AbsurdInputModal({ isOpen, onClose, onConfirm, type, quantity, unit, co2 }: AbsurdInputModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Unusually large value"
      icon={<AlertTriangle size={24} />}
    >
      <div className="space-y-4">
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 text-[#92400E]">
          <p className="mb-2">
            <strong>{quantity.toLocaleString()} {unit}</strong> of {type.toLowerCase()} would produce approximately:
          </p>
          <p className="text-2xl font-extrabold text-[#B45309]">
            {co2.toLocaleString()} kg CO<sub>2</sub>
          </p>
        </div>
        
        <p className="text-[#6B7280]">
          This value seems unusually high for a typical single entry. Is this correct?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] rounded-xl font-semibold hover:bg-[#F9FAFB] transition-colors"
          >
            Edit Value
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-[#EF4444] text-white rounded-xl font-semibold hover:bg-[#DC2626] shadow-sm transition-colors"
          >
            Add Anyway
          </button>
        </div>
      </div>
    </Modal>
  );
}


