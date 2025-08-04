import sql from './postgres-js';
import {
  FormConfigurationType,
  generatePostgresSchema,
} from '@/lib/generateSchema';

// Database record type
interface DatabaseRecord {
  id: string;
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}

// Table column info type
interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

// Function to ensure table exists based on form configuration
export async function ensureTableExists(
  config: FormConfigurationType,
): Promise<void> {
  try {
    const schema = generatePostgresSchema(config);

    // Execute the schema creation SQL
    await sql.unsafe(schema);

    console.log(
      `Table '${config.postgresTableName}' created successfully or already exists`,
    );
  } catch (error) {
    console.error(`Error creating table '${config.postgresTableName}':`, error);
    throw error;
  }
}

// Function to insert form data into the configured table
export async function insertFormData(
  config: FormConfigurationType,
  data: Record<string, unknown>,
): Promise<DatabaseRecord> {
  try {
    // Ensure table exists first
    await ensureTableExists(config);

    // Prepare data with timestamps
    const insertData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert data and return the created record
    const [result] = (await sql`
      INSERT INTO ${sql(config.postgresTableName)} 
      ${sql(insertData)}
      RETURNING id, created_at, updated_at
    `) as DatabaseRecord[];

    return result;
  } catch (error) {
    console.error(
      `Error inserting data into '${config.postgresTableName}':`,
      error,
    );
    throw error;
  }
}

// Function to query form data from the configured table
export async function queryFormData(
  config: FormConfigurationType,
  options: {
    limit?: number;
    offset?: number;
    where?: Record<string, unknown>;
    orderBy?: string;
    orderDir?: 'ASC' | 'DESC';
  } = {},
): Promise<DatabaseRecord[]> {
  try {
    const {
      limit = 50,
      offset = 0,
      where = {},
      orderBy = 'created_at',
      orderDir = 'DESC',
    } = options;

    let query = sql`SELECT * FROM ${sql(config.postgresTableName)}`;

    // Add WHERE conditions if provided
    if (Object.keys(where).length > 0) {
      query = sql`${query} WHERE ${sql(where)}`;
    }

    // Add ORDER BY
    query = sql`${query} ORDER BY ${sql(orderBy)} ${sql(orderDir)}`;

    // Add LIMIT and OFFSET
    query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

    const results = await query;
    return results as unknown as DatabaseRecord[];
  } catch (error) {
    console.error(
      `Error querying data from '${config.postgresTableName}':`,
      error,
    );
    throw error;
  }
}

// Function to update form data in the configured table
export async function updateFormData(
  config: FormConfigurationType,
  id: string,
  data: Record<string, unknown>,
): Promise<DatabaseRecord> {
  try {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };

    const [result] = (await sql`
      UPDATE ${sql(config.postgresTableName)} 
      SET ${sql(updateData)}
      WHERE id = ${id}
      RETURNING *
    `) as DatabaseRecord[];

    return result;
  } catch (error) {
    console.error(
      `Error updating data in '${config.postgresTableName}':`,
      error,
    );
    throw error;
  }
}

// Function to get form data with pagination and filtering
export async function getFormData(
  config: FormConfigurationType,
  options: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
  } = {},
): Promise<{ data: DatabaseRecord[]; total: number }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    // Get total count
    let countQuery = sql`SELECT COUNT(*) as total FROM ${sql(config.postgresTableName)}`;
    if (Object.keys(filters).length > 0) {
      countQuery = sql`${countQuery} WHERE ${sql(filters)}`;
    }
    const countResult = (await countQuery) as unknown as [{ total: number }];
    const total = Number(countResult[0].total);

    // Get paginated data
    let dataQuery = sql`SELECT * FROM ${sql(config.postgresTableName)}`;
    if (Object.keys(filters).length > 0) {
      dataQuery = sql`${dataQuery} WHERE ${sql(filters)}`;
    }

    const orderDirection = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    dataQuery = sql`${dataQuery} ORDER BY ${sql(sortBy)} ${sql(orderDirection)} LIMIT ${limit} OFFSET ${offset}`;

    const data = (await dataQuery) as unknown as DatabaseRecord[];

    return { data, total };
  } catch (error) {
    console.error(
      `Error getting form data from '${config.postgresTableName}':`,
      error,
    );
    throw error;
  }
}

// Function to delete form data from the configured table
export async function deleteFormData(
  config: FormConfigurationType,
  id: string,
): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM ${sql(config.postgresTableName)} 
      WHERE id = ${id}
    `;

    return result.count > 0;
  } catch (error) {
    console.error(
      `Error deleting data from '${config.postgresTableName}':`,
      error,
    );
    throw error;
  }
}

// Function to get table schema information
export async function getTableInfo(tableName: string): Promise<ColumnInfo[]> {
  try {
    const result = (await sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = ${tableName}
      ORDER BY ordinal_position
    `) as ColumnInfo[];

    return result;
  } catch (error) {
    console.error(`Error getting table info for '${tableName}':`, error);
    throw error;
  }
}
