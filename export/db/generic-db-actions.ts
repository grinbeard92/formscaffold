import sql from '@/db/postgres-js';
import { generatePostgresSchema } from '@/scripts/generate-schema';
import { IFormConfiguration } from '@/types/globalFormTypes';

interface DatabaseRecord {
  id: string;
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

export async function ensureTableExists(
  config: IFormConfiguration,
): Promise<void> {
  try {
    const schema = generatePostgresSchema(config);

    await sql.unsafe(schema);

    console.log(
      `Table '${config.postgresTableName}' created successfully or already exists`,
    );
  } catch (error) {
    console.error(`Error creating table '${config.postgresTableName}':`, error);
    throw error;
  }
}

export async function insertFormData(
  config: IFormConfiguration,
  data: Record<string, unknown>,
): Promise<DatabaseRecord> {
  try {
    await ensureTableExists(config);

    const insertData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };

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

export async function queryFormData(
  config: IFormConfiguration,
  options: {
    limit?: number;
    offset?: number;
    where?: Record<string, unknown>;
    orderBy?: string;
    orderDir?: 'ASC' | 'DESC';
  } = {},
): Promise<DatabaseRecord[]> {
  try {
    await ensureTableExists(config);

    const {
      limit = 50,
      offset = 0,
      where = {},
      orderBy = 'created_at',
      orderDir = 'DESC',
    } = options;

    let query = sql`SELECT * FROM ${sql(config.postgresTableName)}`;

    if (Object.keys(where).length > 0) {
      query = sql`${query} WHERE ${sql(where)}`;
    }

    query = sql`${query} ORDER BY ${sql(orderBy)} ${sql(orderDir)}`;

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

export async function updateFormData(
  config: IFormConfiguration,
  id: string,
  data: Record<string, unknown>,
): Promise<DatabaseRecord> {
  try {
    await ensureTableExists(config);

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

export async function getFormData(
  config: IFormConfiguration,
  options: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
  } = {},
): Promise<{ data: DatabaseRecord[]; total: number }> {
  try {
    await ensureTableExists(config);

    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      filters = {},
    } = options;

    let countQuery = sql`SELECT COUNT(*) as total FROM ${sql(config.postgresTableName)}`;
    if (Object.keys(filters).length > 0) {
      countQuery = sql`${countQuery} WHERE ${sql(filters)}`;
    }
    const countResult = (await countQuery) as unknown as [{ total: number }];
    const total = Number(countResult[0].total);

    let dataQuery = sql`SELECT * FROM ${sql(config.postgresTableName)}`;
    if (Object.keys(filters).length > 0) {
      dataQuery = sql`${dataQuery} WHERE ${sql(filters)}`;
    }

    dataQuery = sql`${dataQuery} ORDER BY ${sql(sortBy)} DESC LIMIT ${limit} OFFSET ${offset}`;

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

export async function deleteFormData(
  config: IFormConfiguration,
  id: string,
): Promise<boolean> {
  try {
    await ensureTableExists(config);

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
