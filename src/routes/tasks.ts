import { Hono } from "hono";
import { tasks, generatedId, Task } from "../data/tasks";

const tasksRoute = new Hono();

tasksRoute.get("/", (c) => {
  return c.json({
    success: true,
    data: tasks,
    count: tasks.length,
  });
});

tasksRoute.get("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const task = tasks.find((t) => t.id === id);

  if (!task) {
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
    data: task,
  });
});

tasksRoute.post("/", async (c) => {
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

  const newTask: Task = {
    id: generatedId(),
    title: body.title,
    completed: body.completed || false,
  };

  tasks.push(newTask);

  return c.json(
    {
      success: true,
      data: newTask,
      message: "Task created successfully",
    },
    201
  );
});

tasksRoute.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<{ title?: string; completed?: boolean }>();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return c.json(
      {
        success: false,
        error: "Task not found",
      },
      404
    );
  }

  if (body.title !== undefined) {
    task.title = body.title;
  }
  if (body.completed !== undefined) {
    task.completed = body.completed;
  }

  return c.json({
    success: true,
    data: task,
    message: "Task updated successfully",
  });
});

tasksRoute.delete("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return c.json(
      {
        success: false,
        error: "Task not found",
      },
      404
    );
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  return c.json({
    success: true,
    data: deletedTask,
    message: "Task deleted successfully",
  });
});

export default tasksRoute;
