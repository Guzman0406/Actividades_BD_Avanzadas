import { Pool } from "pg";

declare global {
    var pool: Pool | undefined;
}

export const pool = global.pool || new Pool({
    connectionString: process.env.DATABASE_URL
})

global.pool = pool;
