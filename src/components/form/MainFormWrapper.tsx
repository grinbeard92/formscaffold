/**
 * MainForm - SSR/CSR Separated Architecture
 *
 * This component now properly separates server-side and client-side concerns:
 * 1. Server-side: Processes FormConfiguration, generates Zod schema, strips sensitive data
 * 2. Client-side: Handles form rendering, validation, and submission
 */

// Re-export the ServerForm as MainForm for backward compatibility
export {
  ServerForm as MainForm,
  type ServerFormProps as MainFormProps,
} from './ServerForm';

/**
 * Architecture Overview:
 *
 * ServerForm (SSR):
 * - Processes FormConfiguration server-side
 * - Generates Zod schema from server config
 * - Strips out sensitive server data (DB configs, etc.)
 * - Passes only client-safe data to ClientForm
 *
 * ClientForm (CSR):
 * - Receives sanitized configuration and schema
 * - Handles React Hook Form Controller
 * - Manages form state and submission
 * - Communicates with tRPC for data persistence
 *
 * Benefits:
 * - ✅ Server configs never reach the client
 * - ✅ Zod schema generation happens server-side
 * - ✅ Database configuration stays on server
 * - ✅ Client only receives necessary form data
 * - ✅ Type-safe data transformation
 * - ✅ SSR-friendly architecture
 * - ✅ Maintains backward compatibility
 */
