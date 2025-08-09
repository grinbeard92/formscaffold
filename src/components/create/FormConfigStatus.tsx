'use client';

import React from 'react';
import { useFormConfig, useFormHistory, useFormSync } from '@/lib/store';
import { Card } from '@/components/ui/card';

export function FormConfigStatus() {
  const { isDirty, lastSaved } = useFormConfig();
  const { undo, redo, canUndo, canRedo } = useFormHistory();
  const { isOnline, isPaidUser, isAutoSaving, syncError, syncToDatabase } =
    useFormSync();

  const handleManualSync = async () => {
    if (!isPaidUser) {
      alert(
        'Database sync is only available for paid users. Consider upgrading your plan!',
      );
      return;
    }

    try {
      await syncToDatabase();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never saved';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Just saved';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card.Root className='w-full'>
      <Card.Content className='p-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* Save Status */}
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <span
                className={`text-sm ${isAutoSaving ? 'text-primary' : isDirty ? 'text-destructive' : 'text-success'}`}
              >
                {isAutoSaving
                  ? '💾 Saving...'
                  : isDirty
                    ? '⚠️ Unsaved changes'
                    : '✅ All changes saved'}
              </span>
            </div>

            <div className='text-xs text-gray-500'>
              🕒 {formatLastSaved(lastSaved)}
            </div>
          </div>

          {/* History Controls */}
          <div className='flex items-center gap-1'>
            <button
              className='hover:bg-secondary-foreground bg-secondary rounded px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50'
              onClick={undo}
              disabled={!canUndo}
              title='Undo (Ctrl+Z)'
            >
              ↶ Undo
            </button>
            <button
              className='hover:bg-secondary-foreground rounded bg-gray-100 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50'
              onClick={redo}
              disabled={!canRedo}
              title='Redo (Ctrl+Y)'
            >
              ↷ Redo
            </button>
          </div>

          {/* Sync Status & Controls */}
          <div className='flex items-center gap-2'>
            {syncError && (
              <div
                className='flex items-center gap-1 text-red-500'
                title={syncError}
              >
                <span className='text-xs'>❌ Sync error</span>
              </div>
            )}

            <div className='flex items-center gap-1'>
              <span className='text-xs text-gray-500'>
                {isOnline ? '🌐 Online' : '📴 Offline'}
              </span>
            </div>

            {isPaidUser && isOnline && (
              <button
                className='rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={handleManualSync}
                disabled={isAutoSaving || !isDirty}
                title='Sync to cloud database'
              >
                ☁️ Sync
              </button>
            )}
          </div>
        </div>

        {/* Pro Features Notice */}
        {!isPaidUser && (
          <div className='mt-3 rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700'>
            💡 <strong>Pro Tip:</strong> Upgrade to a paid plan to sync your
            configurations to the cloud and access them from anywhere!
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
}
