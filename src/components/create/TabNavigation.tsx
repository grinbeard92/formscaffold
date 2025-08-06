'use client';

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
    <div className='mb-6 flex gap-2 overflow-x-auto'>
      <button
        onClick={() => setActiveTab('builder')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'builder'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        Builder
      </button>
      <button
        onClick={() => setActiveTab('preview')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'preview'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        Preview
      </button>
      <button
        onClick={() => {
          onCodeGenerate();
          setActiveTab('code');
        }}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'code'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <CodeIcon className='mr-1 inline h-4 w-4' />
        Config Code
      </button>
      <button
        onClick={() => setActiveTab('zod-schema')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'zod-schema'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        🔍 Zod Schema
      </button>
      <button
        onClick={() => setActiveTab('types')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'types'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        📝 TypeScript Types
      </button>
      <button
        onClick={() => setActiveTab('server-actions')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'server-actions'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        ⚡ Server Actions
      </button>
      <button
        onClick={() => setActiveTab('postgres-init')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'postgres-init'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        🗄️ PostgreSQL Init
      </button>
      <button
        onClick={() => setActiveTab('export')}
        className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
          activeTab === 'export'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        📦 Export Package
      </button>
    </div>
  );
}
