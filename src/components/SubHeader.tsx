import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import * as React from 'react';

export interface ISubHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SubHeader({ title, subtitle }: ISubHeaderProps) {
  return (
    <header className='border-1 border-[var(--border)] bg-[var(--primary-foreground)]'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground'
          >
            <ArrowLeftIcon className='h-5 w-5' />
          </Link>
          <div>
            <h1 className='text-foreground text-2xl font-bold'>{title}</h1>
            <p className='text-muted-foreground'>{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
