import { Hono } from "hono";
// import { tasks, generatedId, Task } from "../data/tasks";
import { neon } from "@neondatabase/serverless";

type Bindings = {
  DATABASE_URL: string;
};

const tasksRoute = new Hono<{ Bindings: Bindings }>();

tasksRoute.get("/", async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const result =
      await sql`SELECT id, title, completed FROM tasks ORDER BY id`;
    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return c.json({ success: false, error: "Failed to fetch tasks" }, 500);
  }
});

tasksRoute.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const sql = neon(c.env.DATABASE_URL);
    const result =
      await sql`SELECT id, title, completed FROM tasks WHERE id = ${id}`;

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          error: "Task not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return c.json({ success: false, error: "Failed to fetch tasks" }, 500);
  }
});

tasksRoute.post("/", async (c) => {
  try {
    const body = await c.req.json<{ title: string; completed?: boolean }>();

    if (!body.title || body.title.trim() === "") {
      return c.json(
        {
          success: false,
          error: "Title is required",
        },
        400
      );
    }

    const sql = neon(c.env.DATABASE_URL);
    const result = await sql`
      INSERT INTO tasks (title, completed)
      VALUES (${body.title}, ${body.completed || false})
      RETURNING id, title, completed
    `;

    return c.json(
      {
        success: true,
        data: result[0],
        message: "Task created successfully",
      },
      201
    );
  } catch (error) {
    console.error("Failed to create task:", error);
    return c.json({ success: false, error: "Failed to create task" }, 500);
  }
});

tasksRoute.put("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json<{ title: string; completed: boolean }>();

    const sql = neon(c.env.DATABASE_URL);
    const result = await sql`
      UPDATE tasks
      SET title = ${body.title}, completed = ${body.completed}
      WHERE id = ${id}
      RETURNING id, title, completed
    `;

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          error: "Task not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0],
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Failed to update task:", error);
    return c.json({ success: false, error: "Failed to update task" }, 500);
  }
});

tasksRoute.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const sql = neon(c.env.DATABASE_URL);
    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${id}
      RETURNING id, title, completed
    `;

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          error: "Task not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0],
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return c.json({ success: false, error: "Failed to delete task" }, 500);
  }
});

export default tasksRoute;
