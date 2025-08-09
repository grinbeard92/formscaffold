'use client';
import { EyeIcon, HammerIcon } from 'lucide-react';
import { CodeIcon } from '@radix-ui/react-icons';

export type TabType =
  | 'builder'
  | 'preview'
  | 'code'
  | 'zod-schema'
  | 'types'
  | 'server-actions'
  | 'postgres-init'
  | 'export';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onCodeGenerate: () => void;
}

export function TabNavigation({
  activeTab,
  setActiveTab,
  onCodeGenerate,
}: TabNavigationProps) {
  return (
    <div className='bg-secondary flex w-[100%] flex-col items-center justify-start gap-2 overflow-x-auto align-middle'>
      <button
        onClick={() => setActiveTab('builder')}
        className={`nav-btn ${
          activeTab === 'builder'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <HammerIcon className='mr-1 inline h-4 w-4' />
        <span className='nav-txt'>Builder</span>
      </button>
      <button
        onClick={() => setActiveTab('preview')}
        className={`nav-btn ${
          activeTab === 'preview'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <EyeIcon className='mr-1 inline h-4 w-4' />
        <span className='nav-txt'>Preview</span>
      </button>
      <button
        onClick={() => {
          onCodeGenerate();
          setActiveTab('code');
        }}
        className={`nav-btn ${
          activeTab === 'code'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <CodeIcon className='mr-1 inline h-4 w-4' />
        <span className='nav-txt'>Config Code</span>
      </button>
      <button
        onClick={() => setActiveTab('zod-schema')}
        className={`nav-btn ${
          activeTab === 'zod-schema'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        🔍 <span className='nav-txt'>Zod Schema</span>
      </button>
      <button
        onClick={() => setActiveTab('types')}
        className={`nav-btn ${
          activeTab === 'types'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        📝 <span className='nav-txt'>Typescript Types</span>
      </button>
      <button
        onClick={() => setActiveTab('server-actions')}
        className={`nav-btn ${
          activeTab === 'server-actions'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        ⚡ <span className='nav-txt'>Server Actions</span>
      </button>
      <button
        onClick={() => setActiveTab('postgres-init')}
        className={`nav-btn ${
          activeTab === 'postgres-init'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        🗄️ <span className='nav-txt'>PostgreSQL Init</span>
      </button>
      <button
        onClick={() => setActiveTab('export')}
        className={`nav-btn ${
          activeTab === 'export'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        📦 <span className='nav-txt'>Export Package</span>
      </button>
    </div>
  );
}
