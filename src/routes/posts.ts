import { Hono } from "hono";

const posts = new Hono();

posts.post("/", (c) => c.text("Created!", 201));

posts.get("/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

posts.delete("/:id", (c) => {
  return c.text(`${c.req.param("id")} is deleted!`);
});

export default posts;
