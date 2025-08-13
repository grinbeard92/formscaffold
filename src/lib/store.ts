import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { createNewSection } from '@/utils/form-builder-utils';

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

interface FormConfigurationStore {
  currentConfig: IFormConfiguration;

  configHistory: IFormConfiguration[];
  historyIndex: number;

  isDirty: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;

  isOnline: boolean;
  isPaidUser: boolean;
  syncError: string | null;

  expandedField: string | null;

  updateConfig: (config: IFormConfiguration) => void;
  updateConfigPartial: (updates: Partial<IFormConfiguration>) => void;
  resetConfig: () => void;
  loadConfig: (config: IFormConfiguration) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  markDirty: () => void;
  markClean: () => void;
  autoSave: () => void;

  syncToDatabase: () => Promise<void>;
  loadFromDatabase: (configId: string) => Promise<void>;
  deleteFromDatabase: (configId: string) => Promise<void>;

  setExpandedField: (fieldId: string | null) => void;
}

const MAX_HISTORY = 50;

export const useFormConfigStore = create<FormConfigurationStore>()(
  persist(
    (set, get) => ({
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

      syncToDatabase: async () => {
        const state = get();
        if (!state.isPaidUser) {
          throw new Error('Database sync is only available for paid users');
        }

        try {
          set({ isAutoSaving: true, syncError: null });

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
        } catch (error) {
          set({
            syncError: error instanceof Error ? error.message : 'Delete failed',
          });
          throw error;
        }
      },

      setExpandedField: (fieldId: string | null) => {
        set({ expandedField: fieldId });
      },
    }),
    {
      name: 'formscaffold-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentConfig: state.currentConfig,
        lastSaved: state.lastSaved,
        isPaidUser: state.isPaidUser,
      }),
    },
  ),
);

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useFormConfigStore.setState({ isOnline: true });
  });

  window.addEventListener('offline', () => {
    useFormConfigStore.setState({ isOnline: false });
  });
}

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
