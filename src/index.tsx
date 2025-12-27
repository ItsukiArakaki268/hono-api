import { Hono } from "hono";
import { cors } from "hono/cors";
import admin from "./routes/admin";
import { View } from "./components/view";
import tasks from "./routes/tasks";
import db from "./routes/db";

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS設定を追加
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type"],
}));

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
