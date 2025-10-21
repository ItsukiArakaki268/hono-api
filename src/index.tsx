import { Hono } from "hono";
import { html } from "hono/html";

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

// app.get("/:username", (c) => {
//   const { username } = c.req.param();
//   return c.html(
//     html`<!DOCTYPE html>
//       <h1>Hello! ${username}!</h1>`
//   );
// });

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
