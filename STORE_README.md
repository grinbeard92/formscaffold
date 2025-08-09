# Form Configuration Store

A comprehensive Zustand-based store for managing form configurations with local storage persistence and provisions for future database synchronization for paid SaaS users.

## Features

### ✅ Currently Implemented

- **Local Storage Persistence**: Automatically saves configurations to localStorage
- **Auto-save**: Saves changes after 1 second of inactivity
- **Undo/Redo History**: Full history management with up to 50 steps
- **Dirty State Tracking**: Tracks unsaved changes
- **Online/Offline Detection**: Monitors network status
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Multiple Store Hooks**: Convenience hooks for different use cases

### 🚀 Future SaaS Features (Ready for Implementation)

- **Database Synchronization**: Sync configurations to cloud database
- **Cross-device Access**: Access configurations from any device
- **User Authentication**: Paid user verification
- **Conflict Resolution**: Handle concurrent edits
- **Configuration Sharing**: Share configurations between users

## Installation

The store is already set up with Zustand. If you need to install dependencies:

```bash
npm install zustand
```

## Usage

### Basic Usage

```typescript
import { useFormConfig } from '@/lib/store';

function FormBuilder() {
  const { config, updateConfig, isDirty, lastSaved } = useFormConfig();

  const handleTitleChange = (title: string) => {
    updateConfig({ ...config, title });
  };

  return (
    <div>
      <input
        value={config.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      {isDirty && <span>Unsaved changes</span>}
    </div>
  );
}
```

### History Management

```typescript
import { useFormHistory } from '@/lib/store';

function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = useFormHistory();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

### Sync Status

```typescript
import { useFormSync } from '@/lib/store';

function SyncStatus() {
  const { isOnline, isPaidUser, syncToDatabase, syncError } = useFormSync();

  const handleSync = async () => {
    if (!isPaidUser) {
      alert('Upgrade to sync to cloud!');
      return;
    }

    try {
      await syncToDatabase();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  return (
    <div>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
      {isPaidUser && (
        <button onClick={handleSync}>Sync to Cloud</button>
      )}
      {syncError && <span>Error: {syncError}</span>}
    </div>
  );
}
```

### Complete Form Builder Integration

```typescript
import { useFormBuilder } from '@/lib/store';

function FormBuilderWithExpandedState() {
  const { config, setConfig, expandedField, setExpandedField } = useFormBuilder();

  return (
    <div>
      {config.sections.map((section) => (
        <div key={section.id}>
          {section.fields.map((field) => (
            <div
              key={field.id}
              onClick={() => setExpandedField(
                expandedField === field.id ? null : field.id
              )}
            >
              <span>{field.label}</span>
              {expandedField === field.id && (
                <div>Expanded field editor...</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Store Structure

### State Properties

| Property        | Type                   | Description                             |
| --------------- | ---------------------- | --------------------------------------- |
| `currentConfig` | `IFormConfiguration`   | Current form configuration being edited |
| `configHistory` | `IFormConfiguration[]` | History of configurations for undo/redo |
| `historyIndex`  | `number`               | Current position in history             |
| `isDirty`       | `boolean`              | Whether there are unsaved changes       |
| `isAutoSaving`  | `boolean`              | Whether auto-save is in progress        |
| `lastSaved`     | `Date \| null`         | When the configuration was last saved   |
| `isOnline`      | `boolean`              | Network connectivity status             |
| `isPaidUser`    | `boolean`              | Whether user has paid subscription      |
| `syncError`     | `string \| null`       | Last synchronization error              |
| `expandedField` | `string \| null`       | Currently expanded field in UI          |

### Actions

| Action                 | Parameters                             | Description                         |
| ---------------------- | -------------------------------------- | ----------------------------------- |
| `updateConfig`         | `config: IFormConfiguration`           | Update entire configuration         |
| `updateConfigPartial`  | `updates: Partial<IFormConfiguration>` | Update specific properties          |
| `resetConfig`          | -                                      | Reset to default configuration      |
| `loadConfig`           | `config: IFormConfiguration`           | Load a configuration                |
| `undo`                 | -                                      | Undo last change                    |
| `redo`                 | -                                      | Redo last undone change             |
| `saveToLocalStorage`   | -                                      | Manually save to localStorage       |
| `loadFromLocalStorage` | -                                      | Load from localStorage              |
| `syncToDatabase`       | -                                      | Sync to cloud database (paid users) |
| `loadFromDatabase`     | `configId: string`                     | Load from cloud database            |
| `deleteFromDatabase`   | `configId: string`                     | Delete from cloud database          |

## Persistence

### Local Storage

- **Key**: `formscaffold-store`
- **Auto-save**: After 1 second of inactivity
- **Data**: Configuration, last saved timestamp, user status
- **Versioning**: Includes version field for future migrations

### Database Sync (Future Implementation)

The store includes placeholders for database operations:

```typescript
// These methods are ready for API implementation
await syncToDatabase(); // POST /api/form-configs
await loadFromDatabase(configId); // GET /api/form-configs/:id
await deleteFromDatabase(configId); // DELETE /api/form-configs/:id
```

## Components

### FormConfigStatus

A complete status component showing:

- Save status (saving, unsaved changes, all saved)
- Last saved timestamp
- Undo/redo controls
- Online/offline status
- Sync controls for paid users
- Pro upgrade notice for free users

## Best Practices

### 1. Use Specific Hooks

```typescript
// ✅ Good - Use specific hooks for specific needs
const { config, updateConfig } = useFormConfig();
const { undo, redo } = useFormHistory();

// ❌ Avoid - Using entire store unnecessarily
const store = useFormConfigStore();
```

### 2. Handle Async Operations

```typescript
// ✅ Good - Handle sync errors
try {
  await syncToDatabase();
} catch (error) {
  // Handle error appropriately
  console.error('Sync failed:', error);
}
```

### 3. Check User Status

```typescript
// ✅ Good - Check paid status before using premium features
if (isPaidUser) {
  await syncToDatabase();
} else {
  showUpgradePrompt();
}
```

### 4. Initialize Store

```typescript
// ✅ Good - Load saved data on app start
useEffect(() => {
  loadFromLocalStorage();
}, []);
```

## Migration Guide

When implementing database sync, update these placeholder methods in `store.ts`:

1. **syncToDatabase**: Replace commented API call with actual endpoint
2. **loadFromDatabase**: Implement configuration loading from API
3. **deleteFromDatabase**: Implement configuration deletion
4. **isPaidUser**: Connect to actual user subscription status

## Demo

Visit `/demo-store` to see the store in action with:

- Live configuration editing
- Real-time save status
- Undo/redo functionality
- Integration examples
- Usage documentation

## File Structure

```
src/
├── lib/
│   └── store.ts                 # Main store implementation
├── components/
│   └── create/
│       ├── FormConfigStatus.tsx # Status component
│       └── FormBuilder.tsx      # Updated to use store
└── app/
    └── demo-store/
        └── page.tsx             # Demo page
```

## Contributing

When extending the store:

1. Add new state properties to the interface
2. Implement actions with proper type safety
3. Update persistence logic if needed
4. Add corresponding hooks for convenience
5. Update this documentation

## Performance Notes

- **History Limit**: Maximum 50 history entries to prevent memory issues
- **Auto-save Debouncing**: 1-second delay to prevent excessive saves
- **Selective Persistence**: Only essential data is persisted to localStorage
- **Lazy Loading**: Configuration loaded only when needed
