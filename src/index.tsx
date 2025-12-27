import { Hono } from "hono";
import posts from "./routes/posts";
import admin from "./routes/admin";
import api from "./routes/api";
import { View } from "./components/view";
import tasks from "./routes/tasks";
import db from "./routes/db";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/page", (c) => {
  return c.html(<View />);
});

app.route("/posts", posts);
app.route("/admin", admin);
app.route("/api", api);
app.route("/tasks", tasks);
app.route("/db", db);

export default app;
