/**
 * Dynamic Form Router - Generates tRPC procedures based on FormConfiguration
 * This router automatically creates CRUD operations for any form defined in FormConfiguration
 */
import { router, publicProcedure } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { FormConfiguration } from '@/components/form/DemoFormConfiguration';
import { generateZodSchema, createFormSchemas } from '@/lib/generateSchema';
import {
  insertFormData,
  getFormData,
  updateFormData,
  deleteFormData,
} from '@/db/formDatabase';

/**
 * Creates a dynamic tRPC router for a given form configuration
 * This generates all CRUD operations automatically
 */
export function createDynamicFormRouter(config: FormConfiguration) {
  // Generate the Zod schema from form configuration
  const formSchema = generateZodSchema(config);

  // Create the database schema and ensure table exists
  const initializeDatabase = async () => {
    try {
      await createFormSchemas(config);
      console.log(
        `Database table '${config.postgresTableName}' ensured for form: ${config.title}`,
      );
    } catch (error) {
      console.error(
        `Failed to initialize database for form '${config.title}':`,
        error,
      );
    }
  };

  // Initialize database on router creation
  initializeDatabase();

  return router({
    // CREATE - Add new form entry
    create: publicProcedure
      .input(formSchema.omit({ id: true, createdAt: true, updatedAt: true }))
      .mutation(async ({ input }) => {
        try {
          const result = await insertFormData(config, input);
          return {
            success: true,
            data: result,
            message: `${config.title} created successfully`,
          };
        } catch (error) {
          console.error(`Error creating ${config.title}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create ${config.title}`,
            cause: error,
          });
        }
      }),

    // READ - Get form entries with pagination
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
          sortBy: z.string().optional(),
          sortOrder: z.enum(['asc', 'desc']).default('desc'),
          filters: z.record(z.string(), z.unknown()).optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          const result = await getFormData(config, {
            limit: input.limit,
            offset: input.offset,
            sortBy: input.sortBy || 'createdAt',
            sortOrder: input.sortOrder,
            filters: input.filters,
          });

          return {
            success: true,
            data: result.data,
            total: result.total,
            hasMore: result.data.length === input.limit,
          };
        } catch (error) {
          console.error(`Error listing ${config.title}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to fetch ${config.title} list`,
            cause: error,
          });
        }
      }),

    // READ - Get single form entry by ID
    byId: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        try {
          const result = await getFormData(config, {
            filters: { id: input.id },
            limit: 1,
            offset: 0,
          });

          if (!result.data || result.data.length === 0) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `No ${config.title} found with id '${input.id}'`,
            });
          }

          return {
            success: true,
            data: result.data[0],
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error(`Error fetching ${config.title} by ID:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to fetch ${config.title}`,
            cause: error,
          });
        }
      }),

    // UPDATE - Update existing form entry
    update: publicProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: formSchema
            .omit({ id: true, createdAt: true, updatedAt: true })
            .partial(),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          const result = await updateFormData(config, input.id, input.data);

          if (!result) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `No ${config.title} found with id '${input.id}'`,
            });
          }

          return {
            success: true,
            data: result,
            message: `${config.title} updated successfully`,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error(`Error updating ${config.title}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update ${config.title}`,
            cause: error,
          });
        }
      }),

    // DELETE - Delete form entry
    delete: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteFormData(config, input.id);

          if (!result) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `No ${config.title} found with id '${input.id}'`,
            });
          }

          return {
            success: true,
            message: `${config.title} deleted successfully`,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error(`Error deleting ${config.title}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete ${config.title}`,
            cause: error,
          });
        }
      }),

    // BULK OPERATIONS - Bulk insert
    bulkCreate: publicProcedure
      .input(
        z.object({
          items: z.array(
            formSchema.omit({ id: true, createdAt: true, updatedAt: true }),
          ),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          const results = [];
          for (const item of input.items) {
            const result = await insertFormData(config, item);
            results.push(result);
          }

          return {
            success: true,
            data: results,
            message: `${results.length} ${config.title} entries created successfully`,
          };
        } catch (error) {
          console.error(`Error bulk creating ${config.title}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to bulk create ${config.title} entries`,
            cause: error,
          });
        }
      }),

    // SCHEMA INFO - Get form schema information
    getSchema: publicProcedure.query(() => {
      return {
        success: true,
        data: {
          title: config.title,
          description: config.description,
          tableName: config.postgresTableName,
          fields: config.sections.flatMap((section) =>
            section.fields.map((field) => ({
              name: field.name,
              type: field.type,
              required: field.required,
              label: field.label,
            })),
          ),
          zodSchema: formSchema.def,
        },
      };
    }),
  });
}

// Example usage - Create routers for specific forms
// You can import different form configurations and create routers for each
