interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-[#FFFDF8] border border-[#DDDCD2] rounded-2xl p-5 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[#6D7771] text-sm font-medium">{title}</h3>
        <div className="text-[#2F6F59] bg-[#F3F0E8] p-2 rounded-lg group-hover:bg-[#D85C4A] group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-extrabold text-[#19352F]">{value}</div>
        <p className="text-xs text-[#8A918B] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}


