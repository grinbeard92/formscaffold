import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { createNewSection } from '@/utils/form-builder-utils';

// Base form configuration template
const createDefaultFormConfig = (): IFormConfiguration => ({
  title: 'New Form',
  description: '',
  postgresTableName: 'new_form',
  submitButtonText: 'Submit',
  resetButtonText: 'Reset',
  showResetButton: true,
  showDraftButton: false,
  sections: [createNewSection()],
});

// Types for the store
interface FormConfigurationStore {
  // Current form configuration being edited
  currentConfig: IFormConfiguration;

  // Configuration history for undo/redo
  configHistory: IFormConfiguration[];
  historyIndex: number;

  // Auto-save and sync status
  isDirty: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;

  // SaaS features (for future database storage)
  isOnline: boolean;
  isPaidUser: boolean;
  syncError: string | null;

  // Expanded field state for form builder UI
  expandedField: string | null;

  // Actions
  updateConfig: (config: IFormConfiguration) => void;
  updateConfigPartial: (updates: Partial<IFormConfiguration>) => void;
  resetConfig: () => void;
  loadConfig: (config: IFormConfiguration) => void;

  // History management
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Auto-save and persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  markDirty: () => void;
  markClean: () => void;
  autoSave: () => void;

  // SaaS features (future implementation)
  syncToDatabase: () => Promise<void>;
  loadFromDatabase: (configId: string) => Promise<void>;
  deleteFromDatabase: (configId: string) => Promise<void>;

  // UI state
  setExpandedField: (fieldId: string | null) => void;
}

// Maximum history entries to keep in memory
const MAX_HISTORY = 50;

