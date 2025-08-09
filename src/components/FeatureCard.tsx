import * as React from 'react';

export interface IFeatureCardProps {
  color: string;
  icon: React.ReactNode;
  description: string;
}

export function FeatureCard({ color, icon, description }: IFeatureCardProps) {
  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className={`rounded bg-${color}-500/10 p-1 text-${color}-300`}>
        {icon}
      </div>
      <span>{description}</span>
    </div>
  );
}
