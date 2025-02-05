import { db } from "@utils/db";

export const executeQuery = async <T = any>(query: string, values: any[]): Promise<T> => {
  try {
    const [result] = await db.query(query, values);
    return result as T;
  } catch (error) {
    console.error("Query execution failed: " + error);
    throw new Error("Query execution failed: " + error);
  }
};
