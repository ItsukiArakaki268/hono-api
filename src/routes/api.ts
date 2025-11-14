import { Hono } from "hono";

const api = new Hono();

api.get("/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

export default api;
