import { neon } from "@neondatabase/serverless";
import { Hono } from "hono";

type Bindings = {
  DATABASE_URL: string;
};

const db = new Hono<{ Bindings: Bindings }>();

db.get("/", async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const response = await sql`SELECT version()`;
    return c.json({ version: response[0]?.version });
  } catch (error) {
    console.log("Database query failed:", error);
    return c.text("Failed to connect to database", 500);
  }
});

export default db;
