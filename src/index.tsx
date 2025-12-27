import { Hono } from "hono";
import admin from "./routes/admin";
import { View } from "./components/view";
import tasks from "./routes/tasks";
import db from "./routes/db";

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/page", (c) => {
  return c.html(<View />);
});

app.route("/admin", admin);
app.route("/tasks", tasks);
app.route("/db", db);

export default app;