export const useFormConfigStore = create<FormConfigurationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentConfig: createDefaultFormConfig(),
      configHistory: [],
      historyIndex: -1,
      isDirty: false,
      isAutoSaving: false,
      lastSaved: null,
      isOnline: typeof window !== 'undefined' ? navigator.onLine : false,
      isPaidUser: false, // This would be set based on user subscription
      syncError: null,
      expandedField: null,

      // Core configuration management
      updateConfig: (config: IFormConfiguration) => {
        const state = get();
        const newHistory = [
          ...state.configHistory.slice(0, state.historyIndex + 1),
          { ...state.currentConfig },
        ].slice(-MAX_HISTORY);

        set({
          currentConfig: { ...config },
          configHistory: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
          lastSaved: null,
        });

        // Auto-save after a short delay
        get().autoSave();
      },

      updateConfigPartial: (updates: Partial<IFormConfiguration>) => {
        const state = get();
        const updatedConfig = { ...state.currentConfig, ...updates };
        get().updateConfig(updatedConfig);
      },

      resetConfig: () => {
        set({
          currentConfig: createDefaultFormConfig(),
          configHistory: [],
          historyIndex: -1,
          isDirty: false,
          lastSaved: null,
          expandedField: null,
        });
      },

      loadConfig: (config: IFormConfiguration) => {
        set({
          currentConfig: { ...config },
          configHistory: [],
          historyIndex: -1,
          isDirty: false,
          lastSaved: new Date(),
          expandedField: null,
        });
      },

      // History management
      undo: () => {
        const state = get();
        if (state.canUndo()) {
          const newIndex = state.historyIndex - 1;
          set({
            currentConfig: { ...state.configHistory[newIndex] },
            historyIndex: newIndex,
            isDirty: true,
          });
          get().autoSave();
        }
      },

      redo: () => {
        const state = get();
        if (state.canRedo()) {
          const newIndex = state.historyIndex + 1;
          set({
            currentConfig: { ...state.configHistory[newIndex] },
            historyIndex: newIndex,
            isDirty: true,
          });
          get().autoSave();
        }
      },

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.configHistory.length - 1;
      },

      // Local storage management
      saveToLocalStorage: () => {
        if (typeof window === 'undefined') return;

        try {
          const state = get();
          const dataToSave = {
            currentConfig: state.currentConfig,
            lastSaved: new Date().toISOString(),
            version: '1.0',
          };

          localStorage.setItem(
            'formscaffold-config',
            JSON.stringify(dataToSave),
          );
          set({
            isDirty: false,
            lastSaved: new Date(),
            isAutoSaving: false,
          });
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
          set({ isAutoSaving: false });
        }
      },

      loadFromLocalStorage: () => {
        if (typeof window === 'undefined') return;

        try {
          const saved = localStorage.getItem('formscaffold-config');
          if (saved) {
            const data = JSON.parse(saved);
            if (data.currentConfig && data.version === '1.0') {
              set({
                currentConfig: data.currentConfig,
                lastSaved: data.lastSaved ? new Date(data.lastSaved) : null,
                isDirty: false,
              });
            }
          }
        } catch (error) {
          console.error('Failed to load from localStorage:', error);
        }
      },

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false, lastSaved: new Date() }),

      // Auto-save functionality
      autoSave: (() => {
        let timeout: NodeJS.Timeout;
        return () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const state = get();
            if (state.isDirty && !state.isAutoSaving) {
              set({ isAutoSaving: true });
              state.saveToLocalStorage();
            }
          }, 1000); // Auto-save after 1 second of inactivity
        };
      })(),

      // Future SaaS features
      syncToDatabase: async () => {
        const state = get();
        if (!state.isPaidUser) {
          throw new Error('Database sync is only available for paid users');
        }

        try {
          set({ isAutoSaving: true, syncError: null });

          // TODO: Implement API call to sync configuration to database
          // const response = await fetch('/api/form-configs', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(state.currentConfig),
          // });

          // if (!response.ok) throw new Error('Failed to sync to database');

          set({
            isAutoSaving: false,
            lastSaved: new Date(),
            isDirty: false,
          });
        } catch (error) {
          set({
            isAutoSaving: false,
            syncError: error instanceof Error ? error.message : 'Sync failed',
          });
          throw error;
        }
      },

      loadFromDatabase: async (configId: string) => {
        const state = get();
        if (!state.isPaidUser) {
          throw new Error('Database access is only available for paid users');
        }

        try {
          set({ syncError: null });

          // TODO: Implement API call to load configuration from database
          // const response = await fetch(`/api/form-configs/${configId}`);
          // if (!response.ok) throw new Error('Failed to load from database');
          // const config = await response.json();

          // get().loadConfig(config);

          // Temporary: Use configId parameter to avoid lint warning
          console.log('Loading config with ID:', configId);
        } catch (error) {
          set({
            syncError: error instanceof Error ? error.message : 'Load failed',
          });
          throw error;
        }
      },

      deleteFromDatabase: async (configId: string) => {
        const state = get();
        if (!state.isPaidUser) {
          throw new Error('Database access is only available for paid users');
        }

        try {
          set({ syncError: null });

          // TODO: Implement API call to delete configuration from database
          // const response = await fetch(`/api/form-configs/${configId}`, {
          //   method: 'DELETE',
          // });

          // if (!response.ok) throw new Error('Failed to delete from database');

          // Temporary: Use configId parameter to avoid lint warning
          console.log('Deleting config with ID:', configId);
        } catch (error) {
          set({
            syncError: error instanceof Error ? error.message : 'Delete failed',
          });
          throw error;
        }
      },

      // UI state management
      setExpandedField: (fieldId: string | null) => {
        set({ expandedField: fieldId });
      },
    }),
    {
      name: 'formscaffold-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data to localStorage
        currentConfig: state.currentConfig,
        lastSaved: state.lastSaved,
        isPaidUser: state.isPaidUser,
      }),
    },
  ),
);

// Hook for online status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useFormConfigStore.setState({ isOnline: true });
  });

  window.addEventListener('offline', () => {
    useFormConfigStore.setState({ isOnline: false });
  });
}

// Utility hooks for common operations
export const useFormConfig = () => {
  const store = useFormConfigStore();
  return {
    config: store.currentConfig,
    updateConfig: store.updateConfig,
    updateConfigPartial: store.updateConfigPartial,
    isDirty: store.isDirty,
    lastSaved: store.lastSaved,
  };
};

export const useFormHistory = () => {
  const store = useFormConfigStore();
  return {
    undo: store.undo,
    redo: store.redo,
    canUndo: store.canUndo(),
    canRedo: store.canRedo(),
  };
};

export const useFormSync = () => {
  const store = useFormConfigStore();
  return {
    isOnline: store.isOnline,
    isPaidUser: store.isPaidUser,
    isAutoSaving: store.isAutoSaving,
    syncError: store.syncError,
    syncToDatabase: store.syncToDatabase,
    loadFromDatabase: store.loadFromDatabase,
    deleteFromDatabase: store.deleteFromDatabase,
  };
};

export const useFormBuilder = () => {
  const store = useFormConfigStore();
  return {
    config: store.currentConfig,
    setConfig: store.updateConfig,
    expandedField: store.expandedField,
    setExpandedField: store.setExpandedField,
  };
};
