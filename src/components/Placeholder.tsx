import { FileText, User } from "lucide-react";

interface PlaceholderProps {
  type: 'reports' | 'profile';
}

export function Placeholder({ type }: PlaceholderProps) {
  const config = {
    reports: {
      icon: FileText,
      title: 'Reports & Analytics',
      description: 'Detailed income reports, tax summaries, and financial insights will be available here.',
      features: [
        'Monthly income breakdown',
        'Year-over-year comparisons',
        'Expense tracking',
        'Downloadable PDF reports',
      ],
    },
    profile: {
      icon: User,
      title: 'Your Profile',
      description: 'Manage your personal information, linked accounts, and preferences.',
      features: [
        'Personal details & KYC',
        'Linked income sources',
        'Bank account details',
        'Notification settings',
      ],
    },
  };

  const { icon: Icon, title, description, features } = config[type];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon size={40} className="text-[#3B82F6]" />
        </div>
        <h2 className="mb-4">{title}</h2>
        <p className="text-[#6B7280] mb-8">{description}</p>
        
        <div className="bg-white rounded-lg p-8 shadow-sm text-left">
          <h4 className="mb-4">Coming Soon:</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-[#6B7280]">
                <div className="w-2 h-2 bg-[#1E7F5C] rounded-full flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
