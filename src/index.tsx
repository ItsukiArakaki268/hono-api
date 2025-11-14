import { Hono } from "hono";
import { html } from "hono/html";
import { basicAuth } from "hono/basic-auth";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

app.post("/posts", (c) => c.text("Created!", 201));

app.delete("/posts/:id", (c) => {
  return c.text(`${c.req.param("id")} is deleted!`);
});

app.use(
  "/admin/*",
  basicAuth({
    username: "admin",
    password: "secret",
  })
);

app.get("/admin", (c) => {
  return c.text("You are authorized!");
});

app.get("/admin/detail", (c) => {
  return c.text("Your password is 1234");
});

const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  );
};

app.get("/page", (c) => {
  return c.html(<View />);
});

export default app;
