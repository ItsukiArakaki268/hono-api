import { Hono } from "hono";
import { tasks } from "../data/tasks";

const tasksRoute = new Hono();

tasksRoute.get("/", (c) => {
  return c.json({
    success: true,
    data: tasks,
    count: tasks.length,
  });
});

export default tasksRoute;
