import { Shield } from 'lucide-react';

interface PrivacyBadgeProps {
    label: string;
    size?: 'xs' | 'sm';
    className?: string;
}

export function PrivacyBadge({ label, size = 'sm', className = '' }: PrivacyBadgeProps) {
    const isXs = size === 'xs';
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-semibold border ${
                isXs
                    ? 'px-1.5 py-0.5 text-[9px] border-green-200 bg-green-50 text-green-700'
                    : 'px-2.5 py-1 text-[10px] border-green-300 bg-green-100 text-green-800'
            } ${className}`}
        >
            <Shield className={isXs ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
            {label}
        </span>
    );
}
