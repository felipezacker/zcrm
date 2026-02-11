// Consolidated UI context (theme + toast)
export { UIProvider, useUI, useTheme, useToast, useOptionalToast } from './UIContext';

// Auth
export { AuthProvider, useAuth } from './AuthContext';

// AI
export { AIProvider, useAI } from './AIContext';

// Domain contexts (internal to CRMProvider)
export { DealsProvider, useDeals, useDealsView } from './deals/DealsContext';
export { ContactsProvider, useContacts } from './contacts/ContactsContext';
export { ActivitiesProvider, useActivities } from './activities/ActivitiesContext';
export { BoardsProvider, useBoards } from './boards/BoardsContext';
export { SettingsProvider, useSettings } from './settings/SettingsContext';

// Combined provider
export { CRMProvider, useCRM } from './CRMContext';
